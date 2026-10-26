# Sitio web del GPIS

Sitio del **GPIS — Grupo de Pesquisa e Inovação em Saúde** (FURG, Rio Grande, RS). Publicado con GitHub Pages en **https://chlmz.github.io/webgpis/** (portugués) y **https://chlmz.github.io/webgpis/en/** (inglés).

Este README explica qué es el sitio, cómo se trabaja en él y **cómo llegamos hasta aquí**. Es un documento vivo: la sección [Historia](#historia) se actualiza al terminar cada etapa de trabajo (ver [Cómo mantener este README](#cómo-mantener-este-readme)).

> **Atención, repositorio público.** Todo lo que se sube aquí, incluida la carpeta `.claude/`, lo puede leer cualquiera. Hay reglas de contenido confidencial (personas, candidaturas, financiamientos, detalles éticos y de infraestructura de datos) que **no** están escritas en el repositorio a propósito. Antes de agregar contenido nuevo sobre personas, socios, proyectos o financiamiento, consultar al responsable del sitio.

---

## Índice

1. [Qué hay en el sitio](#qué-hay-en-el-sitio)
2. [Cómo está hecho](#cómo-está-hecho)
3. [Trabajar en el sitio](#trabajar-en-el-sitio)
4. [Dirección de diseño](#dirección-de-diseño)
5. [Reglas de contenido](#reglas-de-contenido)
6. [Historia](#historia)
7. [Pendiente](#pendiente)
8. [Base de conocimiento](#base-de-conocimiento)
9. [Cómo mantener este README](#cómo-mantener-este-readme)

---

## Qué hay en el sitio

| Página | Ruta | Contenido |
|---|---|---|
| Home | `/` | Hero, franja de la Coorte 2019→2025, frase central con las 4 líneas de pesquisa, proyectos, mapa de la red, novidades, impacto, equipo, bloque para las familias, contacto |
| Pesquisa (4 líneas) | `/pesquisa/...` | Saúde mental no curso de vida · Saúde entre gerações · Crises e desigualdades · Métodos e inovação |
| Projetos | `/projetos/...` | Coorte de Nascimentos de Rio Grande 2019 · Enchentes e saúde mental · Linkage de dados populacionais · Visão em primeira pessoa e IA · Visões do Cuidado |
| Impacto | `/impacto/` | Oficina con las familias, hallazgos en lenguaje simple, formación (disertaciones), red, cierre |
| Equipe | `/pessoas/` | Equipo del GPIS y franja de colegas internacionales |
| Rede | `/rede/` | Red nacional e internacional organizada por el curso de vida |
| Para as famílias | `/familias/` | Página para las familias de la Coorte: qué es, hallazgos, oficinas, cuidado de los datos y canales (WhatsApp, Instagram, Facebook) |
| Publicações | `/publicacoes/` | Publicaciones |
| Dados | `/dados/` | Datos y colaboración |

Todo existe en portugués (fuente) y en inglés (`/en/`, generado automáticamente).

## Cómo está hecho

- **HTML estático**, una carpeta por página con su `index.html`. Sin framework ni paso de compilación.
- **Bootstrap 5.3.3** desde CDN (jsdelivr). **d3 7.9.0 + topojson** desde unpkg, solo para el mapa de la red.
- **Un solo CSS** (`assets/css/styles.css`) y **un solo JS** (`assets/js/main.js`).
- **Tipografía:** Schibsted Grotesk (títulos) y Source Sans 3 (texto), desde Google Fonts.
- **Publicación:** GitHub Pages desde la rama `main`. No hay `.nojekyll`, así que Pages pasa el sitio por Jekyll; las carpetas que empiezan con punto (`.claude/`) no se publican como páginas.

### Estructura

```
index.html            home
404.html              página de error (usa rutas absolutas /webgpis/...)
pesquisa/ projetos/ impacto/ pessoas/ rede/ familias/ publicacoes/ dados/
en/                   versión en inglés — GENERADA, no editar a mano
assets/
  css/styles.css      todo el estilo
  js/main.js          todo el comportamiento
  images/             fotos (máx. 1600 px; hay permiso de uso para todas)
  logos/              logos institucionales
  logo.png, logo-mark-white.png, favicon.png, gpis-social.png
tools/
  i18n/               extracción y armado de la versión en inglés
  qa/                 controles estructurales y lista de revisión manual
sitemap.xml robots.txt
.claude/
  CLAUDE.md           instrucciones del proyecto para Claude (y para cualquiera)
  recursos.md         catálogo de herramientas e ideas evaluadas
  base/               base de conocimiento del rediseño (capturas, demos, QA)
  skills/             skill de diagramas con la paleta del GPIS
```

### Qué hace `main.js`

| Función | Dónde | Qué hace |
|---|---|---|
| `initClaim` | Home | La frase central se enciende palabra por palabra y las 4 líneas entran con el scroll (solo escritorio) |
| `initBand` | Home | Franja de la Coorte 2019→2025 |
| `initNetworkMap` | Home | Mapa con un azul por país, marcadores cuadrados y nombres con línea guía; bilingüe |
| `initMark` | Páginas internas | Símbolo del GPIS en vectores con un gesto según `<body data-mark="...">`; desde 1200 px se muestra amplio (hasta ~660 px) y cortado arriba y abajo |
| `initCounters` | Coorte y otras | Cifras que cuentan al aparecer (formato según idioma) |
| `initTimeline` | Coorte | Trayectoria con una línea que avanza con el scroll |
| `initTyping` | Impacto | Frase de cierre que se escribe sola |
| `initLifeband` | Rede | Franja del curso de vida que se revela en orden |
| parallax, `data-reveal` | Todo | Movimientos leves de cabecera y de entrada |

Todo respeta `prefers-reduced-motion`: si la persona pidió menos movimiento, el contenido aparece quieto.

### Gestos del símbolo por página (`data-mark`)

| Página | `data-mark` | Gesto |
|---|---|---|
| Rede | `rede` | los nodos se conectan |
| Impacto | `impacto` | se expande en ondas sobre la foto |
| Equipe | `equipe` | se enciende por personas y responde al mouse |
| Para as famílias | `familias` | acolhimento |
| Dados | `dados` | una línea lee la red |
| Linkage | `linkage` | dos mitades se unen |
| Visão em primeira pessoa | `visao` | un visor salta de persona en persona |
| Métodos e inovação | `metodos` | de grilla a red |
| Publicações | `publicacoes` | aparece de arriba abajo, como texto |
| Saúde mental no curso de vida | `trajetoria` | un punto recorre la trayectoria |
| Saúde entre gerações | `geracoes` | cada nodo nace de su "padre" |
| Crises e desigualdades | `crises` | onda de choque y recomposición |
| Enchentes | `enchentes` | el agua sube y baja |
| Visões do Cuidado | `cuidado` | un anillo cálido circula |

La Coorte usa su propio logo, que entra de lado. La home deja la marca quieta. **Toda página nueva debe recibir un gesto acorde a su tema.**

## Trabajar en el sitio

Los bloques son para macOS (zsh). La copia local está en `~/webgpis-redesign`.

### Ver el sitio localmente

```bash
cd ~/webgpis-redesign
git pull origin redesign-moderno
python3 -m http.server 8000 &
sleep 2 && open "http://localhost:8000"
# Para parar el servidor: kill %1
```

### Ramas

- `redesign-moderno` — rama de trabajo.
- `main` — lo publicado. Se actualiza con avance limpio desde `redesign-moderno` (sin reescribir historia).
- `legacy` — el sitio anterior al rediseño (commit `54e3537`).
- `referencia-profesional` — el sitio de referencia hecho por un profesional, del que se tomaron patrones.

Publicar lo que está en la rama de trabajo:

```bash
cd ~/webgpis-redesign
git checkout redesign-moderno && git pull origin redesign-moderno
git checkout main && git pull origin main
git merge --ff-only redesign-moderno
git push origin main
git checkout redesign-moderno
```

Si algo no gustó, se deshace con `git revert <commit>`; nunca reescribiendo el historial.

### Después de cambiar CSS o JS

Subir el número `?v=` en **todos** los HTML (hoy `styles.css?v=28` y `main.js?v=18`) para que nadie vea la versión vieja en caché, y regenerar el inglés:

```bash
cd ~/webgpis-redesign
grep -rl 'styles.css?v=28' --include=*.html . | xargs sed -i '' 's/styles.css?v=28/styles.css?v=29/g'
python3 tools/i18n/build.py
```

### Después de cambiar texto en portugués

El portugués es la fuente. El inglés de `/en/` se genera; **nunca editar `/en/` a mano**.

```bash
cd ~/webgpis-redesign
python3 tools/i18n/extract.py   # agrega los textos nuevos a tools/i18n/en.json (valor vacío = sin traducir)
# abrir tools/i18n/en.json y completar las traducciones vacías
python3 tools/i18n/build.py     # regenera /en/, el selector PT/EN y los hreflang
```

Los títulos oficiales (disertaciones, artículos) y los nombres propios quedan sin traducir a propósito.

### Página nueva

1. Copiar una página interna parecida (mantiene menú, pie, selector de idioma y metadatos).
2. Darle un `<body data-mark="...">` con un gesto acorde a su tema (agregarlo en `initMark`).
3. Agregarla a `sitemap.xml`.
4. Correr `extract.py`, traducir, correr `build.py`.

### Verificar antes de publicar

- Revisar en el navegador en escritorio y en celular (o con el modo responsive del navegador).
- Enlaces: `python3 .claude/base/qa/links.py` debe decir `enlaces rotos: 0`.
- Accesibilidad y capturas: scripts en `.claude/base/qa/` (ver su `LEEME.md`). La última auditoría WCAG A/AA con axe-core pasó en todas las páginas principales.

## Dirección de diseño

Resumen; el detalle está en `.claude/CLAUDE.md`.

- **Tono:** sobrio y académico, que dé ganas de recorrerlo, sin decoración gratuita.
- **Color:** familia de azules y terracota como único acento cálido. Sin degradados, sin halos, sin tarjetas que se elevan. Botones rectos (4 px).

  | Token | Color |
  |---|---|
  | azul profundo (hero) | `#1E456A` |
  | azul ciencia | `#2C5F8A` |
  | azul noche (títulos, bloques oscuros) | `#142C44` |
  | azul claro | `#5A8BB5` |
  | franja de la Coorte | `#3679B0` |
  | niebla (cabeceras internas) | `#F0F4F7` |
  | terracota (acento) | `#C98B2E` |

- **Tipografía:** Schibsted Grotesk en títulos, Source Sans 3 en texto.
- **Composición:** contenedor ancho (hasta 1680 px); título fijo a la izquierda y contenido que corre a la derecha (`.gpis-split`, `.gpis-proj-section__inner`); filas sin cajas en vez de tarjetas.
- **Títulos de sección:** grandes, azul noche, con una línea terracota corta encima.
- **Enlaces a otras páginas:** subrayado discreto y flecha en un círculo que se rellena al pasar el mouse.
- **Menú:** cada ítem lleva a su sección en la home; desde ahí se pasa a la página propia. "Famílias" va destacado.
- **Movimiento:** leve (mapa que se dibuja, parallax suave, entradas con el scroll, gestos del símbolo).

### Lo que se probó y se rechazó

- Reemplazar la marca del GPIS por un gráfico de red genérico.
- Títulos en serif (Source Serif 4).
- Una página "Explorar" con buscador y filtros (commit `1d655a2`, revertido en `a7fd754`): se sentía como una lista más.
- Etiquetas de estado en la Rede ("em andamento", "proposta"): lo no aprobado se redacta con prudencia en el texto.
- Cabeceras internas en dos columnas (título a la izquierda, texto a la derecha) o con un índice "Nesta página": se prefirió agrandar el símbolo (oct/2026).

## Reglas de contenido

- **No inventar** datos, cifras, fechas ni enlaces. Si falta algo, dejar un marcador visible y un comentario `<!-- PENDENTE: ... -->` en el HTML.
- Todo resultado de la Coorte citado en el sitio lleva la referencia al artículo publicado (DOI). Sin referencia, no se incluye.
- No publicar correos personales: usar ORCID y enlaces institucionales.
- No publicar montos, nombres de convocatorias, presupuestos, cronogramas internos, datos del comité de ética ni detalles de la infraestructura de protección de datos.
- Lo que aún no está aprobado nunca se describe como "financiado" ni "aprovado".
- Hay reglas adicionales sobre personas y socios que no se escriben aquí porque el repositorio es público: **consultar al responsable del sitio** antes de agregar o nombrar personas, socios o proyectos nuevos.

## Historia

Ordenada de lo más antiguo a lo más reciente. Cada entrada nombra los commits principales.

### Antes del rediseño (ago–sep/2026)

Sitio institucional con home de tarjetas, páginas de las líneas de pesquisa, equipe, la Coorte 2019, publicaciones, mapa de la red y la página de datos y colaboración. Último estado: commit `54e3537`, conservado en la rama `legacy`. Captura: `.claude/base/capturas/01-sitio-anterior-home-escritorio.jpg`.

### 1. Rediseño sobrio (23/oct/2026)

- `6dedfe4`, `1f3dea1` — nueva tipografía, layout de la home, movimiento y accesibilidad.
- `a44239a` — se fija la dirección **sobria y académica** para todo el sitio.
- `918e346` — se prueba una serif para títulos y se rechaza; vuelve Schibsted Grotesk.

### 2. Pruebas y descartes (24/oct)

- `1d655a2` → `a7fd754` — buscador y página "Explorar": se probó y se revirtió.
- `7cc4beb`, `32412e5` — instrucciones del proyecto (`.claude/CLAUDE.md`), skill de diagramas con la paleta del GPIS y catálogo de recursos (`.claude/recursos.md`).
- `44f77a8` — la frase central de la home se enciende con el scroll (de tres versiones A/B/C se eligió la A; demo en `.claude/base/demos/frase-central.html`).

### 3. Rede y adopción de la referencia profesional (24/oct)

- `475d5c2`, `0873136` — primeras versiones de la página Rede. No convencieron.
- `1f3d483`, `da768c9` — los ítems del menú pasan a llevar a su sección en la home.
- `a728e6a`, `036f371` — se adoptan los patrones del sitio de referencia profesional: contenedor ancho, franja de la Coorte, mapa con un azul por país, frase central con las líneas a la derecha, secciones con título fijo a la izquierda, bloque de impacto foto/azul noche. Entran los logos de MMU y UCSUR.
- `42ac720`, `21b49d8` — títulos de sección más fuertes, enlaces con flecha en círculo, logos de FURG, PPGSP y UDD, Rede reorganizada por el curso de vida, Rede nacional.

### 4. Símbolo vivo y Coorte (24/oct)

- `1b7943c` — el símbolo del GPIS en vectores en las cabeceras internas, con un gesto por página (demo en `.claude/base/demos/simbolo-gpis.html`).
- `523d05c` — Coorte con cifras que cuentan, trayectoria con línea que avanza, marca que entra de lado; cierre de Impacto que se escribe solo; Equipe sin repetir las fichas de colegas internacionales.

### 5. El rediseño pasa a ser el sitio publicado (24/oct)

- `51557bc` — `main` lleva el rediseño; el sitio anterior queda en `legacy`.

### 6. Familias, novidades, formación y versión en inglés (24/oct)

- `2e3dc26` — página **Para as famílias**, sección **Novidades** en la home (premio Pepe Mujica, 2ª edición), disertaciones defendidas en Impacto, fotos más livianas.
- `ab2a39f` — pie de página completo en todas las páginas, sitemap, contraste corregido.
- `5b8d4b0` — versión completa en **inglés** en `/en/`, generada con `tools/i18n/`, con selector PT/EN y `hreflang`.

### 7. Canales para las familias y gestos en todas las páginas (25/oct)

- `3d92277`, `e76f114` — WhatsApp de la Coorte (con mensaje listo para actualizar el registro), Instagram y Facebook; ítem "Famílias" destacado en el menú y bloque "Sua família participa da Coorte?" en la home. El formulario de actualización de registro se diseñó para REDCap (diccionario en `.claude/base/redcap/`) pero aún no está publicado.
- `2cd161f`, `0ecc98d` — cada página interna recibe su gesto del símbolo según su tema.

### 8. Base de conocimiento y este README (25/oct)

- Se guarda en `.claude/base/` el material producido (capturas por hito, demos, diccionario REDCap, scripts de QA) y se escribe este README como registro de la historia del proyecto.

### 9. Marca nítida en la home y símbolo amplio en las cabeceras (25–26/oct)

- La marca de fondo de la home era un PNG de 319 px mostrado a 560 px y se veía borrosa; ahora es el mismo símbolo en vectores (SVG en el HTML), quieto como antes.
- El gesto del símbolo ya no intenta animarse cuando el símbolo está oculto (celular), lo que evitaba un error de JavaScript en Rede, Publicações y Linkage.
- Cabeceras internas: en pantallas anchas quedaba un hueco grande entre el texto y el símbolo. Se compararon tres opciones (A símbolo amplio, B dos columnas, C índice de la página: https://claude.ai/artifact/1w4btCLvPKEFfGQSBWp2oX) y se eligió la **A**: desde 1200 px el símbolo crece hasta unos 660 px, se acerca al texto y se corta arriba y abajo, con opacidad 0,10. Entre 992 y 1199 px y en el celular no cambia; Impacto (cabecera con foto) tampoco. Capturas en `.claude/base/capturas/13-*` y `14-*`.

### 10. Logo de la Coorte nítido (26/oct)

- El logo de la Coorte en la cabecera de su página era un PNG chico (la figura ocupa ~214 px) ampliado casi 3 veces, y quedaba cortado en el borde derecho. Se vectorizó a partir de ese mismo PNG (`assets/images/coorte/logo-coorte-rg2019-marca.svg`, trazado con potrace) y ahora se muestra entero, hasta 600 px, más cerca del texto. Sigue entrando de lado. Si la Coorte tiene el logo original en vectores, conviene reemplazar el trazado por ese archivo.

<!-- Agregar aquí la próxima etapa: "### 11. Título (fecha)" con los commits principales y qué cambió. -->

## Pendiente

- Formulario de actualización de registro de las familias: falta publicar la encuesta REDCap (requiere el texto de privacidad aprobado por el CEP) y luego agregar el botón en la home y en `/familias/` (PT y EN). Mientras tanto el botón abre WhatsApp.
- Facebook de la Coorte: hoy se enlaza una búsqueda; falta el enlace directo a la página.
- Novidades: confirmar el nombre oficial del premio Pepe Mujica (2ª edición), los socios de la red y el enlace al anuncio.
- Logo del PPGSP en mayor tamaño o vectorial (el actual es de 53×44 px).
- DEBH-CPEDCS (Rede nacional): falta nombre completo y descripción.
- Logo de la Coorte en vectores (original): hoy se usa un trazado del PNG.

## Base de conocimiento

`.claude/base/` guarda el material del rediseño que no es parte del sitio: capturas de cada hito, demos que se mostraron antes de construir, el diccionario REDCap y los scripts de verificación. Índice en `.claude/base/LEEME.md`.

Otros documentos útiles:

- `.claude/CLAUDE.md` — instrucciones del proyecto: cómo trabajar con el responsable, dirección visual aprobada, rechazos, pendientes y notas técnicas.
- `.claude/recursos.md` — herramientas, skills e ideas evaluadas (y por qué se usaron o descartaron).
- `tools/qa/manual-checklist.md` — lista de revisión manual.

## Cómo mantener este README

Este archivo es el registro de **qué estamos haciendo y por qué**. Actualizarlo:

- al terminar cada sesión de trabajo o hito (una entrada nueva en [Historia](#historia) con fecha, commits principales y qué cambió);
- cuando algo se prueba y se rechaza (agregarlo a "Lo que se probó y se rechazó");
- cuando se resuelve o aparece un pendiente;
- cuando cambia la estructura, una función de `main.js`, un gesto o el flujo de trabajo.

Si se guardan capturas o demos nuevas, ponerlas en `.claude/base/` y registrarlas en su `LEEME.md`. Nunca escribir aquí contenido confidencial: el repositorio es público.
