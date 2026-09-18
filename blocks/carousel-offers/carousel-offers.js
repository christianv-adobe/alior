import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * carousel-offers — horizontally scrollable offer-card carousel.
 * Source layout per card (Alior "Zobacz również"):
 *   [optional tag pill] + title link on top, square product image below,
 *   arrow controls (prev/next) left-aligned beneath the track.
 */
function scrollByCards(block, dir) {
  const track = block.querySelector('.carousel-offers-track');
  const card = track.querySelector('.carousel-offers-card');
  const step = card ? card.offsetWidth + 24 : track.clientWidth;
  track.scrollBy({ left: dir * step, behavior: 'smooth' });
}

function updateArrows(block) {
  const track = block.querySelector('.carousel-offers-track');
  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');
  if (!track || !prev || !next) return;
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= maxScroll;
}

export default function decorate(block) {
  const rows = [...block.children];

  const track = document.createElement('ul');
  track.className = 'carousel-offers-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture'));
    const bodyCell = cells.find((c) => c !== imageCell);

    const card = document.createElement('li');
    card.className = 'carousel-offers-card';

    // --- Body: tag pill (optional) + title link ---
    const body = document.createElement('div');
    body.className = 'carousel-offers-card-body';
    if (bodyCell) {
      const para = bodyCell.querySelector('p') || bodyCell;
      const link = para.querySelector('a');
      // Leading text before the link becomes the tag pill.
      let tagText = '';
      para.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) tagText += node.textContent;
      });
      tagText = tagText.trim();
      if (tagText) {
        const tag = document.createElement('span');
        tag.className = 'carousel-offers-tag';
        tag.textContent = tagText;
        body.append(tag);
      }
      if (link) {
        // Strip stray markdown heading markers left in the content.
        link.textContent = link.textContent.replace(/^#+\s*/, '').trim();
        link.classList.add('carousel-offers-title');
        body.append(link);
      }
    }

    // --- Image ---
    const image = document.createElement('div');
    image.className = 'carousel-offers-card-image';
    const picture = imageCell && imageCell.querySelector('picture');
    if (picture) image.append(picture);

    // Source order: title/tag on top, image below.
    card.append(body, image);
    track.append(card);
  });

  track.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    img.closest('picture').replaceWith(optimized);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-offers-navigation-buttons';
  nav.innerHTML = `
    <button type="button" class="slide-prev" aria-label="Poprzednie"></button>
    <button type="button" class="slide-next" aria-label="Następne"></button>
  `;
  nav.querySelector('.slide-prev').addEventListener('click', () => scrollByCards(block, -1));
  nav.querySelector('.slide-next').addEventListener('click', () => scrollByCards(block, 1));

  block.textContent = '';
  block.append(track, nav);

  track.addEventListener('scroll', () => updateArrows(block), { passive: true });
  window.addEventListener('resize', () => updateArrows(block));
  updateArrows(block);

  // Re-check once images finish loading (scrollWidth grows as they render).
  track.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', () => updateArrows(block), { once: true });
  });
  requestAnimationFrame(() => updateArrows(block));
}
