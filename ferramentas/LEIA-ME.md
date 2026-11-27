# Central de ferramentas — publicação e integração

Versão 1.0 · 27/11/2026 · HTML, CSS e JavaScript nativos. Sem dependências CDN, conta de serviço, assinatura paga, instalação de biblioteca em produção ou backend. O design deriva da versão integrada de Serviços: paleta institucional, banner, tipografia, largura e cartões. A marca aparece no título do documento, sem cabeçalho ou rodapé duplicados.

## 1. Conteúdo do pacote

- `ferramentas/index.html`: página a publicar.
- `ferramentas/assets/style.css`: estilos isolados em `#lts-ferramentas`.
- `ferramentas/assets/script.js`: filtros, botões, SHA-256, XML e comunicação de altura.
- `ferramentas/assets/config.js`: endereços autorizados de contratos, emissores DTC/LCL e assinador.
- `ferramentas/modelos/`: três checklists de preparação, não contratos oficiais.
- `integracao-wordpress/embed.html`: iframe e ajuste de altura, com link de abertura independente.
- `tests/test_portal.py`: roteiro de teste HTTP/HTTPS (Python, Playwright e Chromium; executar em ambiente com navegação permitida).
- `tests/test_offline.py`: testes executados sem navegação de rede, incluindo ponte Web Crypto de Node e simulação de clipboard e iframe.
- `PREVIA.html`: prévia autônoma, com CSS e JS incorporados; para conferência, não precisa publicar.
- `RELATORIO_TESTES.md`: resultados da execução local.

## 2. Preparar e conferir as aplicações existentes

Não substitua o repositório inteiro, nem os arquivos da raiz. Os endereços públicos informados não retornaram conteúdo durante esta análise; a arquitetura foi reconstruída com base na solicitação, no CSS anterior e na referência de Serviços. Verifique os arquivos e o histórico atuais do repositório antes de integrar. Se já houver uma pasta `ferramentas`, faça backup, crie uma branch de revisão e compare o conteúdo. As seis entradas em `config.js` ficam vazias até confirmação de URLs. Não há emissor fiscal nem assinador novo neste pacote; os acessos devem apontar para aplicações reais e autorizadas. Os checklists são novos e não substituem contratos homologados.

Abra `ferramentas/assets/config.js` e preencha apenas os endereços confirmados. Exemplo ilustrativo (não é uma URL real): se o emissor DTC estiver em `apps/dtc/index.html` na raiz do site Pages, informe `../apps/dtc/index.html`. Para um sistema externo aprovado use sua URL HTTPS. Se a aplicação exige autenticação, ela deve aplicá-la no próprio servidor. Nenhuma chave privada, senha, token, certificado PFX ou identificador de cliente deve ser incluído no arquivo. URLs vazias permanecem como “endereço a configurar”; URLs inválidas são rejeitadas.

## 3. Teste local

Em um terminal, na pasta que contém `ferramentas/`, execute `python -m http.server 8000 --bind 127.0.0.1` e abra `http://127.0.0.1:8000/ferramentas/`. No Windows também pode usar `py -m http.server 8000 --bind 127.0.0.1`. Use localhost ou HTTPS para Web Crypto e Clipboard API. O navegador pode bloquear cópia em iframe; nesse caso a página seleciona o texto e orienta a cópia manual. Não dependa de abrir o arquivo pelo protocolo `file://` para a validação final.

## 4. Publicação gratuita no GitHub Pages

1. Abra https://github.com/lts-unochapeco/LTS-0092-GIT-WEB-PAGES-LTS com a conta que administra o repositório. Faça backup/branch de revisão.
2. Em `Settings > Pages`, confira o branch e o diretório de publicação. Se já houver configuração funcional, preserve-a. Se ainda não houver, selecione `Deploy from a branch`, o branch (geralmente `main`) e `/(root)` ou `/docs`, conforme a estrutura. GitHub Free admite Pages em repositórios públicos; outras modalidades dependem do plano.
3. Copie somente a pasta `ferramentas/` do pacote para a raiz **do diretório publicado**. Se a origem for `/docs`, publique como `docs/ferramentas/`. Mantenha os arquivos e aplicações preexistentes. Se houver Git local, use uma branch, `git add ferramentas/` (ou `git add docs/ferramentas/`), `git commit -m "Refatora portal de ferramentas"`, `git push` e abra um pull request. Alternativamente, use `Add file > Upload files` no GitHub, preservando subpastas.
4. Após revisão e merge, confira `Actions` e `Settings > Pages`. Aguarde a indicação de implantação concluída na própria interface. Não é necessário novo workflow para hospedagem estática já configurada. Não altere `.nojekyll` ou outros arquivos globais sem revisar a configuração do repositório.
5. Abra https://lts-unochapeco.github.io/LTS-0092-GIT-WEB-PAGES-LTS/ferramentas/ e verifique a página, os links reais configurados e os comandos. Se houver 404, confira branch, pasta publicada, capitalização e arquivo `index.html`.

## 5. Incorporação ao WordPress

1. Edite a página Ferramentas do site institucional. Remova o iframe antigo ou HTML/CSS/JS que pertencia exclusivamente ao portal anterior. Não remova estilos globais usados em outras páginas.
2. Insira um bloco HTML personalizado e cole o conteúdo de `integracao-wordpress/embed.html`. Preserve o cabeçalho, menu e rodapé do tema. Use a opção de largura ampla ou total do tema, se disponível e apropriada.
3. Atualize a página e limpe caches pertinentes. A página do iframe tem estilos isolados do tema por natureza. O listener de altura só aceita mensagens da origem Pages e da janela do iframe; a página filha envia apenas a altura à origem institucional. Se o WordPress remover `<script>`, coloque somente o script em um gerenciador de snippets aprovado ou tema filho, sem duplicá-lo. Mesmo sem ele, há iframe de 1150 px com rolagem nativa e link de abertura em outra aba. Verifique se a política CSP/headers permite o iframe; não desative políticas de segurança globalmente.
4. Confira o site em desktop e mobile. Teste expansão, pesquisa/filtros, SHA-256, XML, downloads, acesso aos aplicativos configurados, menu do site e altura do iframe. Se a área de transferência for bloqueada por Permissions-Policy, use o fallback. A disponibilidade do Pages e o comportamento do WordPress real não puderam ser testados aqui.

## 6. Segurança e limites

GitHub Pages é hospedagem estática pública, destinada aqui a documentação técnica, catálogo e utilitários locais. Não use como backend transacional, SaaS comercial ou ambiente de gestão de contratos, dados fiscais/confidenciais ou assinaturas privadas. Serviços e aplicações reais que lidam com dados sensíveis devem permanecer em ambiente autorizado, autenticado e apropriado. Verifique os termos do GitHub Pages e da política institucional.

O SHA-256 verifica integridade em relação a uma referência confiável, não autoria ou conformidade. O código utiliza `crypto.subtle.digest`, aceita arquivos de até 128 MiB (limitação de memória do processamento não incremental) e texto UTF-8 de até 2 MiB. A inspeção XML limita a entrada a 2 MiB, rejeita DTD/entidades declaradas, não carrega referências externas, e informa somente sintaxe, raiz, namespace e número de elementos `Signature` XMLDSig. Não valida XSD, certificado, assinatura, conteúdo fiscal ou requisitos legais. O link VALIDAR abre serviço externo: só use com autorização de envio. Nenhum arquivo inserido nos utilitários é transmitido pelo código local; não há armazenamento de entrada, analytics ou bibliotecas de terceiros. Isso não garante segurança de extensões ou do dispositivo. Para material restrito, use ambiente local controlado.

## 7. Referências e manutenção

- Design: `LTS_Servicos_Integrado/03_style.css`, versão anterior da página Serviços e paleta institucional fornecida.
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Limites e uso: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- DWService: https://www.dwservice.net/pt_BR/download.html
- PowerShell: https://learn.microsoft.com/pt-br/powershell/module/microsoft.powershell.utility/get-filehash
- GNU Coreutils: https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html
- ITI VALIDAR: https://validar.iti.gov.br/duvidas.html
- Legislação: https://lts.unochapeco.edu.br/legislacao/

Os links de instalação apontam para os fornecedores oficiais, não versões fixas de executáveis. É uma seleção recomendada, não comprovação de adoção institucional. Antes de publicar, verifique os links e as condições de licença para uso institucional, a versão aplicável dos documentos e a autorização de divulgação. Revise o catálogo periodicamente. Verificação de páginas de download principais realizada por pesquisa pública; a execução dos instaladores, manuais externos e os emissores não integra os testes locais.

## 8. Executar os testes

Instale Python, Node.js e, apenas no ambiente de teste, `python -m pip install playwright beautifulsoup4` e `python -m playwright install chromium`. No diretório do pacote, execute `python tests/test_offline.py`. Para conferir hospedagem local e Web Crypto do navegador, use `python tests/test_portal.py` em um ambiente que permita navegar para localhost e simular origens HTTPS com Playwright. O segundo roteiro não pôde ser executado por restrição do navegador nesta sessão. Consulte o relatório.
