/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-overlay. Base: carousel.
 * Source: https://www.aliorbank.pl/ (#alior-mobile / .image-overlay-section)
 * Full-bleed image-overlay carousel. Convention: 2 columns, one row per slide.
 * Cell 1 = background image (only). Cell 2 = overlaid content (heading,
 * paragraph, CTA, plus any secondary tile-notification text).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Promote lazy-loaded src so background images resolve instead of a
  // placeholder data-URI (which the markdown converter drops).
  const normalizeImg = (img) => {
    if (!img) return img;
    const real = img.getAttribute('data-src')
      || img.getAttribute('data-lazy')
      || img.getAttribute('data-original');
    if (real) img.setAttribute('src', real);
    return img;
  };

  const slides = element.querySelectorAll('article.image-overlay-slide, .image-overlay-slide, .swiper-slide.image-overlay-slide');

  // Build an <img> from a slide's CSS background-image (the live carousel sets
  // the slide photo via inline `style="background-image:url(...)"`, not an <img>).
  const imgFromBackground = (slide) => {
    const style = slide.getAttribute('style') || '';
    const m = style.match(/background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/i);
    if (!m || !m[2]) return null;
    const img = document.createElement('img');
    img.setAttribute('src', m[2]);
    const heading = slide.querySelector('h1, h2, h3');
    img.setAttribute('alt', heading ? heading.textContent.trim() : '');
    return img;
  };

  [...slides].forEach((slide) => {
    // Background image priority: direct-child <img> (scraped snapshot), else the
    // first non-notification <img>, else the inline CSS background-image (live).
    const bgImage = normalizeImg(slide.querySelector(':scope > img, :scope > picture')
      || slide.querySelector('img:not(.tile-notification-image)'))
      || imgFromBackground(slide);

    // Overlaid content.
    const contentCell = [];
    const heading = slide.querySelector('.promotion-title, h1, h2, h3');
    if (heading) contentCell.push(heading);

    const description = slide.querySelector('.promotion-description');
    if (description) contentCell.push(description);

    const cta = slide.querySelector('.button-wrapper a, a.button');
    if (cta) contentCell.push(cta);

    // Secondary notification card (present on some slides).
    const notification = slide.querySelector('.tile-notification');
    if (notification) {
      notification.querySelectorAll('.tile-notification-title, .tile-notification-text').forEach((p) => {
        contentCell.push(p);
      });
    }

    if (!bgImage && !contentCell.length) return;

    if (bgImage) {
      cells.push([[bgImage], contentCell]);
    } else {
      cells.push(['', contentCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-overlay', cells });
  element.replaceWith(block);
}
