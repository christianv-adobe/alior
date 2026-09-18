import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Tabbed hero slider.
 * Authoring model: each row of the block is one slide.
 *   - cell 1: tab label (short text used for the tab button)
 *   - cell 2: slide content (heading, paragraph, CTA links)
 *   - cell 3: promotional image (optional)
 * If a slide omits the tab label, an index-based label is used.
 */
export default function decorate(block) {
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'hero-slider-tabs';
  tablist.setAttribute('role', 'tablist');

  const slides = document.createElement('div');
  slides.className = 'hero-slider-slides';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    // Detect optional tab-label cell: a cell that holds only short plain text
    // (no heading/list/link) is treated as the tab label.
    let labelCell;
    if (cells.length > 2) {
      [labelCell] = cells;
    } else if (cells.length && !cells[0].querySelector('h1,h2,h3,h4,h5,h6,p,ul,ol,a,picture,img')) {
      [labelCell] = cells;
    }

    const contentCells = labelCell ? cells.slice(1) : cells;

    const slide = document.createElement('div');
    slide.className = 'hero-slider-slide';
    slide.setAttribute('role', 'tabpanel');
    slide.id = `hero-slide-${i}`;

    contentCells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic) {
        cell.classList.add('hero-slider-media');
        const img = pic.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, i === 0, [{ width: '750' }]);
          pic.replaceWith(optimized);
        }
      } else {
        cell.classList.add('hero-slider-content');
        // EDS decorateButtons may already have added `.button`; ensure every CTA
        // link is a button and style the first as primary (filled), rest secondary (outline).
        cell.querySelectorAll('a').forEach((a, ctaIndex) => {
          a.classList.add('button');
          a.classList.remove('primary', 'secondary');
          a.classList.add(ctaIndex === 0 ? 'primary' : 'secondary');
        });
      }
      slide.append(cell);
    });

    slides.append(slide);

    const label = labelCell ? labelCell.textContent.trim() : `Slide ${i + 1}`;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'hero-slider-tab';
    tab.textContent = label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', slide.id);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.addEventListener('click', () => {
      tablist.querySelectorAll('.hero-slider-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      slides.querySelectorAll('.hero-slider-slide').forEach((s) => s.classList.remove('active'));
      tab.setAttribute('aria-selected', 'true');
      slide.classList.add('active');
    });
    tablist.append(tab);

    if (i === 0) slide.classList.add('active');
  });

  block.textContent = '';
  // Only render the tab strip when there is more than one slide.
  if (rows.length > 1) block.append(tablist);
  block.append(slides);
}
