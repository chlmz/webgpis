# Recursos e ideas para el futuro

Catálogo vivo de skills, herramientas e ideas que pueden servir en próximas tareas, de este proyecto o de otros. Cada entrada dice qué es, cuándo usarla y en qué estado está. Antes de instalar algo nuevo, revisar su código: una skill son instrucciones que el agente sigue, y algunas traen scripts.

**Estados:** ✅ instalado · 🟡 evaluado, útil más adelante · ⛔ descartado por riesgo · 💡 idea propia

---

## Skills y herramientas

| Estado | Nombre | Qué hace | Cuándo usarlo | Notas de la revisión |
|---|---|---|---|---|
| ✅ | [diagram-design](https://github.com/cathrynlavery/diagram-design) | Diagramas editoriales en HTML/SVG/PNG: líneas de tiempo, flujos, Gantt, Sankey, ER, árboles, Venn, etc. Importa draw.io, Mermaid y Excalidraw. | Línea de tiempo de la Coorte, esquemas de proyectos, figuras para grants, PPGSP, presentaciones, DAGs y flujos de estudio. | MIT, sin telemetría (oct/2026). En este proyecto: `.claude/skills/diagram-design` con la paleta GPIS. En otros: `/plugin marketplace add cathrynlavery/diagram-design` y luego `/plugin install diagram-design@diagram-design`. |
| ✅ | impeccable | Dirección de diseño y calidad visual (refinar, auditar, pulir interfaces). | Cualquier ajuste visual del sitio. | Disponible como skill de la cuenta; usada en el rediseño sobrio. |
| 🟡 | [SwiftUI Pro](https://github.com/twostraws/SwiftUI-Agent-Skill) (`swiftui-pro`) | Buenas prácticas para escribir y revisar apps SwiftUI (Apple). | Solo si algún día se hace una app iOS/macOS, por ejemplo para trabajo de campo de la Coorte. | De Paul Hudson. Pequeña: 24 archivos. |
| 🟡 | [REA — Reverse Engineer Anything](https://github.com/morluto/rea) | Permite al agente inspeccionar software sin código fuente (Ghidra, IDA, navegador). | Entender o automatizar un programa cerrado: un sistema institucional, un formato de exportación desconocido. | Pesado: binarios nativos y `install.sh`. Instalar solo para una tarea concreta y en un entorno separado. |
| 🟡 | [cursor/plugins](https://github.com/cursor/plugins) | Catálogo oficial de plugins de Cursor, con 173 skills (GitHub, Drive, Gmail, Playwright, BigQuery, Excalidraw…). | Como fuente de inspiración y de modelos para empaquetar skills propias. No instalar entero. | Carpetas vistas y aún no revisadas por dentro: `advisor`, `continual-learning`, `docs-canvas`, `pr-review-canvas`, `teaching`, `orchestrate`, `pstack`. |
| ⛔ | [billion-context](https://github.com/ranxianglei/billion-context) | Promete sesiones larguísimas comprimiendo el contexto. | — | No es una skill: es un proxy local que intercepta y reescribe todas las peticiones al modelo, por donde pasarían textos y credenciales. Reconsiderar solo después de una auditoría completa y en una máquina de pruebas. |

---

## Skills propias que valdría la pena crear 💡

Usar la estructura de `diagram-design` como modelo: un `SKILL.md` corto, con referencias por tipo y una guía de estilo como fuente única.

- **epidemiology-analysis:** convenciones de análisis (DAGs, modelos, reporte STROBE).
- **cohort-qc:** control de calidad de datos de la Coorte Rio Grande 2019.
- **grant-review:** revisar propuestas contra los criterios de cada convocatoria.
- **cnpq-audit:** revisar el Lattes y la producción para la productividad del CNPq.

---

## Ideas de diseño para el sitio

- ✅ **Frase central de la home:** versión A aplicada (la frase se escribe con el scroll). Las tres propuestas siguen en https://claude.ai/artifact/A7bWFwAorKdZJz155AnTMq.
- 🟡 **B · 2.313 puntos (gustó mucho).** Usarla en otra sección donde el dato sea el protagonista y el texto no quede arrinconado, por ejemplo la apertura de la página de la Coorte.
- 🟡 **C · las 12 preguntas reales (gustó).** Usarla para otra cosa, por ejemplo la sección de Linhas de pesquisa, donde las preguntas se agrupen en las cuatro líneas.
- 🟡 **Patrones de "scrollytelling"** para otras secciones: sección fija con revelado por scroll, datos que cuentan una historia. Referencias: [maglr](https://www.maglr.com/blog/best-scrollytelling-examples), [reallygooddesigns](https://reallygooddesigns.com/scrollytelling-website-examples/).
- 🟡 **Más fotos reales** (hay 9 en `assets/images`, casi todas sin usar). Antes de usar las que muestran niños, confirmar el permiso de uso.
- ⛔ **Página "Explorar" con buscador y filtros:** probada y rechazada. Está guardada en el commit `1d655a2` por si algún día sirve como base para otra idea.

---

## Cómo agregar una entrada

Una fila por recurso: estado, nombre con enlace, qué hace en una frase, cuándo usarlo y qué se vio al revisarlo (licencia, si trae scripts, si envía datos fuera). Fechar las revisiones, porque los repositorios cambian.
