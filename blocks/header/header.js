// Alior Bank header — two rows built from content/nav.plain.html.
// Row 0 (utility/brand bar): logo, client-segment switcher, Otwórz konto, Zaloguj.
// Row 1 (main nav): click-triggered megamenus (Oferta, Bankowość elektroniczna),
// direct links (Promocje, Kontakt), and an expandable search form.
// All copy/links/images come from the fragment; controls are built here.

const MEDIA_DESKTOP = '(width >= 900px)';

/** Close every open dropdown/megamenu and reset triggers. */
function closeAll(nav) {
  nav.querySelectorAll('[aria-expanded="true"]').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
  nav.querySelectorAll('.header-panel-open').forEach((p) => p.classList.remove('header-panel-open'));
}

/** Wire a trigger button to toggle its associated panel. */
function wireToggle(nav, button, panel) {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    closeAll(nav);
    if (!isOpen) {
      button.setAttribute('aria-expanded', 'true');
      if (panel) panel.classList.add('header-panel-open');
    }
  });
}

/** Build the row-0 brand/utility bar from the first fragment section. */
function buildBrandRow(section, nav) {
  const row = document.createElement('div');
  row.className = 'header-brand-row';

  const logoP = section.querySelector('p');
  const lists = section.querySelectorAll('ul');
  const [switcherList, actionsList] = lists;

  // Logo
  const brand = document.createElement('div');
  brand.className = 'header-brand';
  if (logoP) brand.append(logoP.querySelector('a') || logoP);
  row.append(brand);

  const tools = document.createElement('div');
  tools.className = 'header-tools';

  // Client-segment switcher (dropdown built from the first <ul>)
  if (switcherList) {
    const wrap = document.createElement('div');
    wrap.className = 'header-switcher';
    const items = [...switcherList.querySelectorAll('li')];
    const current = items[0] ? items[0].textContent.trim() : 'Menu';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header-switcher-toggle';
    btn.textContent = current;
    const menu = document.createElement('ul');
    menu.className = 'header-switcher-menu';
    items.forEach((li) => {
      const mi = document.createElement('li');
      mi.textContent = li.textContent.trim();
      menu.append(mi);
    });
    wrap.append(btn, menu);
    wireToggle(nav, btn, menu);
    tools.append(wrap);
  }

  // Action links (Otwórz konto, Zaloguj)
  if (actionsList) {
    const actions = document.createElement('div');
    actions.className = 'header-actions';
    [...actionsList.querySelectorAll('a')].forEach((a, i) => {
      a.classList.add('button', i === 0 ? 'secondary' : 'primary');
      actions.append(a);
    });
    tools.append(actions);
  }

  row.append(tools);
  return row;
}

/** Build a megamenu panel from a nav <li> that contains a nested <ul>. */
function buildMegamenu(li, label) {
  const panel = document.createElement('div');
  panel.className = 'header-megamenu';

  const grid = document.createElement('div');
  grid.className = 'header-megamenu-grid';
  const innerList = li.querySelector(':scope > ul');
  if (innerList) {
    [...innerList.querySelectorAll(':scope > li')].forEach((item) => {
      const card = document.createElement('a');
      const link = item.querySelector('a');
      card.className = 'header-megamenu-card';
      card.href = link ? link.getAttribute('href') : '#';
      const img = item.querySelector('img');
      if (img) {
        const ic = document.createElement('span');
        ic.className = 'header-megamenu-icon';
        ic.append(img);
        card.append(ic);
      }
      const body = document.createElement('span');
      body.className = 'header-megamenu-body';
      const title = document.createElement('span');
      title.className = 'header-megamenu-title';
      title.textContent = link ? link.textContent.trim() : '';
      body.append(title);
      const desc = item.querySelector(':scope > p');
      if (desc) {
        const d = document.createElement('span');
        d.className = 'header-megamenu-desc';
        d.textContent = desc.textContent.trim();
        body.append(d);
      }
      card.append(body);
      grid.append(card);
    });
  }
  panel.append(grid);

  // Remaining top-level <p> links = promo + "Zobacz wszystko" footer.
  const extras = [...li.querySelectorAll(':scope > p')];
  if (extras.length) {
    const footer = document.createElement('div');
    footer.className = 'header-megamenu-footer';
    extras.forEach((p) => {
      const a = p.querySelector('a');
      if (a) footer.append(a);
    });
    panel.append(footer);
  }

  panel.setAttribute('aria-label', label);
  return panel;
}

/** Build the row-1 main navigation from the second fragment section. */
function buildNavRow(section, nav) {
  const row = document.createElement('div');
  row.className = 'header-nav-row';

  const list = document.createElement('ul');
  list.className = 'header-nav-list';

  const topList = section.querySelector(':scope > ul');
  if (topList) {
    [...topList.querySelectorAll(':scope > li')].forEach((li) => {
      const item = document.createElement('li');
      item.className = 'header-nav-item';
      const directLink = li.querySelector(':scope > a');
      const hasPanel = li.querySelector(':scope > ul');

      if (hasPanel) {
        const labelEl = li.querySelector(':scope > p');
        const label = labelEl ? labelEl.textContent.trim() : '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'header-nav-trigger';
        btn.textContent = label;
        const panel = buildMegamenu(li, label);
        item.append(btn, panel);
        wireToggle(nav, btn, panel);
      } else if (directLink) {
        directLink.classList.add('header-nav-link');
        item.append(directLink);
      }
      list.append(item);
    });
  }
  row.append(list);

  // Expandable search form (built here — never in the fragment).
  const search = document.createElement('div');
  search.className = 'header-search';
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'header-search-toggle';
  searchBtn.setAttribute('aria-label', 'Otwórz wyszukiwanie');
  const form = document.createElement('form');
  form.className = 'header-search-form';
  form.setAttribute('role', 'search');
  form.action = 'https://www.aliorbank.pl/wyszukiwarka.html';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Szukaj';
  input.setAttribute('aria-label', 'Szukaj');
  form.append(input);
  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = search.classList.toggle('header-search-open');
    if (open) input.focus();
  });
  search.append(searchBtn, form);
  row.append(search);

  return row;
}

export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod).
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.querySelectorAll(':scope > div')];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.className = 'header-nav';
  nav.setAttribute('aria-label', 'Główna nawigacja');

  // Hamburger (mobile) — toggles the nav row open/closed.
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'header-hamburger';
  hamburger.setAttribute('aria-label', 'Otwórz nawigację');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="header-hamburger-icon"></span>';

  const brandRow = sections[0] ? buildBrandRow(sections[0], nav) : null;
  const navRow = sections[1] ? buildNavRow(sections[1], nav) : null;

  // Source layout: logo is a tall column on the LEFT; the utility row (tools)
  // and the main-nav row stack in a column to the RIGHT of the logo.
  // Lift the logo out of the brand row into its own left column.
  const logo = brandRow ? brandRow.querySelector('.header-brand') : null;
  if (logo) logo.remove();

  const logoCol = document.createElement('div');
  logoCol.className = 'header-logo-col';
  if (logo) logoCol.append(logo);

  const mainCol = document.createElement('div');
  mainCol.className = 'header-main-col';
  if (brandRow) mainCol.append(brandRow);
  if (navRow) mainCol.append(navRow);

  nav.append(logoCol, mainCol);

  // Place hamburger beside the logo (visible on mobile only).
  logoCol.append(hamburger);
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('header-mobile-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Zamknij nawigację' : 'Otwórz nawigację');
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  // Close panels on outside click / Escape.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll(nav);
      nav.classList.remove('header-mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Viewport resize handling: reset panels/hamburger when crossing breakpoints.
  const mq = window.matchMedia(MEDIA_DESKTOP);
  const onChange = () => {
    closeAll(nav);
    nav.classList.remove('header-mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
}
