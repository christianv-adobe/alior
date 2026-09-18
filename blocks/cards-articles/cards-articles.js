/**
 * cards-articles — thematic columns of article/news teasers (no images).
 *
 * Authored as a flat list of rows. A row whose cell contains a heading (h2)
 * opens a new thematic column and acts as its group header (title + a
 * "see all" link). Every following row until the next header is an article
 * teaser (date, title, excerpt, "read more" CTA) belonging to that column.
 *
 * Decorated DOM:
 *   .cards-articles > .cards-articles-wrap (flex: columns side by side)
 *     .cards-articles-column
 *       .cards-articles-header  (h2 + a.cards-articles-seeall)
 *       .cards-articles-list
 *         article.cards-articles-card (date, h3, excerpt, a.cards-articles-cta)
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'cards-articles-wrap';
  let list = null;

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild || row;
    const heading = cell.querySelector('h1,h2,h3,h4,h5,h6');
    const isHeader = heading && heading.matches('h2')
      && !cell.querySelector('h3');

    if (isHeader) {
      const column = document.createElement('div');
      column.className = 'cards-articles-column';
      const header = document.createElement('div');
      header.className = 'cards-articles-header';
      header.append(heading);
      const seeAll = cell.querySelector('a');
      if (seeAll) {
        seeAll.className = 'cards-articles-seeall';
        header.append(seeAll);
      }
      list = document.createElement('div');
      list.className = 'cards-articles-list';
      column.append(header, list);
      wrap.append(column);
      return;
    }

    // Article teaser. Ensure a column exists even without a preceding header.
    if (!list) {
      const column = document.createElement('div');
      column.className = 'cards-articles-column';
      list = document.createElement('div');
      list.className = 'cards-articles-list';
      column.append(list);
      wrap.append(column);
    }

    const card = document.createElement('article');
    card.className = 'cards-articles-card';

    const h3 = cell.querySelector('h3');
    const anchors = [...cell.querySelectorAll('a')];
    const cta = anchors.find((a) => !a.closest('h1,h2,h3,h4,h5,h6'));
    const paras = [...cell.querySelectorAll(':scope > p')].filter((p) => !p.contains(cta));

    const date = paras.shift();
    if (date) { date.className = 'cards-articles-date'; card.append(date); }
    if (h3) { h3.classList.add('cards-articles-title'); card.append(h3); }
    paras.forEach((p) => { p.classList.add('cards-articles-excerpt'); card.append(p); });
    if (cta) { cta.className = 'cards-articles-cta'; card.append(cta); }

    list.append(card);
  });

  block.textContent = '';
  block.append(wrap);
}
