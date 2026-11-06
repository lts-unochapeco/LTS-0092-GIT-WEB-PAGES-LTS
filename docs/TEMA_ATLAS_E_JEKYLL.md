# Sobre o tema Atlas e GitHub Pages

A configuração fornecida anteriormente para a **Central de Documentos LTS** foi:

```yaml
title: Central de Documentos LTS
description: ""
theme: Atlas
markdown: kramdown
header_pages: []
```

**Importante:** `Atlas` não é um nome de tema da lista oficial do GitHub Pages/Jekyll. O uso literal de `theme: Atlas` pode causar falhas de build se não houver um tema de terceiros especificamente instalado e configurado.

## Escolha adotada neste pacote

A versão 1.1 publica uma aplicação estática independente de Jekyll, usando HTML, CSS e JavaScript. Por isso:

1. O pacote **não inclui** um `_config.yml` e **não utiliza** `theme: Atlas`.
2. Inclui `.nojekyll` (arquivo vazio) na raiz de publicação.
3. Publica `index.html` como página inicial do projeto.
4. Não requer instalação de temas, extensões nem build de Node.js.

Caso `_config.yml` já exista no repositório, não o apague sem verificar se outras páginas dependem dele. Se houver apenas `theme: Atlas` e o repositório for convertido integralmente em site estático, o arquivo poderá ser removido ou corrigido sob revisão da equipe técnica.

Referência oficial: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site
