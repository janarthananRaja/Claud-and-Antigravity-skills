#!/usr/bin/env node
/**
 * COPYTHIS Audit Engine
 * 
 * Deterministic, framework-aware extraction and verification engine.
 * Computes:
 * - Unique semantic source and destination bindings
 * - Rendered control instance counts
 * - Mapping relation M \subseteq S x D (handling framework aliases and renames)
 * - Unmapped source fields: { s \in S | \neg\exists d: (s,d) \in M }
 * - Unsupported / hallucinated destination fields: { d \in D | \neg\exists s: (s,d) \in M and d \notin ApprovedAdditions }
 * - Method & capability cross-check under method mapping M_methods
 * - Feature Traceability Matrix
 */

import fs from 'fs';
import path from 'path';

export function parseArgs(rawArgs = process.argv.slice(2)) {
  const params = {};
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith('--')) {
      const key = rawArgs[i].substring(2);
      const val = rawArgs[i + 1] && !rawArgs[i + 1].startsWith('--') ? rawArgs[++i] : true;
      params[key] = val;
    }
  }
  return params;
}

export function extractBindings(content) {
  const bindings = [];
  // Match formModel.<property> in [(ngModel)], [ngModel], ngModel, interpolation, or expressions
  const formModelRegex = /formModel(?:\?\.|\.)([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let match;
  while ((match = formModelRegex.exec(content)) !== null) {
    bindings.push(match[1]);
  }

  // Also match setScore / select / rating methods passing keys, e.g. setScore('key', ...)
  const keyCallRegex = /(?:setScore|updateRating|selectOption|toggleSelection|onFieldChange)\s*\(\s*['"]([a-zA-Z_$][a-zA-Z0-9_$]*)['"]/g;
  while ((match = keyCallRegex.exec(content)) !== null) {
    bindings.push(match[1]);
  }

  return bindings;
}

export function extractMethods(tsContent) {
  const methods = new Set();
  // Match method definitions anchored at line start inside TS class bodies:
  // e.g.   methodName(arg: type): void {
  // Avoid inline calls like foo.substring(0, 10) or statements
  const methodRegex = /^\s*(?:public\s+|private\s+|protected\s+|async\s+)*(?:get\s+|set\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*(?::\s*[^{;\n]+)?\s*\{/gm;
  let match;
  const keywords = new Set([
    'constructor', 'ngOnInit', 'ngOnDestroy', 'ngAfterViewInit', 'ngOnChanges',
    'if', 'else', 'switch', 'case', 'for', 'while', 'do', 'catch', 'finally', 'try', 'return', 'with'
  ]);

  while ((match = methodRegex.exec(tsContent)) !== null) {
    const name = match[1];
    if (!keywords.has(name) && !/^\d+$/.test(name)) {
      methods.add(name);
    }
  }
  return Array.from(methods).sort();
}

export function extractControlTypes(htmlContent, keys) {
  const controlMap = {};
  for (const key of keys) {
    const idx = htmlContent.indexOf(key);
    if (idx === -1) {
      controlMap[key] = 'Unknown';
      continue;
    }
    // Find enclosing tag and line
    const lineStart = htmlContent.lastIndexOf('\n', idx);
    const lineEnd = htmlContent.indexOf('\n', idx);
    const line = htmlContent.substring(lineStart === -1 ? 0 : lineStart, lineEnd === -1 ? htmlContent.length : lineEnd);

    const tagOpen = htmlContent.lastIndexOf('<', idx);
    const tagClose = htmlContent.indexOf('>', idx);
    const tag = (tagOpen !== -1 && tagClose !== -1 && tagClose > tagOpen && idx - tagOpen < 200)
      ? htmlContent.substring(tagOpen, tagClose + 1)
      : '';

    if (/<select\b|<ion-select\b/i.test(tag) || /<select\b|<ion-select\b/i.test(line)) {
      controlMap[key] = 'Dropdown Select';
    } else if (/<textarea\b|<ion-textarea\b/i.test(tag) || /<textarea\b|<ion-textarea\b/i.test(line)) {
      controlMap[key] = 'Text Area';
    } else if (/type=["']checkbox["']|<ion-checkbox\b/i.test(tag) || /type=["']checkbox["']/i.test(line)) {
      controlMap[key] = 'Checkbox';
    } else if (/type=["']radio["']|<ion-radio\b/i.test(tag) || /type=["']radio["']/i.test(line)) {
      controlMap[key] = 'Radio Group';
    } else if (/type=["']date["']/i.test(tag) || /<input[^>]+date/i.test(line)) {
      controlMap[key] = 'Date Picker';
    } else if (/type=["']number["']/i.test(tag)) {
      controlMap[key] = 'Number Input';
    } else if (/<input\b|<ion-input\b/i.test(tag)) {
      controlMap[key] = 'Text Input';
    } else if (/setScore|segmented|rating-pill|btn-rating|L1|L2|L3|L4/i.test(line)) {
      controlMap[key] = '4-Tier Rating Control (L1-L4/NS)';
    } else {
      controlMap[key] = 'Bound Element';
    }
  }
  return controlMap;
}

/**
 * Runs the deterministic completeness & interaction parity audit.
 * Enforces mapping relation M \subseteq S x D.
 */
export function runAudit({
  sourceHtml,
  sourceTs,
  destHtml,
  destTs,
  approvedAdditions = [],
  mapping = {}
}) {
  const srcHtmlContent = fs.readFileSync(sourceHtml, 'utf-8');
  const dstHtmlContent = fs.readFileSync(destHtml, 'utf-8');
  const srcTsContent = fs.existsSync(sourceTs) ? fs.readFileSync(sourceTs, 'utf-8') : '';
  const dstTsContent = fs.existsSync(destTs) ? fs.readFileSync(destTs, 'utf-8') : '';

  const fieldMapping = mapping.fieldMapping || {};
  const methodMapping = mapping.methodMapping || {};

  // Extract raw instances
  const srcRaw = extractBindings(srcHtmlContent);
  const dstRaw = extractBindings(dstHtmlContent);

  // Extract unique sets
  const srcUnique = Array.from(new Set(srcRaw)).sort();
  const dstUnique = Array.from(new Set(dstRaw)).sort();

  const dstSet = new Set(dstUnique);
  const approvedSet = new Set(approvedAdditions);

  // Evaluate field mapping relation M \subseteq S x D:
  // For each s in S, find d in D such that (s, d) \in M. Default mapping is identity d = s.
  const mappedPairs = [];
  const unmappedSource = [];
  for (const s of srcUnique) {
    const targetD = fieldMapping[s] || s;
    if (dstSet.has(targetD)) {
      mappedPairs.push({ source: s, destination: targetD });
    } else {
      unmappedSource.push(s);
    }
  }

  // Reverse check: Every d in D must be supported by some (s, d) \in M or d \in ApprovedAdditions
  const mappedDests = new Set(mappedPairs.map(p => p.destination));
  const unsupportedDest = dstUnique.filter(d => !mappedDests.has(d) && !approvedSet.has(d));

  // Controls
  const srcControls = extractControlTypes(srcHtmlContent, srcUnique);
  const dstControls = extractControlTypes(dstHtmlContent, dstUnique);

  // Methods
  const srcMethods = extractMethods(srcTsContent);
  const dstMethods = extractMethods(dstTsContent);
  const dstMethodSet = new Set(dstMethods);

  // Evaluate method mapping relation:
  const unmappedMethods = [];
  const mappedMethods = [];
  for (const m of srcMethods) {
    const targetM = methodMapping[m] || m;
    if (dstMethodSet.has(targetM)) {
      mappedMethods.push({ source: m, destination: targetM });
    } else {
      unmappedMethods.push(m);
    }
  }

  // Build Traceability Matrix
  const matrix = srcUnique.map(key => {
    const targetD = fieldMapping[key] || key;
    const isMapped = dstSet.has(targetD);
    const srcCtrl = srcControls[key] || 'N/A';
    const dstCtrl = dstControls[targetD] || 'N/A';
    const controlMatch = isMapped && srcCtrl === dstCtrl;
    return {
      sourceField: key,
      destinationField: isMapped ? targetD : '(UNMAPPED)',
      sourceControl: srcCtrl,
      destinationControl: dstCtrl,
      controlTypeFidelity: controlMatch ? 'Exact Match' : isMapped ? 'Adapted' : 'Missing',
      status: isMapped ? 'Verified' : 'Missing'
    };
  });

  const passedCompleteness = unmappedSource.length === 0;
  const passedTraceability = unsupportedDest.length === 0;
  const passedMethods = unmappedMethods.length === 0;

  return {
    summary: {
      source: {
        rawInstanceCount: srcRaw.length,
        uniqueFieldCount: srcUnique.length,
        methodCount: srcMethods.length
      },
      destination: {
        rawInstanceCount: dstRaw.length,
        uniqueFieldCount: dstUnique.length,
        methodCount: dstMethods.length
      },
      parity: {
        unmappedSourceCount: unmappedSource.length,
        unmappedSourceKeys: unmappedSource,
        unsupportedDestCount: unsupportedDest.length,
        unsupportedDestKeys: unsupportedDest,
        unmappedMethodsCount: unmappedMethods.length,
        unmappedMethods: unmappedMethods,
        completenessGatePassed: passedCompleteness,
        traceabilityGatePassed: passedTraceability,
        methodParityPassed: passedMethods
      }
    },
    traceabilityMatrix: matrix
  };
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('audit-engine.mjs')) {
  const args = parseArgs();
  if (!args.sourceHtml || !args.destHtml) {
    console.error('Usage: node audit-engine.mjs --sourceHtml <path> --sourceTs <path> --destHtml <path> --destTs <path> [--mapping <jsonPath>] [--output <jsonPath>]');
    process.exit(1);
  }

  let mapping = {};
  if (args.mapping && fs.existsSync(args.mapping)) {
    mapping = JSON.parse(fs.readFileSync(args.mapping, 'utf-8'));
  }

  const result = runAudit({
    sourceHtml: args.sourceHtml,
    sourceTs: args.sourceTs,
    destHtml: args.destHtml,
    destTs: args.destTs,
    approvedAdditions: args.approved ? args.approved.split(',') : [],
    mapping
  });

  if (args.output) {
    fs.writeFileSync(args.output, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Audit report written to ${args.output}`);
  }

  console.log('\n================== COPYTHIS AUDIT ENGINE REPORT ==================');
  console.log(`Source Unique Bindings:      ${result.summary.source.uniqueFieldCount} (Instances: ${result.summary.source.rawInstanceCount})`);
  console.log(`Destination Unique Bindings: ${result.summary.destination.uniqueFieldCount} (Instances: ${result.summary.destination.rawInstanceCount})`);
  console.log(`Unmapped Source Keys:        ${result.summary.parity.unmappedSourceCount} ${result.summary.parity.unmappedSourceCount > 0 ? JSON.stringify(result.summary.parity.unmappedSourceKeys) : '✅ NONE'}`);
  console.log(`Unsupported Dest Keys:      ${result.summary.parity.unsupportedDestCount} ${result.summary.parity.unsupportedDestCount > 0 ? JSON.stringify(result.summary.parity.unsupportedDestKeys) : '✅ NONE'}`);
  console.log(`Method Cross-Check:          ${result.summary.source.methodCount} source vs ${result.summary.destination.methodCount} dest (${result.summary.parity.unmappedMethodsCount} unmapped: ${result.summary.parity.unmappedMethodsCount > 0 ? JSON.stringify(result.summary.parity.unmappedMethods) : '✅ NONE'})`);
  console.log(`Completeness Gate:           ${result.summary.parity.completenessGatePassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Traceability Gate:           ${result.summary.parity.traceabilityGatePassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Method Parity:               ${result.summary.parity.methodParityPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('==================================================================\n');
}
