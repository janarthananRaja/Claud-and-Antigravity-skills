# COPYTHIS token-efficiency benchmark

This benchmark measures actual model-token usage. It does not estimate tokens from characters, line counts, file size, elapsed time, or script runtime.

## What to optimize

Keep migration scope and acceptance criteria fixed. Compare the existing workflow with the efficiency workflow:
- bounded, one-pass source and destination discovery;
- progressive loading of only relevant dependencies;
- one compact task-scoped context ledger;
- targeted line ranges and diffs instead of repeated full-file reads;
- deterministic inventory scripts with compact summaries;
- full matrices and JSON artifacts stored on disk, with only relevant rows brought into model context;
- reuse of still-valid build/test evidence.

Do not remove source inspection, security review, interaction checks, or any required release gate.

## Measurement protocol

1. Pin the same repository revision, task prompt, source/destination scope, agent platform, model/version, and acceptance criteria for both variants.
2. Run baseline and optimized variants as paired runs. Use at least three pairs where practical; more pairs reduce run-to-run noise.
3. Capture actual input and output token counts from provider usage records or agent-platform telemetry for each pair and stage.
4. Include both input and output tokens. Use the same accounting convention for both variants.
5. Keep stage boundaries consistent, for example discovery, binding extraction, implementation review, and verification.
6. Run the calculator and retain both the raw measurement JSON and generated summary.
7. Report per-stage reductions and the weighted overall reduction. Do not average percentages across stages; calculate the overall percentage from total baseline and optimized tokens.
8. If the platform does not expose token usage, mark the result **Not measured**. Qualitative observations may be recorded separately.

## Input format

Create a JSON file with schemaVersion 1, a metadata object, and a stages array. Metadata must include benchmarkId, taskId, agent, model, environment, measurementSource, and recordedAt. measurementSource must be provider-usage or platform-telemetry.

Each stage has a unique name and a pairs array. Each pair has a unique id, baseline, and optimized objects. Each run object contains non-negative integer inputTokens and outputTokens. Use the same pair IDs to identify matched baseline and optimized runs.

Example shape (zero counts are placeholders, not benchmark results):

    {
      "schemaVersion": 1,
      "metadata": {
        "benchmarkId": "copythis-token-study",
        "taskId": "same-task-id",
        "agent": "agent-platform-and-version",
        "model": "model-and-version",
        "environment": "same-repository-revision",
        "measurementSource": "provider-usage",
        "recordedAt": "2026-11-27"
      },
      "stages": [{
        "name": "binding-extraction",
        "pairs": [{
          "id": "pair-01",
          "baseline": { "inputTokens": 0, "outputTokens": 0 },
          "optimized": { "inputTokens": 0, "outputTokens": 0 }
        }]
      }]
    }

Replace placeholder zero values with actual usage counts. Add one pair per repeated baseline/optimized run. The example is a schema illustration, not benchmark data.

## Run

    node skills/copythis/scripts/token-efficiency.mjs --input benchmarks/copythis/token-efficiency/measurement.json --output benchmarks/copythis/token-efficiency/summary.json

The command exits non-zero for missing metadata, invalid counts, duplicate stages/pairs, empty stages, or zero-token baselines.

## Interpretation

- Reduction percentage = (baseline total - optimized total) / baseline total * 100.
- The overall reduction is weighted by actual token totals, not an arithmetic mean of stage percentages.
- Negative reduction means the optimized workflow used more tokens.
- Token savings do not prove behavioral parity and are not a release gate.
- Do not combine estimates with measured provider/platform token counts in one result.
