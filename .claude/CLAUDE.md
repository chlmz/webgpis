# GPIS — sitio web

Sitio estático del GPIS (Grupo de Pesquisa e Inovação em Saúde, FURG), publicado con GitHub Pages en `chlmz.github.io/webgpis`. HTML por página, Bootstrap 5.3.3 desde CDN, un solo `assets/css/styles.css` y un solo `assets/js/main.js`. El rediseño se trabaja en la rama `redesign-moderno`.

## Cómo trabajar con el responsable del sitio

- Responder en el idioma en que escribe (portugués, español o inglés; sigue al dominante).
- Cada vez que haya que ejecutar algo, dar el bloque **completo** de PowerShell (Windows), listo para copiar y pegar, sin pasos sueltos. La copia local está en `C:\Users\clmz\webgpis-redesign`.
- Hacer una sola pregunta por vez.
- Antes de un cambio visual grande, mostrar primero una prueba pequeña o una comparación de 2–3 opciones (un artifact recorrible funciona bien) y esperar su elección. No construir por adelantado.
- No ampliar el alcance por cuenta propia: hacer lo pedido y proponer el resto. Lo que no pidió y no le gusta se revierte con `git revert`, nunca reescribiendo el historial.
- No inventar datos, cifras ni fechas. Usar solo contenido que ya existe en el sitio y decir cuándo falta algo.
- Antes de entregar, revisar el resultado en el navegador (escritorio y celular) y decir qué se verificó y qué no.

Para ver el sitio localmente:

```powershell
cd C:\Users\clmz\webgpis-redesign
git pull origin redesign-moderno
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'python -m http.server 8000'
Start-Sleep -Seconds 2
Start-Process "http://localhost:8000"
```

## Dirección visual aprobada

- **Tono:** sobrio y académico. Debe dar ganas de recorrerlo, pero sin decoración gratuita.
- **Home:** hero azul profundo plano (`#1E456A`), marca del GPIS (`assets/logo-mark-white.png`) de fondo con opacidad muy baja y una sola línea terracota sobre el título.
- **Páginas internas:** cabecera clara (`#F0F4F7`) con trilha "← Voltar… / RÓTULO", marca del GPIS casi imperceptible. Cada línea de pesquisa conserva su color solo en el rótulo (`--tone`).
- **Tipografía:** Schibsted Grotesk en títulos, Source Sans 3 en texto. Se probó una serif (Source Serif 4) y fue rechazada.
- **Color:** una familia de azules; terracota como único acento cálido. Sin ámbar ni verde sueltos, sin degradados, sin halos, sin elevar tarjetas al pasar el ratón. Botones rectos (4px).
- **Movimiento:** le gustan los movimientos leves (el mapa que se dibuja, el parallax suave en las cabeceras internas, las entradas al hacer scroll). Siempre respetar `prefers-reduced-motion`.

## Rechazado (no volver a proponer igual)

- Reemplazar la marca del GPIS por un gráfico de red genérico.
- Títulos en serif.
- Una página "Explorar" con buscador y filtros (se sintió como una lista más).

## Pendiente

- La frase central de la home ("Perguntas diferentes, uma mesma ideia…") debe ser el punto que atrae la atención. Hay tres propuestas con scroll: A, la frase se escribe; B, 2.313 puntos de la Coorte; C, las 12 preguntas reales. Falta que elija.

## Notas técnicas

- Al cambiar CSS o JS, subir el `?v=` en **todos** los HTML para evitar caché.
- En el contenedor en la nube los CDN (jsdelivr, unpkg) están bloqueados: para capturas con Playwright, servir copias locales de Bootstrap/d3/topojson con `page.route`.
- Skill de diagramas instalada en `.claude/skills/diagram-design` (MIT, de cathrynlavery/diagram-design) con la paleta y las fuentes del GPIS ya aplicadas en `references/style-guide.md`. Sirve para líneas de tiempo, flujos y esquemas del sitio y de presentaciones.
