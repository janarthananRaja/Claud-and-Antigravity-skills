# COPYTHIS — Clarification protocol

Inspect available project context before asking the developer.

Ask only when an unresolved answer could materially change migration scope, business behavior, data ownership, security, compatibility, or risk.

## Ask when
- Multiple source candidates match.
- Source/destination cannot be resolved.
- "Copy everything" has unclear boundaries.
- Business rules or expected outcomes conflict.
- API ownership, permissions, persistence, or data mapping are unclear.
- A source platform capability has no safe destination equivalent.
- A suspected source defect creates a consequential preserve-or-fix decision.

## Do not ask when
- The path and component are clear.
- FUNCTIONAL_ONLY resolves the design default.
- The destination architecture answers implementation details.
- The repository already contains the needed information.
- The developer has already answered.

## Question format

Ask one concise message. Group related questions. State what was discovered, then ask only what remains unknown.

Example:

"I found the source feature at `src/features/orders/OrderEditor` and the destination app uses its existing `OrderForm` and shared validation service. The source supports draft save and submit. Should both workflows be migrated, or only submit?"

Do not ask the developer to restate facts already found in code. Pause only the affected implementation while a required answer is missing.
