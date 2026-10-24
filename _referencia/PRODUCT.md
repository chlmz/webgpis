# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: academic researchers and potential partners (Brazilian and international) evaluating whether to collaborate with GPIS, propose an analysis, or request access to Coorte Rio Grande 2019 data. They skim for credibility, scope, methods, findings and a clear contact path.

Secondary (confirmed by existing content, not by interview priority): funders and institutions, students looking for training, and the public/families who take part in the studies.

## Product Purpose

Institutional website of GPIS — Grupo de Pesquisa e Inovação em Saúde (FURG, Rio Grande, Brazil). It explains what the group investigates (how social, family and environmental experiences shape health across the life course and between generations), shows its projects, findings, people and network, and turns interest into collaboration proposals by e-mail.

Success: a researcher understands the group's agenda and the value of its longitudinal data within a minute, finds the evidence (publications, cohort profile) and knows exactly how to propose a collaboration.

## Positioning

A population-based birth cohort (Coorte de Nascimentos Rio Grande 2019, 2,313 perinatal interviews, followed since birth) with pre-crisis baselines for the COVID-19 pandemic and the May 2024 floods in Rio Grande do Sul, combined with record linkage and first-person (wearable camera) observation with computational methods, inside an international network (Brazil, Chile, Peru, United Kingdom).

## Operating Context

Static site hosted on GitHub Pages at https://chlmz.github.io/webgpis/ (canonical URLs, sitemap.xml, robots.txt, 404.html with /webgpis/ absolute links). Content language is Brazilian Portuguese (pt-BR). Collaboration happens through e-mail (chlmz@furg.br for GPIS, coorteriogrande2019@gmail.com for Coorte data requests). A structural QA script (tools/qa/structural-check.cjs) checks one H1 per page, unique IDs, internal links/fragments and sitemap coverage.

## Capabilities and Constraints

- 15 public pages + 404: home, pessoas, impacto, publicacoes, dados, 5 project pages, 4 research-line pages.
- Plain static HTML/CSS/JS, no build step. Page paths and anchors must keep working.
- Copy: keep all facts and sentences; restructure into shorter, scannable blocks, summaries and progressive disclosure (confirmed by user). Do not invent data, claims, testimonials or metrics.
- Images in assets/images/ia are conceptual illustrations, not real participants; captions must keep saying so.

## Brand Commitments

- Name: GPIS — Grupo de Pesquisa e Inovação em Saúde, FURG.
- Logo (assets/logo.png, assets/logo-mark-white.png, favicon) is binding: a network of person nodes in blues and green.
- The logo's colors are binding and must dominate the identity (confirmed by user): navy, science blue, light blue and green from the logo.
- Voice: plain, careful, non-sensational scientific Portuguese; findings phrased with caution about causality ("esteve associado", "não mostra que...").

## Evidence on Hand

- Coorte Rio Grande 2019: 2,313 perinatal interviews (2019), follow-ups through the pandemic, children aged 6 in the current wave; reference cohort profile (Epidemiology and Health, 2025, doi 10.4178/epih.e2025039).
- 11 summarised publications with DOIs (on publicacoes/ and coorte page).
- Team: 11 members with roles, institutions, ORCID/e-mail where given; 3 international collaborators.
- Partners: FURG, Manchester Metropolitan University, Universidad del Desarrollo, Universidad Científica del Sur.
- Photos: assets/images/impacto/* (community activities), assets/images/ia/* (conceptual illustrations), Coorte logo.
- No testimonials, funding figures, rankings or press coverage exist; do not fabricate them.

## Product Principles

1. Credibility through evidence: real numbers, DOIs and methods carry the persuasion, never adjectives.
2. Research with people, not only about them: participants and care are part of the story.
3. Time is the method: longitudinal follow-up and "before and after" are the group's distinctive asset.
4. Every page ends in a clear, specific path to collaborate.
5. Careful language: associations are never presented as causes.

## Accessibility & Inclusion

Existing site already targets WCAG AA contrast, skip link, single H1 and accessible names; keep that floor. Respect reduced-motion preferences.
