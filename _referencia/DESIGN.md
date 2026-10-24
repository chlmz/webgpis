---
name: GPIS — Grupo de Pesquisa e Inovação em Saúde
description: International Typographic Style identity program for a FURG life-course health research group.
colors:
  navy: "#0E2347"
  navy-deep: "#091832"
  navy-raise: "#16305B"
  blue: "#3489C0"
  blue-ink: "#1F6AA0"
  blue-light: "#8FC3E6"
  blue-soft: "#DCEBF6"
  green: "#5FAA4E"
  paper: "#FFFFFF"
  mist: "#EEF3F8"
  ink: "#0E2347"
  ink-2: "#3D4E68"
  ink-3: "#5A6A82"
  on-navy-2: "#B8CCE3"
  rule: "rgba(14, 35, 71, 0.16)"
  on-navy-rule: "rgba(184, 204, 227, 0.22)"
  gridline-ink: "rgba(14, 35, 71, 0.07)"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.2rem + 5.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.97
    letterSpacing: "-0.038em"
    fontVariation: "'wdth' 94"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.125rem, 1.4rem + 2.8vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 94"
  headline-sm:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.625rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  numeral:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 82"
rounded:
  none: "0px"
spacing:
  s: "clamp(16px, 1.6vw, 24px)"
  m: "clamp(28px, 3vw, 44px)"
  l: "clamp(56px, 7vw, 112px)"
  xl: "clamp(72px, 10vw, 160px)"
  gutter: "clamp(16px, 3.4vw, 48px)"
  gap: "clamp(16px, 2vw, 28px)"
  max: "1440px"
  header-h: "72px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.navy-raise}"
  button-action:
    backgroundColor: "{colors.green}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "52px"
  button-action-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
  button-action-small:
    backgroundColor: "{colors.green}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "44px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
  button-line-light:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "52px"
  button-line-light-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  filter-chip-pressed:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
  credit-row:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    padding: "14px 0 16px 16px"
  related-tile:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "22px"
  related-tile-hover:
    backgroundColor: "{colors.blue-ink}"
---

# Design System: GPIS — Grupo de Pesquisa e Inovação em Saúde

## Overview

**Creative North Star: "The Swiss Identity Program"**

GPIS is set like an International Typographic Style identity manual printed on white coated stock: a strict 12-column grid that stays visible as hairlines, one grotesque family (Archivo) running flush-left from small credits to poster-scale headlines, and the logo's colours flooding whole regions edge to edge rather than tinting small chips. Navy is the territory; logo blue draws time (the timeline band, progress rules, the cohort line); green appears only where the visitor acts.

Density is deliberately uneven. Large empty navy fields carrying a single 6rem headline collide with dense, ruled lists: research-line indexes, credits tables, publication strips, numbered exits. Everything is square, flat and ruled; depth comes from colour fields and hairlines, never from shadows. Motion is the second signature: content rises, masks or wipes into place on scroll, the logo mark and photographs drift in layered parallax, the cohort line is drawn by scrolling, and a key claim inks in word by word. Every effect has a reduced-motion state that shows the final composition at once.

The system refuses the category default of a photo hero over a row of equal rounded cards, and it refuses decorative labels above headings: headlines speak first.

**Key Characteristics:**
- Visible 12-column gridlines over every section field.
- One family, Archivo, variable width: 94% for headings, 82% for numerals, tabular figures throughout.
- Logo colour fields (navy, blue) at full bleed; green held back for actions.
- Square corners, 1px navy hairlines, 3px blue or navy rules for emphasis.
- Facts as credits tables, never hero-metric columns.
- Scroll-driven motion with a complete reduced-motion fallback.

## Colors

A logo-bound palette: navy dominates, science blue carries time and structure, light blue is the accent on navy, green is the single call to action.

### Primary
- **Logo Navy** (navy): the identity field. Hero fields, closing sections, feature panels, related tiles, primary buttons, profile monograms, step markers, and every hairline rule on white. It is also the text colour (ink).
- **Deep Navy** (navy-deep): footer field and the backing behind duotoned photographs.
- **Raised Navy** (navy-raise): the hover fill of navy buttons, the facts panel inside a navy feature, and the hover wash on numbered exits.

### Secondary
- **Science Blue** (blue): the time colour. The full-width timeline band, scroll-progress bar under the header, step and timeline progress lines, 3px lede rules, research-line numerals, the multiply layer of duotoned photographs, and big block numerals on white.
- **Blue Ink** (blue-ink): text-weight blue on white for links (`go` links), sub-headings in disclosures, publication source names, years in the cohort timeline, profile roles, and the hover fill of related tiles.
- **Light Blue** (blue-light): the accent on navy. Credit separators, exit numerals, page-hero meta lines, question numbers, dt labels in reference panels, impact quote mark, block numerals on navy.
- **Blue Mist Selection** (blue-soft): text-selection highlight only.

### Tertiary
- **Logo Green** (green): actions and focus only. Green action buttons (including the sticky header's "Propor colaboração"), the white button's hover fill, the skip link, and the 3px focus ring.

### Neutral
- **Paper** (paper): default page ground and button text on navy.
- **Mist** (mist): alternate section ground and the hover wash on ruled list rows.
- **Ink** (ink), **Ink 2** (ink-2), **Ink 3** (ink-3): navy-tinted text ramp; headings, body and secondary copy, meta and captions respectively.
- **On-Navy Secondary** (on-navy-2): body and lead copy on navy fields.
- **Rule** (rule): soft section dividers and the inactive track of progress lines.
- **On-Navy Rule** (on-navy-rule): every hairline and gridline on navy (light blue-grey at 22%).
- **Gridline Ink** (gridline-ink): gridlines on white and mist (navy at 7%).

### Named Rules
**The Green Means Go Rule.** Green is reserved for actions (green buttons, the header CTA, the white button's hover) and the focus ring. It never colours tags, labels, icons, rules or decoration.

**The Light Blue On Navy Rule.** On navy, every secondary accent (numerals, separators, meta, labels) is light blue. Science blue and green are not used as text accents on navy.

**The Full-Bleed Field Rule.** Logo colours fill whole regions edge to edge (hero field, band, close, feature). They are not shrunk into tinted cards or badges.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo (same family)
**Label/Mono Font:** Archivo; numerals use the condensed 82% width, not a separate face.

**Character:** a single grotesque doing every job, from small credits to poster headlines, with the variable width axis tightening headings (94%) and numerals (82%). Tabular figures are on globally so years, counts and DOIs align in ruled lists.

### Hierarchy
- **Display** (700, clamp up to 6rem, 0.96–0.98, -0.038em): one per page: home hero, inner page hero, impact hero and the closing headline. Max 11–13ch. Long titles step down to a 5rem cap.
- **Headline** (700, clamp up to 3.75rem, 1.04): section titles (max 14ch, 22ch wide variant), impact block headings, the word-by-word claim.
- **Headline Small** (700, clamp up to 2.625rem): group heads, publication theme heads, feature and reference titles, timeline years; also the 600-weight lede (1.18 line height, max 26ch).
- **Title** (700, clamp up to 1.75rem, 1.12, -0.02em): list-row titles, facet and step headings, profile names, exit values.
- **Lead** (400, 1.25rem, 1.5): section intros (max 34ch) and prose leads.
- **Body** (400, 1.0625rem, 1.6–1.68): prose, max 66ch; facet and profile copy 46–54ch.
- **Label** (600–700, 0.875rem, normal tracking, sentence case): meta, captions, dd lines, filter counts, source lines. Never uppercase-tracked.
- **Numeral** (700, 82% width, -0.02em to -0.04em): credit dt values, band years, block numbers 01–05.

### Named Rules
**The Poster Ceiling Rule.** Display type is capped at 6rem, and no tracking goes tighter than -0.04em. Scale comes from the field around the headline, not from pushing the headline further.

**The Headline Speaks First Rule.** No eyebrow or kicker sits above a heading. Context lives in meta lines below the title or in the ruled list it introduces.

## Layout

A 12-column grid inside a 1440px container with fluid gutters (`gutter`) and column gaps (`gap`). Content sections split 4 + 8: a heading column of 4 (optionally sticky below the 72px header) and a body column from 5 to 12. The home hero splits 7 + 5 (navy field plus research-line index); page heroes put the title on 8 columns and the credits table on the last 3; the close splits 6 + 5 with numbered exits on the right. Full-bleed colour fields extend their padding to align content with the container edge.

Vertical rhythm uses four fluid steps: s (16–24px) inside blocks, m (28–44px) between block parts, l (56–112px) section padding, xl (72–160px) for the ink-in claim. Below 960px every split collapses to one column; below 760px multi-column lists, the band and the steps turn vertical. The desktop nav gives way to a full-screen navy menu at 1240px.

**The Visible Grid Rule.** Every section carries its 12-column gridlines: white-ink hairlines at 22% (on-navy-rule) on navy, navy at 7% (gridline-ink) on white and mist. Gridlines sit beneath content and never take pointer events. Project pages carry them throughout; on the home, impacto, pessoas, publicações and research-line pages most white and mist sections do not carry them yet, which is drift, not an exception.

## Elevation & Depth

The system is flat. Content never gets a shadow; depth comes from tonal fields (paper, mist, navy, navy-raise, navy-deep), hairline rules, and layered parallax (logo mark at about 6–7% opacity drifting behind hero headlines, photographs moving inside fixed frames). The only shadow-like value is a knockout ring (`0 0 0 8px` in the ground colour) that cuts step markers out of their progress line. The sticky header uses 94% white with a backdrop blur so content passes under it.

### Named Rules
**The No Shadow Rule.** Surfaces never lift. If something needs separation, give it a field colour or a rule.

**The Duotone Feature Rule.** Hero and feature photographs are duotoned: grayscale with a slight contrast boost, then a logo-blue multiply layer (55–62%) over a navy backing. In-body activity photographs stay in full colour on purpose, so people and their materials read as real.

## Shapes

Every corner is square (0px), including buttons, filters, monograms, step markers and partner squares. Lines carry the form: 1px navy hairlines open and close every ruled list; 3px rules mark emphasis (blue over a lede, navy under a group or theme head, light blue over a highlight). Small solid squares (5px separators, 12px partner and node markers) stand in for bullets and dots. Hovers on rows and tiles are rectangular washes that scale in from one edge.

## Components

### Buttons
Heavy, square and confident; hover is a fill rising from the bottom edge.
- **Shape:** square corners (0px), 1.5px border in the fill colour, 52px tall (44px small), 700 weight at 1rem.
- **Primary:** navy fill, white text; hover fills with raised navy.
- **Action:** green fill, navy text; hover fills white. This is the only green button and is used for collaboration and contact actions, including the header CTA.
- **Line / Line Light:** transparent with a navy (or 55% white on navy) border; hover fills navy (or white).
- **White:** white fill, navy text on navy fields; hover fills green, as an action.
- **Hover / Focus:** the trailing arrow icon slides 4px right (external links slide up-right); focus is the global 3px green outline at 3px offset.

### Text links ("go" links)
- Blue ink (white on navy), 700 weight, with an arrow; a 2px underline draws in from the left on hover while the arrow slides 4px.

### Chips (publication filters)
- **Style:** square, 1.5px navy border, transparent, 44px tall, 700 weight with a lighter count.
- **State:** hover washes mist; pressed is navy fill with white text.

### Ruled lists (signature)
The main container of the system instead of cards.
- **Index list / rows / exits:** 1px navy rules top and bottom of each row, a numeral or tag column, a title, and an arrow; hover scales a mist (or raised navy on navy) wash in from the left or bottom and slides the arrow.
- **Numbered exits:** decimal-leading-zero counters in light blue lead each closing contact route.
- **Publication strips:** a details/summary row (source, title, finding prefixed "Resultado —", 40px square toggle). Opening it develops the detail panel (fade, 8px rise, blur clearing) and rotates the plus into a cross.

### Credits table
Facts are shown as a credits table: dl rows with the value in the condensed numeral style (dt) and its meaning as a label (dd), each row inset 16px from its hairlines. On navy, rules and dd text switch to the on-navy tokens. Counts may tick up once on entry.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** navy for related-project tiles and reference panels, navy-raise for an inner facts panel; white and mist sections otherwise carry ruled lists, not boxes.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 22px for tiles, spacing m for feature and reference panels.
- **Hover:** related tiles fill with blue ink rising from the bottom.

### Navigation
- **Header:** sticky 72px white bar (94% with blur), navy bottom hairline, logo plus a small two-line descriptor, links at 0.9375rem/600, green small action at the end; a 3px blue reading-progress bar sits on the bottom edge.
- **Links:** hover and current page draw a 2px blue underline in from the left.
- **Mobile (at 1240px and below):** a navy "Menu" button opens a full-screen navy panel revealed by a top-down clip, with 1.75rem ruled links that rise in sequence.

### Timeline band (signature)
A full-width science-blue band split into seven year columns with white hairlines. Crisis years (pandemic, floods) sit under translucent navy columns, and a white cohort line with a square marker is drawn by scrolling. Below 760px it becomes a vertical list with a vertical line.

### Sequences
- **Steps:** square 48px navy numbered markers on a 2px rule that fills with blue as you scroll.
- **Vertical timeline:** 16px square markers outlined in navy that fill blue when they enter view, with blue-ink years.

### Word ink-in claim
A headline-size statement whose words start at 16% navy and ink to full navy (highlighted words to blue ink) as the reader scrolls. With reduced motion it renders fully inked.

### Motion
Ease-out `cubic-bezier(0.16, 1, 0.3, 1)` for nearly everything (0.35–1s), ease-in-out for drawn map arcs. Reveal types: rise (28px), mask (bottom-up clip), wipe (left-to-right clip), and stagger (children 70ms apart). Hero lines rise out of a clip on load. Parallax speeds stay between 0.06 and 0.2. All of it is disabled under reduced motion.

## Do's and Don'ts

### Do:
- **Do** flood whole regions with navy or science blue and set one display headline in the empty field.
- **Do** keep green on actions and the focus ring only; use light blue for every secondary accent on navy.
- **Do** draw the 12-column gridlines on every section: on-navy-rule on navy, navy at 7% on white and mist.
- **Do** present facts as a credits table (dt value, dd meaning, rows inset 16px from hairlines).
- **Do** cap display type at 6rem and keep tracking at or above -0.04em.
- **Do** duotone hero and feature photographs (grayscale plus logo-blue multiply) and leave in-body activity photos in colour.
- **Do** use ruled lists with arrows and numbered exits where another site would use cards.
- **Do** give every motion effect a reduced-motion state that shows the final composition.

### Don't:
- **Don't** put an eyebrow or kicker above a heading.
- **Don't** show facts as a big-number hero-metric column.
- **Don't** use green for tags, labels, rules, icons or decoration.
- **Don't** round corners or add shadows to content.
- **Don't** add a second typeface; vary Archivo's width and weight instead.
- **Don't** fall back to a photo hero over a row of equal rounded cards.
