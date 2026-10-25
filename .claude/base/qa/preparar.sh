#!/bin/zsh
# Descarga copias locales de Bootstrap, d3, topojson y el atlas en ./bs
# (los scripts de QA las sirven con page.route cuando el CDN no está disponible).
# Uso: zsh preparar.sh /ruta/de/trabajo   → crea /ruta/de/trabajo/bs
set -e
W=${1:-$PWD}; mkdir -p "$W/bs"; cd "$W/bs"
for p in bootstrap@5.3.3 d3@7.9.0 topojson-client@3.1.0 world-atlas@2.0.2 axe-core@4.10.2; do
  npm pack "$p" --silent >/dev/null
done
for t in *.tgz; do d=${t%.tgz}; mkdir -p "$d"; tar -xzf "$t" -C "$d"; done
cp bootstrap-5.3.3/package/dist/css/bootstrap.min.css .
cp bootstrap-5.3.3/package/dist/js/bootstrap.bundle.min.js .
mkdir -p ../axe && cp -r axe-core-4.10.2/package ../axe/
echo "Listo: $W/bs y $W/axe"
