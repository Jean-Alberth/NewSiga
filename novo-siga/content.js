/* Novo SIGA: nenhuma senha, cookie, nota ou informação pessoal é armazenada.
 * A navegação aciona os elementos originais, preservando os handlers GeneXus.
 */
(() => {
  'use strict';
  if (document.getElementById('ns-panel')) return;
  let enabled = true;
  let pending = null;
  let pendingTimer;
  const routes = [
    ['⌂', 'Início', 'FOOTER:HOME'],
    ['▦', 'Meu curso', 'FOOTER:MEUCURSO'],
    ['▤', 'Disciplinas', 'MEUCURSO:DISCIPLINAS'],
    ['✓', 'Notas', 'MEUCURSO:NOTAS'],
    ['◷', 'Frequência', 'MEUCURSO:FALTAS'],
    ['▥', 'Horários', 'MEUCURSO:HORARIO'],
    ['▧', 'Histórico', 'MEUCURSO:HISTORICOESCOLAR'],
    ['↪', 'Sair', 'FOOTER:SAIR']
  ];
  const panel = document.createElement('aside');
  panel.id = 'ns-panel';
  panel.setAttribute('aria-label', 'Novo SIGA');
  const brand = document.createElement('div');
  brand.className = 'ns-brand';
  brand.textContent = 'Fatec';
  const subtitle = document.createElement('small');
  subtitle.textContent = 'NOVO SIGA · PROJETO ACADÊMICO';
  brand.append(subtitle);
  panel.append(brand);
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Navegação acadêmica');
  panel.append(nav);
  const status = document.createElement('p');
  status.className = 'ns-status';
  status.setAttribute('role', 'status');
  const user = document.createElement('div');
  user.className = 'ns-user';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ns-toggle';
  toggle.textContent = 'Ver portal original';
  toggle.setAttribute('aria-pressed', 'true');
  const find = (route) => Array.from(document.querySelectorAll('[onclick]')).find(el => {
    if (el.closest('#ns-panel')) return false;
    const match = (el.getAttribute('onclick') || '').match(/bootstrapclick\('([^']+)'\)/);
    return match && match[1] === route;
  });
  function clearPending() {
    pending = null;
    clearTimeout(pendingTimer);
  }
  function go(route) {
    clearPending();
    const target = find(route);
    if (target) { status.textContent = ''; target.click(); return; }
    const course = find('FOOTER:MEUCURSO');
    if (route.startsWith('MEUCURSO:') && course) {
      pending = route;
      status.textContent = 'Abrindo meu curso…';
      pendingTimer = setTimeout(() => {
        clearPending();
        status.textContent = 'Abra Meu curso e tente novamente.';
      }, 10000);
      course.click();
    } else status.textContent = 'Este atalho não está disponível nesta tela.';
  }
  routes.forEach(([icon, label, route]) => {
    const button = document.createElement('button');
    button.type = 'button';
    const symbol = document.createElement('span');
    symbol.textContent = icon;
    symbol.setAttribute('aria-hidden', 'true');
    button.append(symbol, document.createTextNode(label));
    button.dataset.route = route;
    button.addEventListener('click', () => go(route));
    nav.append(button);
  });
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    clearPending();
    refresh();
  });
  panel.append(status, user, toggle);
  document.body.append(panel);
  function refresh() {
    const authenticated = !!document.querySelector('#TOPBAR .uc_appuser-name');
    // A tela de login não é alterada.
    panel.hidden = !authenticated;
    document.body.classList.toggle('ns-active', enabled && authenticated);
    panel.classList.toggle('ns-original', !enabled);
    toggle.textContent = enabled ? 'Ver portal original' : 'Ativar Novo SIGA';
    toggle.setAttribute('aria-pressed', String(enabled));
    const userName = document.querySelector('.uc_appuser-name')?.textContent.trim() || '';
    if (user.textContent !== userName) user.textContent = userName;
    const title = document.querySelector('.uc_appheader-title')?.textContent || '';
    const active = /Consulta notas/.test(title) ? 'MEUCURSO:NOTAS' :
      /Faltas/.test(title) ? 'MEUCURSO:FALTAS' :
      /Horário/.test(title) ? 'MEUCURSO:HORARIO' :
      /Histórico/.test(title) ? 'MEUCURSO:HISTORICOESCOLAR' :
      /Disciplinas|IAL\d|ILP\d|ISW\d|MET\d/.test(title) ? 'MEUCURSO:DISCIPLINAS' :
      document.querySelector('.ep-wrap') ? 'FOOTER:MEUCURSO' : 'FOOTER:HOME';
    nav.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.route === active;
      button.classList.toggle('ns-selected', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
      const available = !!find(button.dataset.route) ||
        (button.dataset.route.startsWith('MEUCURSO:') && !!find('FOOTER:MEUCURSO'));
      button.disabled = !available;
    });
    if (pending && enabled) {
      const target = find(pending);
      if (target) {
        clearPending();
        status.textContent = '';
        target.click();
      }
    }
  }
  let scheduled = false;
  new MutationObserver(records => {
    // Ignora nossas próprias atualizações para evitar ciclos de renderização.
    if (!records.some(record => !panel.contains(record.target))) return;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; refresh(); });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  refresh();
})();
