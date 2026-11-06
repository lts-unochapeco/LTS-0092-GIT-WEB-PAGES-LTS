(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const query = new URLSearchParams(location.search);
  if (query.get('embed') === '1') document.body.classList.add('embed');
  const sidebar = byId('sidebar');
  const menu = byId('open-menu');
  const closeMenu = () => { sidebar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => { const open = sidebar.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  byId('close-menu').addEventListener('click', closeMenu);
  document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('[data-nav]').forEach(n => n.classList.toggle('active', n === a)); closeMenu();
  }));

  /* Catálogo: inserir textos com textContent para impedir injeções de HTML. */
  const tools = window.LTS_CATALOGO || [];
  const categoryNames = { remoto: 'Acesso remoto', integridade: 'Integridade e criptografia', xml: 'XML e assinaturas', desenvolvimento: 'Desenvolvimento', ensaios: 'Ensaios', documentos: 'Documentos' };
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let filter = 'todos';
  function refresh() {
    const search = normalize(byId('tool-search').value.trim());
    const visible = tools.filter(t => (filter === 'todos' || t.categoria === filter) && normalize([t.nome, t.tipo, t.descricao, categoryNames[t.categoria]].join(' ')).includes(search));
    const fragment = document.createDocumentFragment();
    for (const t of visible) {
      const item = document.createElement('article'); item.className = 'tool-card';
      const head = document.createElement('div'); head.className = 'tool-head';
      const icon = document.createElement('span'); icon.className = 'tool-initials'; icon.textContent = t.icon;
      const wrap = document.createElement('div');
      const title = document.createElement('div'); title.className = 'tool-title'; title.textContent = t.nome;
      const type = document.createElement('div'); type.className = 'tool-type'; type.textContent = t.tipo;
      wrap.append(title, type); head.append(icon, wrap);
      const p = document.createElement('p'); p.textContent = t.descricao;
      const a = document.createElement('a'); a.href = t.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', t.acao + ' - ' + t.nome);
      const label = document.createElement('span'); label.textContent = t.acao;
      const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
      a.append(label, arrow);

      /* NOVO: grupo de botões e link do manual PDF. */
      const actions = document.createElement('div');
      actions.className = 'tool-actions';
      actions.append(a);

      /* A propriedade 'manual' do catálogo é opcional.
         Para DWService, usa o arquivo padrão mesmo sem editar catalogo.js. */
      const manualUrl = t.manual || (
        t.id === 'dwservice' || normalize(t.nome) === 'dwservice'
          ? 'documentos/roteiro_DWservice.pdf'
          : ''
      );

      if (manualUrl) {
        const manualLink = document.createElement('a');
        manualLink.href = manualUrl;
        manualLink.target = '_blank';
        manualLink.rel = 'noopener noreferrer';
        manualLink.className = 'manual-button';
        manualLink.setAttribute('aria-label', 'Abrir manual PDF - ' + t.nome);

        const manualLabel = document.createElement('span');
        manualLabel.textContent = 'Manual PDF';
        const manualArrow = document.createElement('span');
        manualArrow.textContent = '↗';
        manualArrow.setAttribute('aria-hidden', 'true');

        manualLink.append(manualLabel, manualArrow);
        actions.append(manualLink);
      }

      item.append(head, p, actions);
      fragment.append(item);
    }
    byId('catalog-grid').replaceChildren(fragment);
    byId('tool-count').textContent = visible.length + (visible.length === 1 ? ' FERRAMENTA' : ' FERRAMENTAS');
    byId('empty-result').hidden = visible.length > 0;
  }
  function chooseFilter(next) {
    filter = next;
    document.querySelectorAll('[data-filter]').forEach(b => { const active = b.dataset.filter === next; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', String(active)); });
    refresh();
  }
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => chooseFilter(b.dataset.filter)));
  document.querySelectorAll('[data-link-filter]').forEach(a => a.addEventListener('click', () => chooseFilter(a.dataset.linkFilter)));
  byId('tool-search').addEventListener('input', refresh);
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); byId('tool-search').focus(); }
    if (event.key === 'Escape') closeMenu();
  });
  refresh();

  /* Hash SHA-256: execução local, com limite de memória para compatibilidade. */
  let chosenFile = null, currentHash = '';
  const hashStatus = byId('hash-status');
  function setStatus(text, type = '') { hashStatus.textContent = text; hashStatus.className = 'hash-status ' + type; }
  function selectFile(file) {
    chosenFile = file || null; currentHash = ''; byId('hash-copy').disabled = true;
    byId('hash-name').textContent = chosenFile ? chosenFile.name + ' · ' + (chosenFile.size / 1048576).toFixed(2) + ' MB' : 'Nenhum arquivo selecionado.';
    byId('hash-output').textContent = 'O resultado aparecerá aqui.'; setStatus('');
  }
  byId('hash-file').addEventListener('change', e => selectFile(e.target.files[0]));
  const drop = byId('drop-zone');
  for (const type of ['dragover', 'dragenter']) drop.addEventListener(type, e => { e.preventDefault(); drop.classList.add('dragover'); });
  for (const type of ['dragleave', 'drop']) drop.addEventListener(type, e => { e.preventDefault(); drop.classList.remove('dragover'); });
  drop.addEventListener('drop', e => selectFile(e.dataTransfer.files[0]));
  function compareHash() {
    const ref = byId('hash-expected').value.trim().toLowerCase();
    if (!currentHash) return;
    if (!ref) { setStatus('Cálculo concluído. Informe uma referência para comparar.'); return; }
    if (!/^[0-9a-f]{64}$/.test(ref)) { setStatus('O hash esperado deve ter 64 dígitos hexadecimais.', 'error'); return; }
    setStatus(ref === currentHash ? 'Integridade confirmada: os valores coincidem.' : 'Divergência: os valores não coincidem.', ref === currentHash ? 'ok' : 'error');
  }
  byId('hash-expected').addEventListener('input', compareHash);
  byId('hash-run').addEventListener('click', async () => {
    if (!chosenFile) { byId('hash-output').textContent = 'Selecione um arquivo.'; return; }
    if (!crypto?.subtle) { byId('hash-output').textContent = 'SHA-256 exige HTTPS ou localhost no navegador.'; return; }
    if (chosenFile.size > 200 * 1048576) { byId('hash-output').textContent = 'O limite de 200 MB protege a memória do navegador. Use Get-FileHash (Windows) ou sha256sum (Linux).'; return; }
    const btn = byId('hash-run'); btn.disabled = true; btn.textContent = 'Calculando…';
    try {
      const data = await chosenFile.arrayBuffer();
      const bytes = await crypto.subtle.digest('SHA-256', data);
      currentHash = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
      byId('hash-output').textContent = currentHash; byId('hash-copy').disabled = false; compareHash();
    } catch { currentHash = ''; byId('hash-output').textContent = 'Não foi possível calcular o hash. Tente novamente.'; setStatus('Falha de leitura do arquivo.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Calcular SHA-256'; }
  });
  byId('hash-copy').addEventListener('click', async () => {
    if (!currentHash) return;
    try { await navigator.clipboard.writeText(currentHash); setStatus('Hash copiado para a área de transferência.', 'ok'); }
    catch { setStatus('Selecione o valor acima e copie manualmente.'); }
  });

  /* Apenas inspeção de sintaxe XML: não confere XSD nem assinatura. */
  byId('xml-file').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5 * 1048576) { byId('xml-output').textContent = 'Limite de 5 MB para este utilitário.'; return; }
    byId('xml-text').value = await file.text();
  });
  byId('xml-run').addEventListener('click', () => {
    const text = byId('xml-text').value.trim(); if (!text) { byId('xml-output').textContent = 'Selecione ou cole um XML.'; return; }
    if (text.length > 5 * 1048576) { byId('xml-output').textContent = 'XML excede o limite local de 5 MB.'; return; }
    try {
      const doc = new DOMParser().parseFromString(text, 'application/xml'); const error = doc.querySelector('parsererror');
      if (error) { byId('xml-output').textContent = 'XML malformado: ' + error.textContent.trim().slice(0, 350); return; }
      const root = doc.documentElement;
      const signatures = doc.getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#', 'Signature').length;
      byId('xml-output').textContent = 'XML bem formado.\nElemento raiz: ' + root.nodeName + '\nNamespace: ' + (root.namespaceURI || '(não informado)') + '\nTotal de elementos: ' + doc.getElementsByTagName('*').length + '\nXMLDSig presente: ' + (signatures ? 'sim (não verificada)' : 'não') + '\nXSD e validade legal: NÃO verificados.';
    } catch { byId('xml-output').textContent = 'Falha ao analisar o documento XML.'; }
  });
  byId('xml-clear').addEventListener('click', () => { byId('xml-file').value = ''; byId('xml-text').value = ''; byId('xml-output').textContent = 'O diagnóstico sintático aparecerá aqui.'; });

  /* Mensagem de altura da versão embed destinada apenas ao domínio institucional conhecido. */
  if (document.body.classList.contains('embed') && window.parent !== window && 'ResizeObserver' in window) {
    let previous = 0;
    const notify = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      if (Math.abs(height - previous) < 4) return; previous = height;
      for (const origin of ['https://lts.unochapeco.edu.br', 'https://www.lts.unochapeco.edu.br']) window.parent.postMessage({ type: 'lts-pages-height', height }, origin);
    };
    new ResizeObserver(notify).observe(document.body); window.addEventListener('load', notify);
  }
})();
