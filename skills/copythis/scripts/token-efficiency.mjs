#!/usr/bin/env node
/**
 * COPYTHIS token-efficiency calculator.
 * Calculates reductions from paired, provider-reported or platform-telemetry usage.
 * Never estimates tokens from text length, elapsed time, or file size.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function requireText(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('Missing required text: ' + label);
  }
}

function tokenCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(label + ' must be a non-negative integer');
  }
  return value;
}

function runTokens(run, label) {
  if (!run || typeof run !== 'object') throw new Error(label + ' must be an object');
  const inputTokens = tokenCount(run.inputTokens, label + '.inputTokens');
  const outputTokens = tokenCount(run.outputTokens, label + '.outputTokens');
  return { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens };
}

export function analyzeTokenEfficiency(data) {
  if (!data || data.schemaVersion !== 1) throw new Error('schemaVersion must be 1');

  const metadata = data.metadata ?? {};
  for (const key of ['benchmarkId', 'taskId', 'agent', 'model', 'environment', 'recordedAt']) {
    requireText(metadata[key], 'metadata.' + key);
  }
  if (!['provider-usage', 'platform-telemetry'].includes(metadata.measurementSource)) {
    throw new Error('metadata.measurementSource must be provider-usage or platform-telemetry');
  }
  if (!Array.isArray(data.stages) || data.stages.length === 0) {
    throw new Error('At least one comparison stage is required');
  }

  const seenStages = new Set();
  const stages = data.stages.map((stage, stageIndex) => {
    requireText(stage.name, 'stages[' + stageIndex + '].name');
    if (seenStages.has(stage.name)) throw new Error('Duplicate stage name: ' + stage.name);
    seenStages.add(stage.name);
    if (!Array.isArray(stage.pairs) || stage.pairs.length === 0) {
      throw new Error('Stage ' + stage.name + ' requires at least one paired run');
    }

    const seenPairs = new Set();
    let baselineInput = 0;
    let baselineOutput = 0;
    let optimizedInput = 0;
    let optimizedOutput = 0;

    for (const [pairIndex, pair] of stage.pairs.entries()) {
      requireText(pair.id, 'stages[' + stageIndex + '].pairs[' + pairIndex + '].id');
      if (seenPairs.has(pair.id)) throw new Error('Duplicate pair id in ' + stage.name + ': ' + pair.id);
      seenPairs.add(pair.id);
      const baseline = runTokens(pair.baseline, stage.name + '/' + pair.id + '/baseline');
      const optimized = runTokens(pair.optimized, stage.name + '/' + pair.id + '/optimized');
      baselineInput += baseline.inputTokens;
      baselineOutput += baseline.outputTokens;
      optimizedInput += optimized.inputTokens;
      optimizedOutput += optimized.outputTokens;
    }

    const baselineTotal = baselineInput + baselineOutput;
    const optimizedTotal = optimizedInput + optimizedOutput;
    if (baselineTotal === 0) throw new Error('Stage ' + stage.name + ' has zero baseline tokens; reduction is undefined');

    return {
      name: stage.name,
      pairedRuns: stage.pairs.length,
      baseline: {
        inputTokens: baselineInput,
        outputTokens: baselineOutput,
        totalTokens: baselineTotal,
        meanTokensPerRun: baselineTotal / stage.pairs.length
      },
      optimized: {
        inputTokens: optimizedInput,
        outputTokens: optimizedOutput,
        totalTokens: optimizedTotal,
        meanTokensPerRun: optimizedTotal / stage.pairs.length
      },
      tokensSaved: baselineTotal - optimizedTotal,
      reductionPercent: Number(((baselineTotal - optimizedTotal) / baselineTotal * 100).toFixed(2))
    };
  });

  const baselineTotal = stages.reduce((sum, stage) => sum + stage.baseline.totalTokens, 0);
  const optimizedTotal = stages.reduce((sum, stage) => sum + stage.optimized.totalTokens, 0);
  const pairedRuns = stages.reduce((sum, stage) => sum + stage.pairedRuns, 0);

  return {
    schemaVersion: 1,
    benchmark: metadata,
    methodology: 'Paired actual token-usage records; input and output tokens included; no text-length estimation.',
    summary: {
      stageCount: stages.length,
      pairedStageRuns: pairedRuns,
      baselineTotalTokens: baselineTotal,
      optimizedTotalTokens: optimizedTotal,
      tokensSaved: baselineTotal - optimizedTotal,
      reductionPercent: Number(((baselineTotal - optimizedTotal) / baselineTotal * 100).toFixed(2))
    },
    stages
  };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = value;
    }
  }
  return args;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.input) throw new Error('Usage: node token-efficiency.mjs --input <measurement.json> [--output <summary.json>]');
    const measurement = JSON.parse(fs.readFileSync(args.input, 'utf8'));
    const result = analyzeTokenEfficiency(measurement);
    const json = JSON.stringify(result, null, 2);
    if (args.output) fs.writeFileSync(args.output, json + '\n', 'utf8');

    console.log('COPYTHIS TOKEN EFFICIENCY REPORT');
    console.log('Measurement source: ' + result.benchmark.measurementSource);
    console.log('Paired stage runs:  ' + result.summary.pairedStageRuns);
    for (const stage of result.stages) {
      console.log('- ' + stage.name + ': ' + stage.baseline.meanTokensPerRun.toFixed(1) +
        ' -> ' + stage.optimized.meanTokensPerRun.toFixed(1) +
        ' tokens/run (' + stage.reductionPercent + '% reduction)');
    }
    console.log('Overall: ' + result.summary.baselineTotalTokens + ' -> ' +
      result.summary.optimizedTotalTokens + ' tokens (' + result.summary.reductionPercent + '% reduction)');
    if (args.output) console.log('Summary written to ' + args.output);
  } catch (error) {
    console.error('Token efficiency measurement failed: ' + error.message);
    process.exitCode = 1;
  }
}
