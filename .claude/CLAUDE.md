# GPIS — sitio web

Sitio estático del GPIS (Grupo de Pesquisa e Inovação em Saúde, FURG), publicado con GitHub Pages en `chlmz.github.io/webgpis`. HTML por página, Bootstrap 5.3.3 desde CDN, un solo `assets/css/styles.css` y un solo `assets/js/main.js`. El rediseño se trabaja en la rama `redesign-moderno`.

## Cómo trabajar con el responsable del sitio

- Responder en el idioma en que escribe (portugués, español o inglés; sigue al dominante).
- Cada vez que haya que ejecutar algo, dar el bloque **completo** de terminal (macOS/zsh), listo para copiar y pegar, sin pasos sueltos. La copia local está en `~/webgpis-redesign`.
- Hacer una sola pregunta por vez.
- Antes de un cambio visual grande, mostrar primero una prueba pequeña o una comparación de 2–3 opciones (un artifact recorrible funciona bien) y esperar su elección. No construir por adelantado.
- No ampliar el alcance por cuenta propia: hacer lo pedido y proponer el resto. Lo que no pidió y no le gusta se revierte con `git revert`, nunca reescribiendo el historial.
- No inventar datos, cifras ni fechas. Usar solo contenido que ya existe en el sitio y decir cuándo falta algo.
- Antes de entregar, revisar el resultado en el navegador (escritorio y celular) y decir qué se verificó y qué no.

Para ver el sitio localmente:

```bash
cd ~/webgpis-redesign
git pull origin redesign-moderno
python3 -m http.server 8000 &
sleep 2 && open "http://localhost:8000"
# Para parar el servidor: kill %1
```

## Dirección visual aprobada

- **Tono:** sobrio y académico. Debe dar ganas de recorrerlo, pero sin decoración gratuita.
- **Home:** hero azul profundo plano (`#1E456A`), marca del GPIS (`assets/logo-mark-white.png`) de fondo con opacidad muy baja y una sola línea terracota sobre el título.
- **Páginas internas:** cabecera clara (`#F0F4F7`) con trilha "← Voltar… / RÓTULO", marca del GPIS casi imperceptible. Cada línea de pesquisa conserva su color solo en el rótulo (`--tone`).
- **Tipografía:** Schibsted Grotesk en títulos, Source Sans 3 en texto. Se probó una serif (Source Serif 4) y fue rechazada.
- **Color:** una familia de azules; terracota como único acento cálido. Sin ámbar ni verde sueltos, sin degradados, sin halos, sin elevar tarjetas al pasar el ratón. Botones rectos (4px).
- **Ancho:** contenedor ancho (hasta 1680px), poco blanco en los costados.
- **Menú:** GPIS, Pesquisa, Projetos, Impacto, Equipe, Rede y Contato llevan a su sección en la home; desde cada sección se pasa a la página propia.
- **Home (tomado de la referencia profesional, oct/2026):** franja de la Coorte 2019→2025 bajo el hero en azul claro `#3679B0` (crisis en `#2C5F8A`); frase central con las 4 líneas de pesquisa a la derecha (lista numerada 01–04) que entran con el scroll; Proyectos con título fijo a la izquierda y filas a la derecha; mapa con un azul por país, marcadores cuadrados y nombres con línea guía; Impacto con foto azulada a la izquierda y azul noche a la derecha.
- **Títulos de sección:** grandes (hasta 3.5rem), azul noche, con una línea terracota corta encima (eco del hero).
- **Links a otras páginas:** subrayado discreto y flecha dentro de un círculo que se rellena al pasar el mouse. Nada de botones cuadrados para esto.
- **Rede:** sin etiquetas de estado ("em andamento", "proposta"); lo que aún no está aprobado se redacta con prudencia en el texto (nunca "financiado" ni "aprovado").
- **Impacto:** abre con la oficina con las familias (fotos y palavras de los post-its), luego hallazgos en lenguaje simple con su artículo, formación con la composición real del equipo, red con logos y cierre.
- **Patrón general:** título fijo a la izquierda y contenido que corre a la derecha (`.gpis-split`, y `.gpis-proj-section__inner` en páginas internas). Filas sin cajas en vez de tarjetas.
- **Símbolo en cabeceras internas:** el símbolo del GPIS en vectores (`initMark` en `main.js`), intensidad sutil; gesto por página vía `<body data-mark>`: Rede se conecta, Impacto se expande (ondas sobre la foto), Equipe se enciende por personas y responde al mouse; el resto, quieto. Demo aprobada: https://claude.ai/artifact/5btoLQ5KXmhLZJJxMCFEuZ
- **Movimiento:** le gustan los movimientos leves (el mapa que se dibuja, el parallax suave en las cabeceras internas, las entradas al hacer scroll). Siempre respetar `prefers-reduced-motion`.

## Rechazado (no volver a proponer igual)

- Reemplazar la marca del GPIS por un gráfico de red genérico.
- Títulos en serif.
- Una página "Explorar" con buscador y filtros (se sintió como una lista más).

## Pendiente

- Logos en `assets/logos/` (FURG con texto recoloreado, UCSUR positivo). El del PPGSP es muy pequeño (53×44 px): pedir versión mayor o vectorial.
- DEBH-CPEDCS (Rede nacional): falta nombre completo y descripción; el contenedor no resuelve dominios `.br`, así que no se pudo leer el sitio.
- Fotos con niños de frente (`impacto-atividade-familias.jpg`): confirmar permiso antes de usarla.

- La frase central de la home ya usa la versión A (palabras que se encienden con el scroll, `initClaim` en `main.js`). Las versiones B (2.313 puntos) y C (12 preguntas) gustaron, pero para otras secciones; ver `.claude/recursos.md`.

## Recursos e ideas

`.claude/recursos.md` es el catálogo vivo de skills, herramientas e ideas evaluadas: qué hay instalado, qué se descartó y por qué, y qué podría servir más adelante. Consultarlo antes de proponer herramientas nuevas, y agregar ahí todo lo que se evalúe.

## Notas técnicas

- Al cambiar CSS o JS, subir el `?v=` en **todos** los HTML para evitar caché.
- En el contenedor en la nube los CDN (jsdelivr, unpkg) están bloqueados: para capturas con Playwright, servir copias locales de Bootstrap/d3/topojson con `page.route`.
- Skill de diagramas instalada en `.claude/skills/diagram-design` (MIT, de cathrynlavery/diagram-design) con la paleta y las fuentes del GPIS ya aplicadas en `references/style-guide.md`. Sirve para líneas de tiempo, flujos y esquemas del sitio y de presentaciones.
