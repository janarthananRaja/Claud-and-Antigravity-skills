import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeTokenEfficiency } from './token-efficiency.mjs';

const validMeasurement = () => ({
  schemaVersion: 1,
  metadata: {
    benchmarkId: 'unit-test',
    taskId: 'same-task',
    agent: 'test-agent',
    model: 'test-model',
    environment: 'fixture-revision',
    measurementSource: 'provider-usage',
    recordedAt: '2026-11-27'
  },
  stages: [{
    name: 'discovery',
    pairs: [
      { id: 'pair-1', baseline: { inputTokens: 100, outputTokens: 20 }, optimized: { inputTokens: 50, outputTokens: 10 } },
      { id: 'pair-2', baseline: { inputTokens: 120, outputTokens: 20 }, optimized: { inputTokens: 60, outputTokens: 10 } }
    ]
  }]
});

test('calculates per-stage and weighted overall token reduction', () => {
  const result = analyzeTokenEfficiency(validMeasurement());
  assert.equal(result.summary.baselineTotalTokens, 260);
  assert.equal(result.summary.optimizedTotalTokens, 130);
  assert.equal(result.summary.reductionPercent, 50);
  assert.equal(result.stages[0].pairedRuns, 2);
  assert.equal(result.stages[0].baseline.meanTokensPerRun, 130);
  assert.equal(result.stages[0].optimized.meanTokensPerRun, 65);
});

test('rejects estimated or unknown measurement sources', () => {
  const data = validMeasurement();
  data.metadata.measurementSource = 'character-estimate';
  assert.throws(() => analyzeTokenEfficiency(data), /measurementSource/);
});

test('rejects missing token counts', () => {
  const data = validMeasurement();
  delete data.stages[0].pairs[0].baseline.outputTokens;
  assert.throws(() => analyzeTokenEfficiency(data), /outputTokens/);
});

test('rejects duplicate pair ids', () => {
  const data = validMeasurement();
  data.stages[0].pairs[1].id = 'pair-1';
  assert.throws(() => analyzeTokenEfficiency(data), /Duplicate pair id/);
});

test('rejects zero-token baselines', () => {
  const data = validMeasurement();
  data.stages[0].pairs = [{
    id: 'pair-1',
    baseline: { inputTokens: 0, outputTokens: 0 },
    optimized: { inputTokens: 0, outputTokens: 0 }
  }];
  assert.throws(() => analyzeTokenEfficiency(data), /zero baseline tokens/);
});
