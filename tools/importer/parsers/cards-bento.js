/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-bento. Base: cards.
 * Source: https://www.aliorbank.pl/ (.bento-boxes__wrapper / .bento-boxes__slider)
 * Bento grid of promotional tiles. Tiles have images, so use the 2-column
 * Cards convention: cell 1 = image, cell 2 = text (badge + title link +
 * description). One row per tile.
 */
export default function parse(element, { document }) {
  const cells = [];

  const tiles = element.querySelectorAll('.bento-boxes__box');
  const list = tiles.length ? [...tiles] : [element];

  list.forEach((tile) => {
    // Image cell: the main tile image.
    const img = tile.querySelector('.bento-boxes__content img, .bento-boxes__content picture, img');

    // Text cell content.
    const textCell = [];

    // Promotional badge / label (e.g. "POLECAMY", "Użyj kodu PREMIA2026").
    const badge = tile.querySelector('.bento-boxes__badge, .promotion-badge-text');
    if (badge) {
      const p = document.createElement('p');
      p.textContent = badge.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) textCell.push(p);
    }

    // Title (heading) — keep it inside its link so the tile stays clickable.
    const link = tile.querySelector('a.bento-boxes__link');
    const title = tile.querySelector('.bento-boxes__title, h2, h3');
    if (link && title && link.contains(title)) {
      textCell.push(link);
    } else if (title) {
      textCell.push(title);
    } else if (link) {
      textCell.push(link);
    }

    // Description.
    const description = tile.querySelector('.bento-boxes__description');
    if (description) textCell.push(description);

    // A tile must have at least an image or some text.
    if (!img && !textCell.length) return;

    if (img) {
      cells.push([img, textCell]);
    } else {
      // No image: pad first cell so every row keeps 2 columns.
      cells.push(['', textCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-bento', cells });
  element.replaceWith(block);
}
