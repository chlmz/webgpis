# WEBGPIS — Codex project instructions

## Repository and production

Repository:
chlmz/webgpis

Production:
https://chlmz.github.io/webgpis/

GitHub `main` is the source of truth.

This is a static HTML/CSS/JavaScript site using Bootstrap via CDN.
There is no application build step.

## Critical remote-state rule

Before any task that depends on the current website:

1. Identify local branch and HEAD.
2. Fetch/refresh GitHub remote state.
3. Identify `origin/main`.
4. Confirm what commit is actually being inspected.

Never treat an old Cloud task workspace or stale checkout as the current repository.

If current GitHub state is required and GitHub fetch/auth/network access fails:
STOP and report the failure.
Do not perform the audit or implementation against stale files.

## Task isolation

Codex Cloud tasks are isolated workspaces.

Do not assume:
- files modified in another Codex task are present;
- another task's uncommitted state is current;
- an older task represents current main.

Important work must exist in Git/source control.

## Git workflow

For implementation tasks:

1. Start from current verified `origin/main`.
2. Create a focused feature/fix branch.
3. Never implement directly on `main` unless explicitly instructed.
4. Keep changes limited to the requested scope.
5. Run QA.
6. Commit with a focused commit message.
7. Push only the feature branch.
8. Report local and remote commit SHAs.
9. Do not merge to `main` without explicit owner approval.

Never:
- force push;
- discard unrelated work;
- reset/restore unknown user changes;
- use `git clean` on user workspaces.

## Approved visual direction

The approved design language is “GPIS Minimal”:
- academic
- editorial
- human
- institutional
- restrained
- contemporary

Do not reopen the overall visual design unless explicitly requested.

Do not perform unsolicited:
- hero redesigns;
- palette changes;
- typography changes;
- card redesigns;
- navigation restructuring.

Prefer targeted fixes.

## Institutional identity

Exact name:

Grupo de Pesquisa e Inovação em Saúde

Institution:
FURG

Location:
Rio Grande, Brasil

## Scientific-content rules

Never invent:
- collaborators;
- institutions;
- countries;
- publications;
- grants;
- funding status;
- sample sizes;
- metrics;
- study findings.

For observational research:
avoid causal language unless the source/design supports it.

Use:
- “associado a”
- “relacionado a”
- “observamos”

rather than unsupported causal claims.

## Current scientific network

Do not introduce additional institutions without evidence.

Current network represented on the site:

- Brasil — FURG, Rio Grande
- Reino Unido — Manchester Metropolitan University
- Chile — Universidad del Desarrollo
- Peru — Universidad Científica del Sur

## Current map semantics

Scientific-network map is anchored at:

- FURG / Rio Grande: [-52.0986, -32.0350]
- MMU / Manchester: [-2.2426, 53.4808]
- UDD / Santiago: [-70.6693, -33.4489]
- UCSUR / Lima: [-77.0428, -12.0464]

Edges:

- FURG ↔ MMU
- FURG ↔ UDD
- FURG ↔ UCSUR

Do not add unsupported edges.

## Cache busting

If CSS content changes:
update the CSS cache-buster consistently across every public HTML page.

If JS content changes:
update the JS cache-buster consistently across every public HTML page.

Do not change cache-busters when the corresponding asset did not change.

Keep functional changes and cache-buster-only changes distinguishable where practical.

## QA

Primary structural check:

node tools/qa/structural-check.cjs

For relevant changes also verify:

- exactly one H1 per page;
- no duplicate IDs;
- internal links;
- fragment targets;
- canonical URLs;
- sitemap coverage;
- Open Graph metadata;
- Twitter metadata;
- local asset references;
- responsive behavior;
- mobile navigation;
- accessibility labels;
- no obvious horizontal overflow.

For map changes also verify:
- exactly four nodes;
- intended edges only;
- marker radius unchanged unless explicitly requested;
- map fallback behavior.

## Public/indexable pages

Do not hard-code this list in reasoning without checking the repo because the site evolves.

Use the repository QA list and sitemap as current sources of truth.

The 404 page must not be included in sitemap indexing.

## Collaboration/contact

General GPIS:
chlmz@furg.br

Coorte Rio Grande 2019:
coorteriogrande2019@gmail.com

Do not invent additional contact addresses.

## Reporting after implementation

Always report:

- verified starting `origin/main` SHA;
- feature branch;
- files changed;
- what changed;
- QA/tests executed;
- failures or limitations;
- commit SHA;
- remote branch SHA;
- whether working tree is clean;
- whether merge was performed.

Use one of:

READY FOR OWNER REVIEW

or

NEEDS ATTENTION

Never claim remote verification, browser verification, deployment success, or push success if it could not actually be checked.
