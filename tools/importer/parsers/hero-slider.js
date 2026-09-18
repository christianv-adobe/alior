/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-slider. Base: hero (custom tabbed-slider variant).
 * Source: https://www.aliorbank.pl/ (.hero-main-slider)
 *
 * NOTE: This is a custom multi-slide variant. Its authoritative structure is
 * the block's own decorate (blocks/hero-slider/hero-slider.js), which treats
 * each table row as one slide with up to 3 cells:
 *   cell 1: tab label (short plain text — the active tab's caption)
 *   cell 2: slide content (heading + paragraph + CTA links)
 *   cell 3: promotional image
 * The generic 1-column "Hero" convention does not support tabbed slides, so we
 * follow the variant's decorate contract instead.
 */
export default function parse(element, { document }) {
  const cells = [];

  const slides = element.querySelectorAll('.main-slide, .swiper-slide.main-slide');

  [...slides].forEach((slide) => {
    // Tab label: the active tab caption for this slide.
    const activeTab = slide.querySelector('.tabs-container .tab-active, .tab.tab-active');
    const labelCell = [];
    if (activeTab) {
      const p = document.createElement('p');
      p.textContent = activeTab.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) labelCell.push(p);
    }

    // Content: heading + description + CTA buttons.
    const contentCell = [];
    const heading = slide.querySelector('.content-inner .hero-title, .hero-title, h1, h2');
    if (heading) contentCell.push(heading);

    const description = slide.querySelector('.content-inner .description, .description');
    if (description) contentCell.push(description);

    const ctas = slide.querySelectorAll('.buttons-container a, .buttons-container a.button');
    ctas.forEach((a) => contentCell.push(a));

    // Image.
    const img = slide.querySelector('.image-column img, .image-column picture, img');

    if (!contentCell.length && !img && !labelCell.length) return;

    cells.push([
      labelCell.length ? labelCell : '',
      contentCell,
      img ? [img] : '',
    ]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-slider', cells });
  element.replaceWith(block);
}
