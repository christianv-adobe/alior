/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards (no images).
 * Source: https://www.aliorbank.pl/ (.articles-widget)
 * Convention: 1 column, multiple rows. Each row = one card in a single cell
 * containing heading, description, and CTA. A lone heading (+"see all" link)
 * with no <p> is promoted to a thematic group header.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each thematic group is an .articles-widget__column.
  const columns = element.querySelectorAll('.articles-widget__column');
  const groups = columns.length ? [...columns] : [element];

  groups.forEach((column) => {
    // Group header: heading + optional "see all" link (single cell, no <p>).
    const title = column.querySelector('.articles-widget__title, h2, h3');
    const seeAll = column.querySelector('.articles-widget__link, a.button.tertiary');
    if (title) {
      const headerCell = [title];
      const titleRow = title.closest('.articles-widget__title-row');
      if (seeAll && titleRow && titleRow.contains(seeAll)) headerCell.push(seeAll);
      cells.push([headerCell]);
    }

    // Teaser cards. Use the inner .article-card only (its wrapper
    // .article-widget-card would double-select the same content).
    const cards = column.querySelectorAll('.article-card');
    cards.forEach((card) => {
      const cardCell = [];
      const date = card.querySelector('.articles-date, .article-info span');
      const cardTitle = card.querySelector('.article-title, h3');
      const description = card.querySelector('.article-description');
      const readMore = card.querySelector('.article-card > a.button, a.button.tertiary:not(.article-title-link)');

      if (date) cardCell.push(date);
      if (cardTitle) cardCell.push(cardTitle);
      if (description) {
        // Normalize excerpt to a <p> so a card is never mistaken for a group header.
        const existingP = description.querySelector('p');
        if (existingP) {
          cardCell.push(existingP);
        } else {
          const p = document.createElement('p');
          p.textContent = description.textContent.trim();
          cardCell.push(p);
        }
      }
      if (readMore) cardCell.push(readMore);

      if (cardCell.length) cells.push([cardCell]);
    });
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
