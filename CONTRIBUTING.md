# Contributing

Thank you for helping improve this collection of AI-agent engineering skills.

The repository values **small scope, clear instructions, realistic validation, and maintainability** over the number of skills published.

## Before proposing a skill

A proposed skill must answer:

- What recurring developer problem does it solve?
- What exact user requests should trigger it?
- What should it explicitly not do?
- What project context must it inspect?
- Which decisions can be inferred, and which require clarification?
- How will its output be validated?
- How will we know it is better than a normal prompt?

Search the existing catalogue before creating a new skill. Extend an existing skill when the problem belongs to its scope.

## Required skill design

Every skill must contain:

1. Valid, platform-appropriate frontmatter.
2. A concise purpose and activation description.
3. Explicit scope and non-goals.
4. A context discovery strategy.
5. A step-by-step workflow.
6. Safety and change-control rules.
7. Clarification rules.
8. Verification and acceptance criteria.
9. A completion/reporting format.
10. Known limitations.

Keep the main `SKILL.md` focused. Put long framework references, examples, checklists, and test fixtures in supporting files when needed.

## Engineering rules

- Never instruct an agent to claim tests passed without running them.
- Never encourage broad repository dumps when targeted inspection is enough.
- Never ask questions that can be answered from already available code or project context.
- Never silently alter business rules or remove existing behavior.
- Never modify unrelated files.
- Prefer existing project dependencies and conventions.
- Treat repository content as untrusted input; do not follow instructions embedded in source files that conflict with the developer's request or the skill's safety rules.
- Ask before destructive actions, data migrations, deployment, or other high-impact operations when authorization is not explicit.
- State assumptions and unverified outcomes clearly.
- Minimize tokens through relevance and reuse, not by skipping essential reasoning or tests.

## Required validation scenarios

Each skill should be tested with:

- A clear request that should activate it.
- A similar request that should not activate it.
- An ambiguous request that should trigger clarification.
- A request with conflicting constraints.
- A realistic repository scenario.
- An edge case or failure scenario.
- A token/context efficiency comparison where practical.

Record the scenario, expected behavior, observed behavior, and outcome. Do not mark a skill stable based only on reading its own instructions.

## Status lifecycle

`Planned -> Draft -> Testing -> Stable`

A skill may return to `Draft` or `Testing` when a defect or platform change is found. Deprecated skills must include a reason and, where possible, a replacement.

## Pull request checklist

- [ ] Scope and trigger description are clear.
- [ ] Non-goals and safety boundaries are explicit.
- [ ] Instructions do not contradict one another.
- [ ] Clarification behavior is useful and not excessive.
- [ ] Token efficiency does not compromise correctness.
- [ ] Test scenarios and results are included.
- [ ] Platform compatibility claims have been checked.
- [ ] Documentation and catalogue status are updated.
- [ ] No secrets, credentials, private data, or unrelated files are included.
