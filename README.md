# Claude & Antigravity Skills

A practical, quality-focused collection of reusable skills for AI-assisted software development with **Claude Code**, **Google Antigravity**, and other compatible agent environments.

The goal is not to collect prompts for the sake of collecting prompts. This repository develops carefully scoped engineering skills that help AI coding agents understand a task, inspect the codebase, ask useful questions, make safe changes, validate their work, and explain what they changed.

> **Build one skill at a time. Validate it against real developer problems. Prefer reliable engineering over a large collection of shallow instructions.**

## Why this repository exists

AI-assisted and "vibe-coded" development can be fast, but speed without engineering discipline creates familiar problems:

- Agents make assumptions when requirements are incomplete.
- Large, unfocused repository scans consume context and tokens.
- Existing business rules are accidentally changed during refactoring or migration.
- Components are copied without understanding their dependencies.
- Source-project styling leaks into a destination application.
- Agents introduce duplicate utilities or unnecessary dependencies.
- Implementations are declared complete without meaningful tests.
- Long, repetitive explanations obscure what actually changed.

This project aims to address these problems through reusable, task-specific skills.

## What is a skill?

A skill is a reusable package of instructions, references, templates, and (where useful) scripts that teaches an AI agent how to approach a specific category of work.

A skill should define:

1. **When to use it** — a clear description and activation scope.
2. **What to inspect** — the minimum relevant files and context.
3. **How to reason** — decision rules, constraints, and workflows.
4. **When to clarify** — questions only when important information cannot be inferred.
5. **How to execute** — safe, repository-aware implementation steps.
6. **How to verify** — tests, checks, and evidence required.
7. **How to report** — concise changes, results, and known limitations.

Skills are not a replacement for tools, permissions, tests, or developer judgment. They guide agent behavior; they do not guarantee correctness.

## Design principles

All skills in this repository should follow these principles:

- **Correctness before speed:** do not optimize token usage by skipping essential analysis or validation.
- **Context efficiency:** inspect the smallest relevant scope; expand only when evidence requires it.
- **Clarify intelligently:** inspect available project context before asking; ask concise questions only for consequential ambiguity.
- **Respect existing architecture:** follow the destination project's framework, conventions, dependencies, and patterns.
- **Preserve intent:** do not silently change business rules or user requirements.
- **No false confidence:** never claim a test passed or behavior is equivalent unless verified.
- **Minimal blast radius:** avoid unrelated refactors and unnecessary file changes.
- **Explain uncertainty:** distinguish verified results, assumptions, and unverified areas.
- **Developer control:** do not perform destructive or high-impact actions without appropriate authorization.

## Skill catalogue

| Skill | Purpose | Status |
|---|---|---|
| [copythis](skills/copythis/SKILL.md) | Migrate components and features between projects while preserving behavior and adapting to destination architecture and design | Planned / first skill |

Skill status definitions:

- **Planned:** identified but not yet implemented.
- **Draft:** initial instructions exist; not yet fully tested.
- **Testing:** being evaluated against realistic scenarios.
- **Stable:** documented, tested, and reviewed against its acceptance criteria.
- **Deprecated:** no longer recommended; migration guidance should be provided.

## Development cadence: one skill per day

We deliberately develop **one skill at a time**, aiming for one focused skill per working day. The daily cadence is a quality target, not a deadline that overrides testing.

For each skill:

1. Identify a recurring developer problem.
2. Define scope, non-goals, triggers, and expected outcomes.
3. Research relevant platform capabilities and compatibility requirements.
4. Write the skill instructions and supporting references.
5. Create realistic positive, negative, and ambiguous test scenarios.
6. Test token/context efficiency without sacrificing correctness.
7. Revise unclear or conflicting instructions.
8. Document limitations and usage examples.
9. Mark stable only after acceptance criteria are met.

A skill that needs more than one day stays in testing. We do not ship unfinished instructions just to keep a calendar happy.

## Repository structure

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

Each skill may use a smaller or larger structure depending on complexity. Do not create empty folders or unnecessary files. Keep essential instructions in `SKILL.md`; move detailed reference material into separate files when it improves clarity and context efficiency.

## Platform compatibility

The repository uses the Agent Skills convention where practical, with a `SKILL.md` entry point and optional supporting files.

Platform installation paths and supported metadata can differ. Before publishing installation instructions, verify the current official documentation for each target agent. Do not assume every platform supports every optional field, script, or capability identically.

Typical project-level locations include:

- Claude Code: `.claude/skills/<skill-name>/SKILL.md`
- Google Antigravity: `.agents/skills/<skill-name>/SKILL.md`

These are installation examples, not a promise that every skill feature behaves identically across platforms.

## How to use a skill

1. Open the skill's directory.
2. Read its `SKILL.md` and any referenced guidance.
3. Install or copy it into the supported skills directory for your agent.
4. Start a new task that clearly matches the skill's description.
5. Review the agent's plan, code changes, test results, and limitations.

Always review generated changes before merging or deploying them.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a new skill or changing an existing one.

A useful contribution should solve a real developer problem, have a narrowly defined scope, avoid duplicating another skill, and include a validation plan.

## Roadmap

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for the skill-development process and current priorities.

## Disclaimer

These skills are engineering guidance for AI coding agents. They are not guarantees of correctness, security, regulatory compliance, or production readiness. Developers remain responsible for reviewing code, tests, permissions, and deployment decisions.
