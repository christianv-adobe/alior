/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-highlight. Base: cards (no images).
 * Source: https://www.aliorbank.pl/ (.highlight-boxes)
 * Three-up compact promo boxes, no images. Convention: 1 column, one row per
 * box. Each cell holds heading (inside its link) + short text.
 */
export default function parse(element, { document }) {
  const cells = [];

  const boxes = element.querySelectorAll('.highlight-box');
  const list = boxes.length ? [...boxes] : [element];

  list.forEach((box) => {
    const cardCell = [];

    // Heading — keep inside its link so the box stays clickable.
    const link = box.querySelector('a.highlight-box-link');
    const title = box.querySelector('.highlight-box-title, h2, h3');
    if (link && title && link.contains(title)) {
      cardCell.push(link);
    } else if (title) {
      cardCell.push(title);
    } else if (link) {
      cardCell.push(link);
    }

    // Short text.
    const text = box.querySelector('.highlight-box-text, p');
    if (text) cardCell.push(text);

    if (cardCell.length) cells.push([cardCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-highlight', cells });
  element.replaceWith(block);
}
