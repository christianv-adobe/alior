/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.aliorbank.pl/ (.header-photo-big)
 * Two-column brand statement: one row, two cells. Cell 1 = text (heading +
 * paragraph + CTA), cell 2 = large photo.
 */
export default function parse(element, { document }) {
  // Text column.
  const textCell = [];
  const heading = element.querySelector('.text-wrapper .title, .title, h1, h2');
  if (heading) textCell.push(heading);

  const description = element.querySelector('.text-wrapper .description, .description, p');
  if (description) textCell.push(description);

  const cta = element.querySelector('.button-wrapper a, a.button');
  if (cta) textCell.push(cta);

  // Image column.
  const img = element.querySelector('.image-wrapper img, .image-wrapper picture, img');

  // Empty-block guard.
  if (!textCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, img ? [img] : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
