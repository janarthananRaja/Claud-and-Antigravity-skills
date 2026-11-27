# TESTTHIS Phase 2 API Integration Report — Project B (`SKA-React-web` $\to$ `CSK_ACADEMY-2`)

**Skill Status:** `Draft` (**0 / 4** release gates closed)  
**Overall Assessment:** `Not verified` *(Test-environment / runtime target mismatch)*  
**Target:** `http://localhost:8025` (`PID 7568`)

---

## 1. Reclassification & Root Cause
* **What Happened:** All 6 smoke-test `POST` requests executed at the HTTP transport level and returned `404 Not Found`.
* **Why `Failed` Was Incorrect:** `PID 7568` (`C:\Program Files\Java\jdk-17\bin\java.exe`) was serving `CSK_ACADEMY` on port `8025`, **not** the intended `CSK_ACADEMY-2` backend.
* **Correct Classification:**
  * **Execution Status:** `Executed`
  * **Assertion Status:** `Not assessable against intended target` (`Not verified`)
  * **Observation Status:** `Unexpected runtime target detected (PID 7568 returned HTTP 404)`

---

## 2. Endpoint Results (6 of 38 Analytics Endpoints Smoke-Tested)

| Test ID | Endpoint | HTTP | Latency | Execution | Assertion | Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `TT-B-API-01` | `/schedule-analytics/summary` | `404` | `107 ms` | Executed | Not assessable | **Not verified** |
| `TT-B-API-02` | `/attendance-analytics/summary` | `404` | `10 ms` | Executed | Not assessable | **Not verified** |
| `TT-B-API-03` | `/performance-analytics/summary` | `404` | `6 ms` | Executed | Not assessable | **Not verified** |
| `TT-B-API-04` | `/coach-analytics/summary` | `404` | `5 ms` | Executed | Not assessable | **Not verified** |
| `TT-B-API-05` | `/match-analytics/summary` | `404` | `5 ms` | Executed | Not assessable | **Not verified** |
| `TT-B-API-06` | `/feedback-analytics/skill-rating-summary` | `404` | `6 ms` | Executed | Not assessable | **Not verified** |

---

## 3. `CSK_ACADEMY-2` Packaging & Launch Findings
* **Packaged Artifact:** `C:\GIT NEW\CSK_ACADEMY-2\target\academy-0.0.1-SNAPSHOT.jar`
* **Configured DB:** `jdbc:mysql://localhost:3306/academy` (`ddl-auto=none`)
* **Safe Launch Option:** Can be started on an alternate port (e.g. `--server.port=8026`) without terminating `PID 7568`, if authorized.
