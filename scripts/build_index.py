#!/usr/bin/env python3
"""Gera assets/data/search-index.json a partir das páginas do site.

Uso (na raiz do projeto):  python scripts/build_index.py
Rode de novo sempre que mudar títulos, publicações, pessoas ou projetos.
"""
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "data" / "search-index.json"


def soup(path):
    return BeautifulSoup((ROOT / path).read_text(encoding="utf-8"), "html.parser")


def txt(node):
    return re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip() if node else ""


def pick(parent, cls):
    return txt(parent.select_one("." + cls))


items = []


def add(kind, title, url, summary="", meta="", tags=(), external=False, extra=""):
    items.append({
        "type": kind, "title": title, "url": url, "summary": summary,
        "meta": meta, "tags": [t for t in tags if t], "external": external, "extra": extra,
    })


home = soup("index.html")

for a in home.select("a.gpis-research__item"):
    keys = pick(a, "gpis-research__item-keys")
    add("Linha de pesquisa", pick(a, "gpis-research__item-title"), a["href"],
        keys, "", [k.strip() for k in keys.split("·")])

feat = home.select_one("a.gpis-projects__featured")
add("Projeto", pick(feat, "gpis-projects__featured-title"), feat["href"],
    pick(feat, "gpis-projects__featured-desc"), pick(feat, "gpis-projects__featured-tag"),
    ["Coorte", "Mães e crianças", "Rio Grande"], extra="2.313 entrevistas perinatais · 6 anos de acompanhamento")

for a in home.select("a.gpis-project-item"):
    countries = pick(a, "gpis-project-item__countries")
    add("Projeto", pick(a, "gpis-project-item__title"), a["href"],
        pick(a, "gpis-project-item__desc"), pick(a, "gpis-project-item__tag"),
        [t.strip() for t in countries.split("·")] if countries else [])

pubs = soup("publicacoes/index.html")
for art in pubs.select("article.gpis-proj-pub"):
    theme_el = art.find_parent(class_="gpis-proj-pubs__theme")
    theme = pick(theme_el, "gpis-proj-pubs__theme-title") if theme_el else "Artigo de referência"
    title = pick(art, "gpis-proj-pub__public-title") or pick(art, "gpis-proj-pub__title")
    link = art.select_one("a.gpis-proj-pub__link")
    add("Publicação", title, link["href"] if link else "publicacoes/",
        pick(art, "gpis-proj-pub__finding"),
        " · ".join(x for x in [pick(art, "gpis-proj-pub__meta"), pick(art, "gpis-proj-pub__journal")] if x),
        [theme], external=bool(link), extra=pick(art, "gpis-proj-pub__scientific-title"))

people = soup("pessoas/index.html")
for prof in people.select(".gpis-profile"):
    group_el = prof.find_previous(class_="gpis-people-subgroup")
    add("Pessoa", pick(prof, "gpis-profile__name"), "pessoas/",
        pick(prof, "gpis-profile__role"), pick(prof, "gpis-profile__institution"),
        [txt(group_el)], extra=pick(prof, "gpis-profile__bio"))
for li in people.select(".gpis-people-network__item"):
    add("Pessoa", pick(li, "gpis-people-network__name"), "pessoas/",
        "Rede de colaboração", pick(li, "gpis-people-network__inst"),
        ["Rede internacional"], extra=pick(li, "gpis-people-network__bio"))

for title, url, summary in [
    ("Impacto", "impacto/", "Como a pesquisa volta para a sociedade: formação, rede e retorno aos participantes."),
    ("Dados e colaboração", "dados/", "Fontes de dados, como começar uma colaboração e governança."),
    ("Publicações", "publicacoes/", "Artigos científicos em linguagem direta, com links para os originais."),
    ("Equipe", "pessoas/", "Pesquisadores, estudantes e rede de colaboração do GPIS."),
    ("Rede internacional", "index.html#network", "Brasil, Reino Unido, Chile e Peru."),
    ("Contato", "index.html#contact", "Coordenação e Coorte Rio Grande 2019."),
]:
    add("Página", title, url, summary)

# Temas transversais: cruzam projetos, publicações e pessoas pela linguagem do texto.
TOPICS = {
    "Saúde mental": r"saúde mental|depress|ansiedade|sofrimento|psiquiatr",
    "Pandemia": r"pandemia|covid|isolamento",
    "Enchentes e clima": r"enchente|desastre|climátic|clima ",
    "Gestação e nascimento": r"gesta|perinatal|pré-natal|parto|gravid|nascimento|sono",
    "Parentalidade e família": r"parental|famíli|famili|mães|mãe |cuidador|cuidado|filhos",
    "Infância": r"infânci|criança|bebê|desenvolvimento infantil",
    "Dados e linkage": r"linkage|registros|dados popul|vincula|governança|gestão de dados|cientista de dados",
    "IA e métodos": r"inteligência artificial|\bia\b|câmera|visão em primeira|computacional|observacional",
    "Coorte": r"coorte|longitudinal|acompanh",
    "Rede internacional": r"chile|peru\b|reino unido|internacional|manchester",
}
for it in items:
    if it["type"] == "Página":
        it["topics"] = []
        continue
    hay = " ".join([it["title"], it["summary"], it["meta"], it["extra"], " ".join(it["tags"])]).lower() + " "
    it["topics"] = [name for name, rx in TOPICS.items() if re.search(rx, hay)]

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")

from collections import Counter
print(len(items), "itens ->", OUT.relative_to(ROOT))
print(dict(Counter(i["type"] for i in items)))
print(dict(Counter(t for i in items for t in i["topics"]).most_common()))
