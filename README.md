# Claude & Antigravity Skills

An open collection of reusable, engineering-focused skills for **Claude Code**, **Google Antigravity**, and compatible AI coding agents.

This project helps agents solve real software-development problems with less duplicated work, better context use, safer code changes, and evidence-based verification.

> **One skill at a time. Real problems. Measurable quality. Less wasted context, not less engineering.**

## Why this exists

AI-assisted development can accelerate delivery, but poorly guided agents can:
- Guess when requirements are incomplete.
- Re-read unchanged files and repeat repository discovery.
- Consume excessive context on broad scans and verbose summaries.
- Accidentally change business rules during migrations or refactors.
- Copy components without understanding dependencies.
- Leak source styling into destination applications.
- Add duplicate packages or utilities.
- Claim success without meaningful verification.

This repository develops focused skills to reduce these failure modes. Token efficiency means eliminating duplicated work, not skipping necessary reasoning, tests, or safety checks.

## What is an agent skill?

A skill is a reusable package of instructions and optional references, templates, examples, or scripts that guides an agent through a specific category of work.

A well-designed skill defines its trigger, scope, discovery strategy, decision rules, clarification behavior, execution workflow, verification criteria, and completion report.

Skills guide agent behavior; they do not replace tools, permissions, tests, or developer review.

## Principles

- **Correctness before speed.**
- **Context efficiency:** inspect relevant files once, record useful findings, and reuse them while they remain valid.
- **Clarify intelligently:** inspect project context before asking consequential questions.
- **Preserve intent:** do not silently change business rules.
- **Respect destination architecture:** reuse existing patterns and dependencies.
- **Minimal blast radius:** avoid unrelated edits and refactors.
- **Evidence over claims:** report what was actually tested and what remains uncertain.
- **Open and reusable:** publish skills with clear usage, compatibility notes, and a permissive license.

## Skill catalogue

| Skill | Purpose | Status |
|---|---|---|
| [copythis](skills/copythis/SKILL.md) | Cross-project component and feature migration with behavioral preservation and destination design isolation | Draft / first skill |

Status lifecycle: **Planned → Draft → Testing → Stable**. A skill is not stable until it passes its documented scenarios in realistic projects.

## One-skill-at-a-time development

We aim to develop one focused skill per day, but quality gates take priority over the calendar.

For each skill:
1. Identify a recurring developer problem.
2. Define scope, triggers, non-goals, and success criteria.
3. Research relevant agent/platform capabilities.
4. Write concise core instructions and load-on-demand references.
5. Create clear, ambiguous, negative, and edge-case scenarios.
6. Test behavior and context/token efficiency.
7. Revise contradictions and weak instructions.
8. Publish compatibility notes and examples.
9. Mark stable only when acceptance criteria are met.

## Repository layout

```text
.
├── README.md
├── CONTRIBUTING.md
├── DEVELOPMENT_ROADMAP.md
├── LICENSE
└── skills/
    └── copythis/
        ├── SKILL.md
        ├── references/
        ├── templates/
        └── tests/
```

Supporting files are loaded only when relevant. Avoid creating empty folders or splitting material without a clear benefit.

## Install a skill

### Claude Code

Copy the skill directory into your project:

```text
.claude/skills/<skill-name>/SKILL.md
```

Or install it in the user-level skills directory supported by your Claude Code version for use across projects.

### Google Antigravity

Copy the skill directory into the workspace:

```text
.agents/skills/<skill-name>/SKILL.md
```

Antigravity also supports user-level skills in its configured global skills location. Check current official documentation for the exact path and supported metadata for your installed version.

### General use

1. Copy the complete skill folder, including any referenced files.
2. Place it in the supported skill directory for your agent.
3. Start a task matching the skill's description.
4. Review the agent's plan, code changes, tests, and limitations.

Platform support and discovery behavior can differ. We do not promise identical behavior across every agent or version.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a skill or change. Contributions should solve a real problem, avoid duplication, and include realistic validation scenarios.

## Roadmap

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for current work and future candidates.

## License

Released under the [MIT License](LICENSE), allowing public use, modification, and redistribution subject to its terms.

## Disclaimer

Skills provide engineering guidance, not guarantees of correctness, security, regulatory compliance, or production readiness. Developers remain responsible for reviewing code, permissions, tests, and deployment decisions.
