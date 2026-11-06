"""Validação estrutural offline da Central de Ferramentas LTS, usando Python padrão."""
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    'index.html', 'guia.html', '.nojekyll', 'assets/styles.css',
    'assets/catalogo.js', 'assets/app.js', 'assets/mark.svg',
    'apps/laudos/index.html', 'apps/laudos/laudos.css',
    'apps/laudos/laudos.js', 'GUIA_PUBLICACAO_LTS.md',
    'INTEGRACAO_SITE_LTS.html', 'TEMA_ATLAS_E_JEKYLL.md'
]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.local_links = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values:
            assert values['id'] not in self.ids, f'ID duplicado: {values["id"]}'
            self.ids.add(values['id'])
        for name in ('src','href'):
            if name in values and tag in ('script','link','a'):
                value = values[name]
                if not value.startswith(('https://','http://','#','mailto:','data:')):
                    self.local_links.append(value.split('#')[0].split('?')[0])

for rel in FILES:
    assert (ROOT/rel).exists(), f'Ausente: {rel}'
assert (ROOT/'.nojekyll').stat().st_size == 0, '.nojekyll deve permanecer vazio'
for html in ('index.html','guia.html','apps/laudos/index.html'):
    parser = PageParser()
    path = ROOT/html
    parser.feed(path.read_text(encoding='utf-8'))
    for link in parser.local_links:
        if link:
            assert (path.parent/link).exists(), f'Referência ausente em {html}: {link}'
print('OK: 13 arquivos necessários, IDs únicos e caminhos internos válidos.')
