(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ids = ['tipo', 'referencia', 'empresa', 'cnpj', 'software', 'versao', 'responsavel', 'data', 'escopo', 'evidencias', 'resultado', 'observacoes'];
  const names = { tipo: 'Tipo de documento', referencia: 'Referência', empresa: 'Empresa', cnpj: 'CNPJ', software: 'Aplicação', versao: 'Versão', responsavel: 'Responsável', data: 'Data', escopo: 'Escopo', evidencias: 'Evidências', resultado: 'Estado preliminar', observacoes: 'Observações' };
  const form = $('draft-form');
  const typeParam = new URLSearchParams(location.search).get('tipo');
  if (typeParam === 'dtc' || typeParam === 'lcl') $('tipo').value = typeParam.toUpperCase();
  const d = new Date(); $('data').value = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  const NS = 'urn:lts:prototipo-nao-oficial:laudos:1';
  let current = null, xmlText = '';
  function addElement(doc, parent, tag, value) { const node = doc.createElementNS(NS, tag); node.textContent = value; parent.appendChild(node); return node; }
  function generateXml(data) {
    const doc = document.implementation.createDocument(NS, 'MinutaLTS', null), root = doc.documentElement;
    root.setAttribute('versaoDoPrototipo', '1.1'); root.setAttribute('natureza', 'RASCUNHO_NAO_OFICIAL');
    addElement(doc, root, 'Status', 'MINUTA_NAO_OFICIAL');
    addElement(doc, root, 'Aviso', 'Não constitui laudo oficial, LCL válido, homologação ou documento assinado digitalmente.');
    addElement(doc, root, 'Tipo', data.tipo); addElement(doc, root, 'ReferenciaInterna', data.referencia);
    const company = doc.createElementNS(NS, 'Empresa'); root.appendChild(company);
    addElement(doc, company, 'RazaoSocial', data.empresa); addElement(doc, company, 'CNPJ', data.cnpj);
    const software = doc.createElementNS(NS, 'Software'); root.appendChild(software);
    addElement(doc, software, 'Nome', data.software); addElement(doc, software, 'Versao', data.versao);
    addElement(doc, root, 'ResponsavelPelaMinuta', data.responsavel); addElement(doc, root, 'DataReferencia', data.data);
    const analysis = doc.createElementNS(NS, 'Analise'); root.appendChild(analysis);
    addElement(doc, analysis, 'Escopo', data.escopo); addElement(doc, analysis, 'EvidenciasResumidas', data.evidencias);
    addElement(doc, analysis, 'ResultadoPreliminar', data.resultado); addElement(doc, analysis, 'Observacoes', data.observacoes);
    addElement(doc, root, 'AssinaturaDigital', 'NAO_ASSINADO');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc);
  }
  function download(content, mime, filename) { const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function filename() { return 'MINUTA_' + current.tipo + '_' + (current.referencia.replace(/[^a-z0-9_-]/gi, '-').slice(0, 45) || 'sem-referencia'); }
  function buildPrint(data) {
    const area = $('summary-print'); area.replaceChildren();
    const watermark = document.createElement('div'); watermark.className = 'print-watermark'; watermark.textContent = 'MINUTA NÃO OFICIAL — SEM ASSINATURA DIGITAL';
    const title = document.createElement('h1'); title.textContent = 'LTS / ' + data.tipo + ' — Resumo de minuta';
    const dl = document.createElement('dl');
    for (const id of ids) { const dt = document.createElement('dt'); dt.textContent = names[id]; const dd = document.createElement('dd'); dd.textContent = data[id]; dl.append(dt, dd); }
    area.append(watermark, title, dl);
  }
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (!form.reportValidity()) return;
    const data = Object.fromEntries(ids.map(id => [id, $(id).value.trim()]));
    if (data.cnpj && !/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data.cnpj)) { $('cnpj').setCustomValidity('Informe 14 dígitos ou CNPJ formatado.'); $('cnpj').reportValidity(); return; }
    $('cnpj').setCustomValidity('');
    const xml = generateXml(data);
    if (new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')) { $('preview-help').textContent = 'Falha ao montar XML.'; return; }
    current = data; xmlText = xml; $('xml-preview').textContent = xml;
    $('preview-help').textContent = 'Minuta gerada localmente. Sem XSD oficial, assinatura digital ou validade de homologação.';
    for (const id of ['save-xml', 'save-json', 'print-summary']) $(id).disabled = false;
    buildPrint(data);
    try { const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(xml)); const hash = Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join(''); $('xml-digest').textContent = 'SHA-256 do XML: ' + hash; } catch { $('xml-digest').textContent = 'SHA-256 indisponível fora de contexto HTTPS/localhost.'; }
  });
  $('cnpj').addEventListener('input', () => $('cnpj').setCustomValidity(''));
  $('save-xml').addEventListener('click', () => { if (current) download(xmlText, 'application/xml;charset=utf-8', filename() + '.xml'); });
  $('save-json').addEventListener('click', () => { if (current) download(JSON.stringify({ status: 'MINUTA_NAO_OFICIAL', namespace: NS, documento: current }, null, 2), 'application/json;charset=utf-8', filename() + '.json'); });
  $('print-summary').addEventListener('click', () => { if (current) window.print(); });
  form.addEventListener('reset', () => { current = null; xmlText = ''; $('xml-preview').textContent = '<!-- O XML aparecerá aqui. -->'; $('xml-digest').textContent = ''; $('preview-help').textContent = 'Preencha o formulário e clique em “Gerar minuta XML”.'; $('summary-print').replaceChildren(); for (const id of ['save-xml', 'save-json', 'print-summary']) $(id).disabled = true; });
})();
