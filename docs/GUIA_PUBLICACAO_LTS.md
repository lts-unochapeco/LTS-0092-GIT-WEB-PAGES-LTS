# Central de Ferramentas LTS — Guia de instalação e publicação

**Versão:** 1.1 · **Data:** 06/11/2026  
**Repositório de destino:** https://github.com/lts-unochapeco/LTS-0092-GIT-WEB-PAGES-LTS  
**Endereço do Pages:** https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/  
**Site institucional:** https://lts.unochapeco.edu.br/

## 1. O que contém o projeto

O pacote é uma aplicação web **HTML5 + CSS3 + JavaScript**, sem hospedagem paga ou dependência de tema externo:

```text
LTS-0092-GIT-WEB-PAGES-LTS/
├── index.html                   Portal principal
├── guia.html                    Guia navegável para a equipe
├── .nojekyll                    Desabilita o processamento Jekyll no GitHub Pages
├── assets/
│   ├── styles.css              Estilos responsivos
│   ├── catalogo.js             Catálogo de 24 ferramentas
│   ├── app.js                  Filtros, SHA-256, XML e modo embed
│   └── mark.svg                Ícone vetorial
├── apps/laudos/
│   ├── index.html              Editor de minutas DTC/LCL
│   ├── laudos.css              Estilos do editor
│   └── laudos.js               XML, JSON e resumo para impressão
├── INTEGRACAO_SITE_LTS.html     Trecho de iframe para o site institucional
├── GUIA_PUBLICACAO_LTS.md      Este manual
├── TEMA_ATLAS_E_JEKYLL.md      Orientação específica sobre theme: Atlas
└── tests/check_site.py         Verificação estática de arquivos e links
```

**Importante:** o pacote não inclui nem substitui o `README.md` ou diretórios já existentes no repositório do LTS, como possíveis materiais relacionados ao DWService. Antes de copiar, faça backup ou clone o repositório.

## 2. Tema Atlas e Jekyll

Para este layout personalizado, **não use** `theme: Atlas` em `_config.yml`: esse valor não identifica um tema oficial compatível do GitHub Pages. Esta versão usa `.nojekyll`, arquivo vazio na raiz que orienta a publicação do conteúdo estático sem compilação Jekyll. O arquivo `_config.yml` é dispensável para este portal; se houver um `_config.yml` preexistente, avalie seu conteúdo antes de alterar para não prejudicar partes anteriores do repositório.

Fonte: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 3. Antes de começar

1. Acesse o repositório de destino e entre com uma conta com autorização de gravação (`Write` ou superior).
2. Confira qual é o branch de publicação (normalmente `main`) e se o Pages usa `/(root)` ou `/docs`.
3. Faça uma cópia do projeto existente para preservar o histórico e os recursos atuais.
4. Baixe o ZIP e extraia o conteúdo **antes** de publicá-lo. Não publique apenas o ZIP dentro do repositório.

## 4. Publicação via Git — Ubuntu/Linux

**Instale o Git**, caso não esteja disponível: https://git-scm.com/downloads

```bash
git clone https://github.com/lts-unochapeco/LTS-0092-GIT-WEB-PAGES-LTS.git
cd LTS-0092-GIT-WEB-PAGES-LTS
mkdir -p /tmp/lts-pages-v1-1
unzip ~/Downloads/LTS_Ferramentas_Pages_v1.1.zip -d /tmp/lts-pages-v1-1
cp -a /tmp/lts-pages-v1-1/. ./
git status --short
```

Revise a listagem e garanta que não haverá exclusão ou substituição indesejada. Depois:

```bash
git add index.html guia.html .nojekyll assets apps GUIA_PUBLICACAO_LTS.md INTEGRACAO_SITE_LTS.html TEMA_ATLAS_E_JEKYLL.md tests
git commit -m "feat: portal de ferramentas LTS v1.1"
git push origin main
```

Se o projeto usar outro branch ou branch protegida, siga o fluxo de aprovação/PR da instituição. **Não use `git push --force`**.

## 5. Publicação via Git — Windows PowerShell

Com **Git para Windows** instalado, execute:

```powershell
git clone https://github.com/lts-unochapeco/LTS-0092-GIT-WEB-PAGES-LTS.git
Set-Location LTS-0092-GIT-WEB-PAGES-LTS
New-Item -ItemType Directory -Path "$env:TEMP\lts-pages-v1-1" -Force | Out-Null
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\LTS_Ferramentas_Pages_v1.1.zip" -DestinationPath "$env:TEMP\lts-pages-v1-1" -Force
Copy-Item -Path "$env:TEMP\lts-pages-v1-1\*" -Destination . -Recurse -Force
New-Item -Path .nojekyll -ItemType File -Force | Out-Null
git status --short
git add index.html guia.html .nojekyll assets apps GUIA_PUBLICACAO_LTS.md INTEGRACAO_SITE_LTS.html TEMA_ATLAS_E_JEKYLL.md tests
git commit -m "feat: portal de ferramentas LTS v1.1"
git push origin main
```

Se o arquivo `.nojekyll` já existir, mantenha-o. Confira os arquivos de origem antes de confirmar o commit.

## 6. Publicação pela interface do GitHub

1. Acesse o repositório com conta que possa escrever nele.
2. Extraia o pacote ZIP no computador.
3. Use **Add file → Upload files** para transferir os arquivos da raiz e as pastas `assets`, `apps` e `tests`, preservando os caminhos internos. Alguns navegadores podem não preservar pastas na interface; nesse caso, prefira Git pela linha de comando.
4. Adicione `.nojekyll` na raiz: pelo GitHub, **Add file → Create new file**, nome `.nojekyll` e confirme. Se o GitHub não aceitar um arquivo vazio criado na interface, use o método Git local para criá-lo.
5. Revise o diff antes do commit. **Não exclua arquivos existentes**.

## 7. Configuração do GitHub Pages

Abra o repositório e siga:

**Settings → Pages → Build and deployment → Source → Deploy from a branch**

Selecione o branch publicado (normalmente `main`) e a pasta `/(root)`. Clique em **Save**. Se o repositório já publica a partir de outra origem, mantenha a configuração e adapte a cópia dos arquivos a essa origem.

Teste após o deploy:

- Portal: https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/
- Editor de laudos: https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/apps/laudos/
- Modo de incorporação: https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/?embed=1
- Guia: https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/guia.html

Caso o repositório já possua páginas em outras rotas (por exemplo `/dwservice/`), confira se continuam acessíveis.

Documentação GitHub: https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 8. Teste local antes de publicar

No diretório onde está `index.html`:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/`. O hash SHA-256 com Web Crypto requer contexto seguro (`https://`) ou `localhost`. Para JavaScript, use navegador atualizado, como Chromium, Firefox ou Edge.

Testes offline de arquivos (com Python 3):

```bash
python3 tests/check_site.py
```

## 9. Incorporação no menu Ferramentas do site institucional

**Alternativa A — link externo (recomendação para publicação imediata):** crie no menu Ferramentas um link para `https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/`.

**Alternativa B — iframe:** utilize o código de `INTEGRACAO_SITE_LTS.html` em um bloco HTML permitido pelo CMS, apontando para `...?embed=1`. O trecho inclui ajuste de altura via `postMessage` com verificação do domínio de origem do Pages.

Alguns sistemas CMS não permitem `<script>` ou iframes externos por CSP. Nesse caso, mantenha um iframe de altura fixa ou prefira o link externo. Não altere cabeçalhos de segurança do portal institucional sem avaliação da equipe responsável.

## 10. Fluxo para futura emissão oficial DTC / LCL

O **editor atual não emite laudos oficiais**; gera somente minutas de protótipo com namespace `urn:lts:prototipo-nao-oficial:laudos:1`. A inspeção de XML também verifica apenas se o XML é bem formado — não valida um XSD fiscal.

Uma versão de produção precisará incluir:

1. Documento normativo e anexos oficiais em suas versões vigentes (Atos DIAT nº 54/2026 e nº 56/2026, e alterações posteriores, inclusive nº 62/2026, conforme aplicável).
2. Leiautes, namespaces, esquemas **XSD oficiais** e regras de negócio versionadas.
3. Registro de atendimento, testes, evidências, revisão, aprovação e rastreabilidade.
4. Serviço de assinatura digital compatível com a regulamentação (XMLDSig / ICP-Brasil conforme exigência), operando em ambiente protegido.
5. Armazenamento seguro, autenticação, autorização e trilhas de auditoria.
6. Validações integradas de XSD, assinatura e critérios legais. Validar uma assinatura não equivale, isoladamente, a homologar a aplicação.

**Nunca** coloque credenciais, segredos, certificados `.pfx`/`.p12`, chaves privadas ou documentos sigilosos no GitHub Pages ou em repositório público.

## 11. Ferramentas e licença

O catálogo lista aplicativos gratuitos, projetos de código aberto e edições comunitárias. A condição de gratuidade depende do recurso e uso institucional; confirme sempre termos de licença e permissões da política de TI.

## 12. Referências

- SEF/SC — NFC-e: https://www.sef.sc.gov.br/saiba-mais/nfc-e-nota-fiscal-de-consumidor-eletronica
- Ato DIAT nº 62/2026: https://legislacao.sef.sc.gov.br/html/atos_diat/2026/atodiat_26_062.htm
- GitHub Pages: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site
- VALIDAR / ITI: https://validar.iti.gov.br/
- XMLSec: https://github.com/lsh123/xmlsec
- DWService: https://www.dwservice.net/pt_BR/download.html
- Web Crypto SHA-256: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
