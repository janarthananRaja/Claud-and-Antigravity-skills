#!/usr/bin/env node
/**
 * COPYTHIS Audit Engine
 * 
 * Deterministic, framework-aware extraction and verification engine.
 * Computes:
 * - Unique semantic source and destination bindings
 * - Rendered control instance counts
 * - Mapping relation M \subseteq S x D
 * - Unmapped source fields (S \setminus D)
 * - Unsupported / hallucinated destination fields (D \setminus S)
 * - Method inventory cross-check
 * - Feature Traceability Matrix
 */

import fs from 'fs';
import path from 'path';

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      params[key] = val;
    }
  }
  return params;
}

function extractBindings(content) {
  const bindings = [];
  // Match formModel.<property> in [(ngModel)], [ngModel], ngModel, interpolation, or expressions
  const formModelRegex = /formModel(?:\?\.|\.)([a-zA-Z0-9_]+)/g;
  let match;
  while ((match = formModelRegex.exec(content)) !== null) {
    bindings.push(match[1]);
  }

  // Also match setScore / select / rating methods passing keys, e.g. setScore('key', ...)
  const keyCallRegex = /(?:setScore|updateRating|selectOption|toggleSelection|onFieldChange)\s*\(\s*['"]([a-zA-Z0-9_]+)['"]/g;
  while ((match = keyCallRegex.exec(content)) !== null) {
    bindings.push(match[1]);
  }

  return bindings;
}

function extractMethods(tsContent) {
  const methods = new Set();
  // Match method definitions: e.g. methodName(param: type): returnType {
  const methodRegex = /(?:public\s+|private\s+|protected\s+|async\s+)*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/g;
  let match;
  const ignored = new Set(['constructor', 'ngOnInit', 'ngOnDestroy', 'ngAfterViewInit', 'ngOnChanges', 'if', 'switch', 'for', 'catch']);
  while ((match = methodRegex.exec(tsContent)) !== null) {
    const name = match[1];
    if (!ignored.has(name)) {
      methods.add(name);
    }
  }
  return Array.from(methods).sort();
}

function extractControlTypes(htmlContent, keys) {
  const controlMap = {};
  for (const key of keys) {
    // Find context around this key
    const idx = htmlContent.indexOf(key);
    if (idx === -1) {
      controlMap[key] = 'Unknown';
      continue;
    }
    const snippet = htmlContent.substring(Math.max(0, idx - 150), Math.min(htmlContent.length, idx + 150));
    if (/setScore|segmented|rating-pill|btn-rating|L1|L2|L3|L4/i.test(snippet)) {
      controlMap[key] = '4-Tier Rating Control (L1-L4/NS)';
    } else if (/<select|dropdown|ion-select/i.test(snippet)) {
      controlMap[key] = 'Dropdown Select';
    } else if (/type=["']checkbox["']|ion-checkbox/i.test(snippet)) {
      controlMap[key] = 'Checkbox';
    } else if (/type=["']radio["']|ion-radio/i.test(snippet)) {
      controlMap[key] = 'Radio Group';
    } else if (/type=["']date["']|<input[^>]+date/i.test(snippet)) {
      controlMap[key] = 'Date Picker';
    } else if (/type=["']number["']/i.test(snippet)) {
      controlMap[key] = 'Number Input';
    } else if (/<textarea/i.test(snippet)) {
      controlMap[key] = 'Text Area';
    } else if (/<input/i.test(snippet)) {
      controlMap[key] = 'Text Input';
    } else {
      controlMap[key] = 'Bound Element';
    }
  }
  return controlMap;
}

export function runAudit({ sourceHtml, sourceTs, destHtml, destTs, approvedAdditions = [] }) {
  const srcHtmlContent = fs.readFileSync(sourceHtml, 'utf-8');
  const dstHtmlContent = fs.readFileSync(destHtml, 'utf-8');
  const srcTsContent = fs.existsSync(sourceTs) ? fs.readFileSync(sourceTs, 'utf-8') : '';
  const dstTsContent = fs.existsSync(destTs) ? fs.readFileSync(destTs, 'utf-8') : '';

  // Extract raw instances
  const srcRaw = extractBindings(srcHtmlContent);
  const dstRaw = extractBindings(dstHtmlContent);

  // Extract unique sets
  const srcUnique = Array.from(new Set(srcRaw)).sort();
  const dstUnique = Array.from(new Set(dstRaw)).sort();

  const srcSet = new Set(srcUnique);
  const dstSet = new Set(dstUnique);
  const approvedSet = new Set(approvedAdditions);

  // Set-theoretic difference
  const unmappedSource = srcUnique.filter(k => !dstSet.has(k));
  const unsupportedDest = dstUnique.filter(k => !srcSet.has(k) && !approvedSet.has(k));

  // Controls
  const srcControls = extractControlTypes(srcHtmlContent, srcUnique);
  const dstControls = extractControlTypes(dstHtmlContent, dstUnique);

  // Methods
  const srcMethods = extractMethods(srcTsContent);
  const dstMethods = extractMethods(dstTsContent);
  const dstMethodSet = new Set(dstMethods);
  const missingMethods = srcMethods.filter(m => !dstMethodSet.has(m));

  // Build Traceability Matrix
  const matrix = srcUnique.map(key => {
    const isMapped = dstSet.has(key);
    const srcCtrl = srcControls[key] || 'N/A';
    const dstCtrl = dstControls[key] || 'N/A';
    const controlMatch = isMapped && srcCtrl === dstCtrl;
    return {
      sourceField: key,
      destinationField: isMapped ? key : '(MISSING)',
      sourceControl: srcCtrl,
      destinationControl: dstCtrl,
      controlTypeFidelity: controlMatch ? 'Exact Match' : isMapped ? 'Adapted' : 'Missing',
      status: isMapped ? 'Verified' : 'Missing'
    };
  });

  const passedCompleteness = unmappedSource.length === 0;
  const passedTraceability = unsupportedDest.length === 0;

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
        missingMethodsCount: missingMethods.length,
        missingMethods: missingMethods,
        completenessGatePassed: passedCompleteness,
        traceabilityGatePassed: passedTraceability
      }
    },
    traceabilityMatrix: matrix
  };
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('audit-engine.mjs')) {
  const args = parseArgs();
  if (!args.sourceHtml || !args.destHtml) {
    console.error('Usage: node audit-engine.mjs --sourceHtml <path> --sourceTs <path> --destHtml <path> --destTs <path> [--output <jsonPath>]');
    process.exit(1);
  }

  const result = runAudit({
    sourceHtml: args.sourceHtml,
    sourceTs: args.sourceTs,
    destHtml: args.destHtml,
    destTs: args.destTs,
    approvedAdditions: args.approved ? args.approved.split(',') : []
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
  console.log(`Method Cross-Check:          ${result.summary.source.methodCount} source vs ${result.summary.destination.methodCount} dest (${result.summary.parity.missingMethodsCount} missing)`);
  console.log(`Completeness Gate:           ${result.summary.parity.completenessGatePassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Traceability Gate:           ${result.summary.parity.traceabilityGatePassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('==================================================================\n');
}
