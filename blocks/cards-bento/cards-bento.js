import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-bento — bento grid of promotional tiles of varying size.
 * Each authored row is one tile: image + heading + optional tag/label + CTA.
 * The source layout (aliorbank.pl "Może Cię zainteresować") is an asymmetric
 * bento: a large featured tile (2x2), two standard tiles, and one wide tile.
 *
 * Text sits at the TOP of each tile and the image fills the bottom, so the
 * image cell is re-ordered after the body. Tile size can be author-driven via
 * a class token (large / wide / tall / small); when no token is present we
 * fall back to the source bento pattern (first tile large, last tile wide).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    ['large', 'tall', 'wide', 'small'].forEach((size) => {
      if (row.classList.contains(size)) li.classList.add(size);
    });
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-bento-card-image';
      else div.className = 'cards-bento-card-body';
    });
    // Text on top, image flush at the bottom (matches source tiles).
    const image = li.querySelector('.cards-bento-card-image');
    if (image) li.append(image);
    ul.append(li);
  });

  const items = [...ul.children];

  // Default bento shape when the author supplied no explicit size tokens.
  const hasHint = items.some((li) => li.classList.contains('large')
    || li.classList.contains('wide')
    || li.classList.contains('tall')
    || li.classList.contains('small'));
  if (!hasHint && items.length >= 3) {
    items[0].classList.add('large');
    items[items.length - 1].classList.add('wide');
  }

  // Clean up markdown heading prefixes and classify labels vs. titles.
  items.forEach((li) => {
    const body = li.querySelector('.cards-bento-card-body');
    if (!body) return;
    [...body.querySelectorAll(':scope > p')].forEach((p) => {
      const a = p.querySelector('a');
      if (a) {
        a.textContent = a.textContent.replace(/^#+\s*/, '').trim();
        p.classList.add('cards-bento-card-title');
      } else if (!p.querySelector('br') && p.textContent.trim() && p.textContent.trim().length <= 24) {
        p.classList.add('cards-bento-card-tag');
        if (/polecamy/i.test(p.textContent)) p.classList.add('featured');
      }
    });

    // Legal-note disclosure ("+ nota prawna"): the source shows this trigger on
    // every bento tile. Its expandable legal text lives in inert <template>
    // elements that don't survive the static import, so we render just the
    // trigger to match the source affordance.
    const note = document.createElement('button');
    note.type = 'button';
    note.className = 'cards-bento-note';
    note.textContent = '+ nota prawna';
    note.setAttribute('aria-expanded', 'false');
    body.append(note);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
