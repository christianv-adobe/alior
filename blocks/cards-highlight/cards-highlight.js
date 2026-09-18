/**
 * cards-highlight — three-up promo highlight boxes that overlap the hero.
 * Each row is one box: bold title link + short description + circular arrow CTA.
 * Mirrors the source .highlight-box design (white rounded card, drop shadow,
 * pink arrow button bottom-right). No images.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'card';

    // The authored cell holds: <p><a>## Title</a></p> and <p>description</p>.
    const cell = row.querySelector(':scope > div') || row;

    // Title link — first anchor. Strip the leading markdown "##".
    const titleLink = cell.querySelector('a');
    let href = '#';
    if (titleLink) {
      href = titleLink.getAttribute('href') || '#';
      titleLink.textContent = titleLink.textContent.replace(/^\s*#+\s*/, '').trim();
      titleLink.classList.add('title');
      // Unwrap the surrounding <p> so the title sits directly in the card.
      const p = titleLink.closest('p');
      if (p && p.parentElement) p.replaceWith(titleLink);
    }

    // Remaining paragraphs are description text.
    [...cell.querySelectorAll('p')].forEach((p) => p.classList.add('text'));

    // Move all content from the authored cell into the card.
    while (cell.firstChild) li.append(cell.firstChild);

    // Circular arrow CTA, links to the same destination as the title.
    const arrow = document.createElement('a');
    arrow.className = 'cards-highlight-arrow';
    arrow.href = href;
    arrow.setAttribute('aria-label', titleLink ? titleLink.textContent : 'Sprawdź');
    arrow.innerHTML = '<span aria-hidden="true">→</span>';
    li.append(arrow);

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
