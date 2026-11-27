/* Interacoes locais. Sem bibliotecas, telemetria, fetch ou armazenamento de entradas. */
(() => {
  'use strict';
  const root = document.getElementById('lts-ferramentas');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const $ = id => root.querySelector('#' + id);
  const all = selector => [...root.querySelectorAll(selector)];
  const on = (id, event, fn) => $(id).addEventListener(event, fn);
  const state = (id, message, kind = '') => { $(id).textContent = message; $(id).dataset.state = kind; };
  // Links institucionais: somente HTTPS (HTTP local permitido para desenvolvimento).
  const links = window.LTS_TOOL_APPS || {};
  all('[data-config]').forEach(slot => {
    const raw = links[slot.dataset.config];
    if (typeof raw !== 'string' || !raw.trim()) return;
    try {
      const url = new URL(raw.trim(), document.baseURI);
      if (!(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) || url.username || url.password) return;
      const a = document.createElement('a');
      a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.className = 'tf-btn tf-primary';
      a.textContent = slot.dataset.config.startsWith('contrato-') ? 'Acessar modelo autorizado ↗' : 'Abrir aplicação ↗';
      slot.replaceChildren(a);
    } catch { /* Endereco invalido permanece indisponivel. */ }
  });
  $('tf-process-controls').hidden = false;
  on('tf-expand','click',() => all('.tf-process details').forEach(d => d.open = true));
  on('tf-collapse','click',() => all('.tf-process details').forEach(d => d.open = false));
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const cards = all('.tf-tool').map(el => ({el, category:el.dataset.category, search:normalize(el.textContent)}));
  let category = 'all';
  const applyFilters = () => {
    const words = normalize($('tf-search').value).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const match = (category === 'all' || card.category === category) && words.every(w => card.search.includes(w));
      card.el.hidden = !match;
      if (match) count++;
    }
    $('tf-count').textContent = `${count} de ${cards.length} ferramentas`;
    $('tf-no-results').hidden = count !== 0;
    all('[data-filter]').forEach(btn => btn.setAttribute('aria-pressed',String(btn.dataset.filter === category)));
  };
  $('tf-filters').hidden = false;
  on('tf-search','input',applyFilters);
  all('[data-filter]').forEach(btn => btn.addEventListener('click',() => {category = btn.dataset.filter; applyFilters();}));
  on('tf-reset','click',() => {category = 'all'; $('tf-search').value = ''; applyFilters(); $('tf-search').focus();});
  applyFilters();
  // Clipboard API requer HTTPS/permissao. Fallback por selecao manual, nunca afirma sucesso falso.
  const copy = async (text, source, statusId) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard');
      await navigator.clipboard.writeText(text);
      state(statusId,'Copiado para a área de transferência.','ok');
    } catch {
      if (source instanceof HTMLTextAreaElement || source instanceof HTMLInputElement) {source.focus(); source.select();}
      else {const sel = window.getSelection(); if (sel) {const r = document.createRange(); r.selectNodeContents(source); sel.removeAllRanges(); sel.addRange(r);}}
      state(statusId,'Cópia automática indisponível. Use Ctrl+C ou Cmd+C para copiar a seleção.');
    }
  };
  all('[data-copy]').forEach(btn => {btn.disabled = false; btn.addEventListener('click',() => {const source = $(btn.dataset.copy); copy(source.textContent,source,'tf-copy-status');});});
  // SHA-256: o hash e calculado sobre os bytes originais; texto convertido a UTF-8.
  let hashEpoch = 0;
  const resetHash = (message = 'Selecione a entrada para começar.') => {
    hashEpoch++; $('tf-hash-result').value = ''; $('tf-hash-copy').disabled = true; state('tf-hash-copy-status',''); $('tf-hash-run').disabled = !window.crypto?.subtle; state('tf-hash-status',message);
  };
  const setMode = () => {$('tf-hash-file-box').hidden = $('tf-hash-mode').value !== 'file'; $('tf-hash-text-box').hidden = $('tf-hash-mode').value !== 'text'; resetHash();};
  const compare = () => {
    const calculated = $('tf-hash-result').value;
    if (!calculated) return;
    const expected = $('tf-hash-expected').value.trim().toLowerCase();
    if (!expected) state('tf-hash-status','SHA-256 calculado. Informe um hash esperado para comparar.','ok');
    else if (!/^[0-9a-f]{64}$/.test(expected)) state('tf-hash-status','Hash esperado inválido: informe exatamente 64 caracteres hexadecimais.','error');
    else if (expected === calculated) state('tf-hash-status','Hashes coincidem. Os bytes conferem com o hash de referência informado.','ok');
    else state('tf-hash-status','Hashes diferentes. Verifique a origem, a versão ou possíveis alterações.','error');
  };
  $('tf-hash-fields').disabled = false;
  if (!window.crypto?.subtle) { $('tf-hash-run').disabled = true; state('tf-hash-status','Web Crypto indisponível. Abra via HTTPS ou localhost, ou utilize os comandos nativos.','error'); }
  on('tf-hash-mode','change',setMode);
  on('tf-hash-file','change',() => resetHash());
  on('tf-hash-text','input',() => resetHash());
  on('tf-hash-expected','input',compare);
  on('tf-hash-example','click',() => {$('tf-hash-text').value = 'abc'; $('tf-hash-expected').value = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'; resetHash('Exemplo carregado. Calcule para conferir.');});
  on('tf-hash-clear','click',() => {$('tf-hash-mode').value='file'; $('tf-hash-file').value=''; $('tf-hash-text').value=''; $('tf-hash-expected').value=''; setMode();});
  on('tf-hash-copy','click',() => copy($('tf-hash-result').value,$('tf-hash-result'),'tf-hash-copy-status'));
  on('tf-hash-run','click',async () => {
    if (!window.crypto?.subtle) return;
    resetHash('Calculando SHA-256…');
    const epoch = hashEpoch;
    $('tf-hash-run').disabled = true;
    try {
      let bytes;
      if ($('tf-hash-mode').value === 'file') {
        const file = $('tf-hash-file').files[0];
        if (!file) throw new Error('Selecione um arquivo.');
        if (file.size > 128 * 1024 * 1024) throw new Error('Arquivo acima de 128 MiB. Use os comandos nativos.');
        bytes = await file.arrayBuffer();
      } else {
        bytes = new TextEncoder().encode($('tf-hash-text').value);
        if (bytes.byteLength > 2 * 1024 * 1024) throw new Error('Texto acima de 2 MiB. Utilize um arquivo ou comando nativo.');
      }
      const digest = await crypto.subtle.digest('SHA-256',bytes);
      if (epoch !== hashEpoch) return;
      $('tf-hash-result').value = [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2,'0')).join('');
      $('tf-hash-copy').disabled = false; compare();
    } catch (err) { if (epoch === hashEpoch) state('tf-hash-status',err.message || 'Não foi possível calcular o hash.','error'); }
    finally { if (epoch === hashEpoch) $('tf-hash-run').disabled = false; }
  });
  // Inspecao XML: nao renderiza XML nem resolve referencias externas.
  let xmlEpoch = 0;
  const xmlMessage = text => { $('tf-xml-result').textContent = text; };
  $('tf-xml-fields').disabled = false;
  const invalidateXml = () => {xmlEpoch++; $('tf-xml-run').disabled = false; xmlMessage('Aguardando inspeção.');};
  on('tf-xml-file','change',() => {$('tf-xml-input').value=''; invalidateXml();});
  on('tf-xml-input','input',() => {$('tf-xml-file').value=''; invalidateXml();});
  on('tf-xml-example','click',() => {$('tf-xml-file').value=''; $('tf-xml-input').value='<?xml version="1.0" encoding="UTF-8"?>\n<documento xmlns="urn:exemplo"><identificacao>DEMONSTRACAO</identificacao></documento>'; invalidateXml();});
  on('tf-xml-clear','click',() => {$('tf-xml-file').value=''; $('tf-xml-input').value=''; invalidateXml(); xmlMessage('Aguardando entrada.');});
  on('tf-xml-run','click',async () => {
    const epoch = ++xmlEpoch; $('tf-xml-run').disabled = true; xmlMessage('Inspecionando…');
    try {
      let xml = $('tf-xml-input').value;
      const file = $('tf-xml-file').files[0];
      if (file) {
        if (file.size > 2*1024*1024) throw new Error('Arquivo acima de 2 MiB.');
        xml = new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());
      }
      if (epoch !== xmlEpoch) return;
      if (!xml.trim()) throw new Error('Informe um documento XML.');
      if (new TextEncoder().encode(xml).byteLength > 2*1024*1024) throw new Error('XML acima de 2 MiB.');
      if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) throw new Error('DTD ou declaração de entidade não permitida.');
      const enc = xml.match(/^\s*<\?xml\b[^?]*\bencoding\s*=\s*['"]([^'"]+)['"]/i);
      if (enc && !/^utf-8$/i.test(enc[1])) throw new Error('Somente XML UTF-8 é aceito neste inspetor.');
      const doc = new DOMParser().parseFromString(xml,'application/xml');
      if (doc.getElementsByTagNameNS('*','parsererror').length || doc.documentElement?.localName === 'parsererror' || !doc.documentElement) throw new Error('XML malformado. Verifique tags, atributos e caracteres.');
      const signatures = doc.getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#','Signature').length;
      xmlMessage(`XML bem formado.\nElemento raiz: ${doc.documentElement.nodeName}\nNamespace: ${doc.documentElement.namespaceURI || '(não informado)'}\nElementos XMLDSig Signature: ${signatures}\n\nNão é validação XSD nem verificação de assinatura ou conformidade fiscal.`);
    } catch(err) {if(epoch === xmlEpoch) xmlMessage('Não inspecionado: ' + (err.message || 'Erro desconhecido.'));}
    finally {if(epoch === xmlEpoch) $('tf-xml-run').disabled = false;}
  });
  // Altura do iframe: comunica apenas a altura, para a origem institucional autorizada.
  if (window.parent !== window) {
    const parentOrigin = 'https://lts.unochapeco.edu.br';
    let last = 0, scheduled = false;
    const resize = () => { if (scheduled) return; scheduled = true; requestAnimationFrame(() => {
      scheduled = false; const height = Math.ceil(root.getBoundingClientRect().height);
      if (height > 0 && height !== last) {last = height; window.parent.postMessage({type:'lts-ferramentas:resize',height},parentOrigin);}
    }); };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(root);
    window.addEventListener('message', event => {
      if (event.origin === parentOrigin && event.source === window.parent && event.data?.type === 'lts-ferramentas:request-height') { last = 0; resize(); }
    });
    window.addEventListener('load',resize); window.addEventListener('resize',resize); resize();
  }
})();
