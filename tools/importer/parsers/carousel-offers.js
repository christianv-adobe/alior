/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-offers. Base: carousel.
 * Source: https://www.aliorbank.pl/ (.benefits-section-2 .swiper)
 * Horizontally-scrollable offer cards. Convention: 2 columns, one row per
 * slide. Cell 1 = image (only). Cell 2 = text (optional tag/RRSO label +
 * heading inside its link).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Do not fall back to treating the whole element as a slide — a section-level
  // selector would otherwise emit a bogus row from the section heading.
  const slides = element.querySelectorAll('article.benefits-slide, .benefits-slide, .swiper-slide article');

  [...slides].forEach((slide) => {
    // Body: tag/RRSO label + heading (inside its link).
    const bodyCell = [];
    const tag = slide.querySelector('.tag');
    if (tag) bodyCell.push(tag);

    const link = slide.querySelector('a.benefits-slide-link');
    const title = slide.querySelector('.slide-title, h2, h3, h4');
    if (link && title && link.contains(title)) {
      bodyCell.push(link);
    } else if (title) {
      bodyCell.push(title);
    } else if (link) {
      bodyCell.push(link);
    }

    // Image (first cell, image only).
    const img = slide.querySelector('.benefits-image, .image-wrapper img, img');

    if (!img && !bodyCell.length) return;

    if (img) {
      cells.push([[img], bodyCell]);
    } else {
      cells.push(['', bodyCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-offers', cells });
  element.replaceWith(block);
}
