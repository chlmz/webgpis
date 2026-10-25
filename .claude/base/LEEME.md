# Base de conocimiento del rediseño

Material producido durante el rediseño del sitio (oct/2026) que no forma parte del sitio publicado pero explica cómo se llegó a él. Está dentro de `.claude/`, así que GitHub Pages no lo publica como página; sí es visible en el repositorio, que es **público**.

La historia completa está en el `README.md` de la raíz.

## `capturas/`

Capturas reducidas (JPEG, 1000 px de ancho) de los hitos del rediseño. El número indica el orden.

| Archivo | Qué muestra |
|---|---|
| `01-sitio-anterior-home-escritorio` | Home antes del rediseño (hoy en la rama `legacy`) |
| `02-referencia-profesional-home` | Sitio de referencia hecho por un profesional (rama `referencia-profesional`), del que se tomaron los patrones de la home |
| `03-frase-central-a/b/c` | La frase central de la home encendiéndose con el scroll (versión A elegida) |
| `04-home-*` | Home actual: página completa en escritorio y celular, franja de la Coorte, mapa de la red y pie de página |
| `05-coorte-*` | Página de la Coorte de Nascimentos de Rio Grande 2019 |
| `06-rede-*` | Página Rede (franja del curso de vida, socios, Rede nacional) |
| `07-impacto-*` | Página Impacto y su cierre que se escribe solo |
| `08-equipe-escritorio` | Página Equipe |
| `09-familias-*` | Página Para as famílias |
| `10-ingles-home` | Versión en inglés (`/en/`) |
| `11-gestos-*` | Hojas con el gesto del símbolo del GPIS en cada página interna (cuadro intermedio y final) |
| `12-logos-instituciones` | Control de los logos institucionales |

## `demos/`

Prototipos sueltos que se mostraron antes de construir. Se abren directamente en el navegador.

- `simbolo-gpis.html` — demo del símbolo del GPIS en vectores con un gesto por tema. Publicado como artifact: https://claude.ai/artifact/5btoLQ5KXmhLZJJxMCFEuZ
- `frase-central.html` — las tres versiones de la frase central (A palabras que se encienden, B puntos, C preguntas). Artifact: https://claude.ai/artifact/A7bWFwAorKdZJz155AnTMq
- `canvas-direcciones/` — primeras direcciones de diseño (A, B, C) para home e interna. Artifact: https://claude.ai/artifact/K4Nytci7sLBG7VCKm6EVrh

## `redcap/`

- `redcap_atualizacao_cadastro.csv` — diccionario de datos REDCap (17 campos, 10 marcados como identificadores, todo condicionado al consentimiento) para el futuro formulario "Atualizar meu cadastro" de las familias. Tiene un marcador `[TEXTO SOBRE PRIVACIDADE E LGPD APROVADO PELO CEP]` que debe reemplazarse por el texto aprobado. Aún no está en uso: hoy el botón abre WhatsApp.

## `qa/`

Scripts usados para verificar el sitio. Necesitan Node y Playwright (`npm i -g playwright && npx playwright install chromium`).

- `preparar.sh` — descarga Bootstrap, d3, topojson, el atlas y axe-core en una carpeta de trabajo (los scripts los sirven localmente con `page.route`, útil cuando el CDN está bloqueado).
- `shot-ours.js` — captura página completa en escritorio (1440) y celular (390), con errores de JS y desborde horizontal. `node shot-ours.js <carpeta> <url> <nombre>`
- `axe.js` — auditoría WCAG A/AA con axe-core (servidor local en el puerto 8765).
- `shot-gestures.js` — captura el gesto del símbolo en cada página interna.
- `overflow.js`, `verify.cjs` — controles auxiliares de desborde y de capturas.
- `links.py` — revisa que ningún enlace relativo esté roto. `python3 .claude/base/qa/links.py`
