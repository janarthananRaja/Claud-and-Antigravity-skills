# TESTTHIS Benchmark Report — Project B: Cross-Stack Validation (`SKA-React-web`)

**Skill Status:** `Draft`  
**Overall Assessment:** `Failed` (**3 Passed**, **2 Failed**, **0 Warnings**, **2 Not Verified** — Total: **7**)  
**Target:** `c:\GIT NEW\SKA-React-web` (Isolated copy tested; original repo untouched)

---

## 1. Stack & Architecture Discovery
- **Frontend:** React `18.3.1`, Vite `5.4.8`, TypeScript, Tailwind CSS `3.4.1`.
- **Supabase / Database Finding:** `@supabase/supabase-js` is declared in `package.json`, **but is never imported or called anywhere in `src/`**, and **0 `.sql` / migration / RLS files exist**. Data fetching is routed through `src/lib/api.ts` (REST API).

---

## 2. Executed Checks & Exit Codes

| Test ID | Layer | Command | Exit Code | Execution | Assertion | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TT-B-DISC-01` | Stack Discovery | `package.json` & `src/` | `0` | Executed | Passed | **Passed** |
| `TT-B-INST-01` | Install (Isolated) | `npm ci` | `0` | Executed | Passed | **Passed** *(22 npm audit vulns)* |
| `TT-B-STAT-01` | Static Analysis | `npm run typecheck` | `2` | Executed | **Failed** | **Failed** (`TS6133` in `src/lib/api.ts:52`) |
| `TT-B-STAT-02` | Static Analysis | `npm run lint` | `1` | Executed | **Failed** | **Failed** (`82 errors, 16 warnings`) |
| `TT-B-BLD-01` | Build | `npm run build` | `0` | Executed | Passed | **Passed** (`dist/` built in 6.05s) |
| `TT-B-UNIT-01` | Unit / Component | `*.test.*` / `*.spec.*` | `0` | Executed | Not verified | **Not verified** (`0` test files) |
| `TT-B-DB-01` | Database / RLS | `supabase` / `*.sql` scan | `0` | Executed | Not verified | **Not verified** *(Unused in `src/`; no SQL/RLS files)* |

---

## 3. Confirmed Defects & Risks
1. **`TT-B-STAT-01` (Low):** `src/lib/api.ts(52,10)` — unused `getController` causes `tsc --noEmit` to fail (`exit 2`).
2. **`TT-B-STAT-02` (Medium):** ESLint fails (`exit 1`) with 82 errors (`@typescript-eslint/no-explicit-any`, `no-unused-vars`) and 16 warnings (`react-hooks/exhaustive-deps`).
3. **Dependency Risk (`TT-B-INST-01`):** `npm audit` flagged 22 vulnerabilities (2 low, 6 moderate, 14 high).
