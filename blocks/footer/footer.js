// Alior Bank footer — dark maroon, built from content/footer.plain.html.
// Sections: (0) app badges + phone/language, (1) icon-nav, (2) link columns,
// (3) copyright + social icons. All copy/links/images come from the fragment.

const SECTION_CLASSES = ['footer-apps', 'footer-iconnav', 'footer-columns', 'footer-legal'];

export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod).
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.querySelectorAll(':scope > div')];

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  sections.forEach((section, i) => {
    section.classList.add(SECTION_CLASSES[i] || `footer-section-${i}`);
    footer.append(section);
  });

  // Tag icon-nav and column lists for styling.
  const iconNav = footer.querySelector('.footer-iconnav ul');
  if (iconNav) iconNav.classList.add('footer-iconnav-list');
  footer.querySelectorAll('.footer-columns ul').forEach((ul) => ul.classList.add('footer-column'));

  // Social list = last <ul> in the legal section.
  const legal = footer.querySelector('.footer-legal');
  if (legal) {
    const social = legal.querySelector('ul');
    if (social) social.classList.add('footer-social');
  }

  // App-store badge list.
  const apps = footer.querySelector('.footer-apps ul');
  if (apps) apps.classList.add('footer-app-badges');

  // Back-to-top button (built here, not in the fragment).
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'footer-to-top';
  toTop.setAttribute('aria-label', 'Przejdź na górę strony');
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (legal) legal.append(toTop);

  block.append(footer);
}
