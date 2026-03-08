# Dependency License Audit — UncookedAura Frontend

**Audit date:** March 2026  
**Scope:** `app/` (frontend) — all npm dependencies  
**Tool:** `npx license-checker`

---

## Summary

**No dependencies were found that prohibit or restrict personal use.** All third-party packages use licenses that allow personal use (MIT, Apache-2.0, ISC, BSD, MPL-2.0, Unlicense, CC0-1.0, 0BSD, CC-BY-4.0, LGPL-3.0, Python-2.0, BlueOak-1.0.0).

---

## License distribution

| License | Count | Personal use |
|--------|-------|--------------|
| MIT | 595 | Allowed |
| Apache-2.0 | 129 | Allowed |
| ISC | 42 | Allowed |
| BSD-2-Clause | 15 | Allowed |
| BSD-3-Clause | 10 | Allowed |
| BlueOak-1.0.0 | 10 | Allowed |
| MIT OR Apache-2.0 | 3 | Allowed |
| MPL-2.0 | 3 | Allowed |
| Unlicense | 3 | Allowed |
| Apache-2.0 AND LGPL-3.0-or-later | 2 | Allowed (see note) |
| CC-BY-4.0 | 1 | Allowed (attribution required) |
| CC0-1.0 | 1 | Allowed |
| 0BSD | 1 | Allowed |
| (MIT OR CC0-1.0) | 1 | Allowed |
| Python-2.0 | 1 | Allowed |
| UNLICENSED | 1 | N/A (project itself) |

---

## Notable packages

### UNLICENSED — `app@0.1.0`

- **What it is:** The UncookedAura app itself (this project), not an external dependency.
- **Why:** `package.json` has `"private": true` and `"license": "UNLICENSED"` (or no license), meaning the project is proprietary and not licensed for reuse by others.
- **Action:** None. This is your own code.

### Apache-2.0 AND LGPL-3.0-or-later — `@img/sharp-win32-x64` (0.33.5, 0.34.5)

- **What it is:** Sharp image processing library (native bindings for libvips).
- **LGPL note:** LGPL allows use and linking. If you distribute a modified version of the LGPL library, you must provide source. Using sharp as an unmodified dependency in a web app is standard and allowed for personal use.
- **Action:** None for personal use. If you distribute the app, ensure Sharp’s license file/attribution is included and LGPL obligations are met if you ever modify and redistribute sharp itself.

### CC-BY-4.0 — `caniuse-lite@1.0.30001777`

- **What it is:** Browser compatibility data.
- **Note:** Creative Commons Attribution 4.0 — allows use with attribution.
- **Action:** Include attribution in your credits (e.g. CREDITS.md) if not already present.

### Python-2.0 — `argparse@2.0.1`

- **What it is:** Argument parser (Python Software Foundation license).
- **Note:** Permissive, allows personal and commercial use.
- **Action:** None.

---

## Dependencies that do NOT restrict personal use

All audited dependencies permit personal use. None use licenses such as:

- BSL (Business Source License)
- SSPL (Server Side Public License)
- Commons Clause
- Custom “no personal use” or “commercial only” terms

---

## Recommendations

1. **Credits:** Add a `CREDITS.md` or similar listing major dependencies (Next.js, React, shadcn, Tailwind, etc.) and any that require attribution (e.g. caniuse-lite CC-BY-4.0, OpenStreetMap/Nominatim).
2. **Re-audit:** Run `npx license-checker` periodically when adding dependencies.
3. **New dependencies:** Before adding a package, check its license and terms of service for personal-use restrictions.

---

## How to re-run the audit

```bash
cd app
npx license-checker
npx license-checker --summary
npx license-checker --json > license-report.json
```
