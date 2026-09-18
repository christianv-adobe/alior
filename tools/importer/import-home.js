/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsArticlesParser from './parsers/cards-articles.js';
import cardsBentoParser from './parsers/cards-bento.js';
import cardsHighlightParser from './parsers/cards-highlight.js';
import carouselOffersParser from './parsers/carousel-offers.js';
import carouselOverlayParser from './parsers/carousel-overlay.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroSliderParser from './parsers/hero-slider.js';
import widgetCalculatorParser from './parsers/widget-calculator.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/aliorbank-cleanup.js';
import sectionsTransformer from './transformers/aliorbank-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-articles': cardsArticlesParser,
  'cards-bento': cardsBentoParser,
  'cards-highlight': cardsHighlightParser,
  'carousel-offers': carouselOffersParser,
  'carousel-overlay': carouselOverlayParser,
  'columns-feature': columnsFeatureParser,
  'hero-slider': heroSliderParser,
  'widget-calculator': widgetCalculatorParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Alior Bank homepage: tabbed hero, highlight boxes, bento grid, image-overlay carousel, offers carousel, loan calculator, two-column feature and article cards.',
  urls: [
    'https://www.aliorbank.pl/',
  ],
  blocks: [
    { name: 'hero-slider', instances: ['.hero-main-slider'] },
    { name: 'cards-highlight', instances: ['.highlight-boxes'] },
    { name: 'cards-bento', instances: ['.bento-boxes__wrapper', '.bento-boxes__slider'] },
    { name: 'carousel-overlay', instances: ['#alior-mobile', '.image-overlay-section'] },
    { name: 'carousel-offers', instances: ['.benefits-section-2 .swiper', '.benefits-section-2'] },
    { name: 'widget-calculator', instances: ['.calculator-pmt'] },
    { name: 'columns-feature', instances: ['.header-photo-big'] },
    { name: 'cards-articles', instances: ['.articles-widget'] },
  ],
  sections: [
    { id: 'section-hero', name: 'Hero slider', selector: ['.hero-main-slider', '#main > section.hero-main-slider'], style: null, blocks: ['hero-slider'], defaultContent: [] },
    { id: 'section-highlight', name: 'Highlight boxes', selector: ['.highlight-boxes', '#main > section.highlight-boxes'], style: null, blocks: ['cards-highlight'], defaultContent: [] },
    { id: 'section-bento', name: 'Bento boxes', selector: ['.bento-boxes', '#main > section.bento-boxes'], style: null, blocks: ['cards-bento'], defaultContent: ['.bento-boxes__header'] },
    { id: 'section-mobile', name: 'Alior mobile overlay carousel', selector: ['#alior-mobile', '.image-overlay-section'], style: null, blocks: ['carousel-overlay'], defaultContent: [] },
    { id: 'section-benefits', name: 'Offers carousel', selector: ['.benefits-section-2', '#main > section.benefits-section-2'], style: null, blocks: ['carousel-offers'], defaultContent: ['.benefits-section-2 h2', '.benefits-section-2 h3'] },
    { id: 'section-calculator', name: 'Loan calculator', selector: ['.calculator-pmt', '#main > section.calculator-pmt'], style: 'grey', blocks: ['widget-calculator'], defaultContent: [] },
    { id: 'section-feature', name: 'Two-column feature', selector: ['.header-photo-big', '#main > section.header-photo-big'], style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'section-articles', name: 'Article cards', selector: ['.articles-widget', '#main > section.articles-widget'], style: 'grey', blocks: ['cards-articles'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, section transformer after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        // A block may list several fallback selectors; only take the first
        // element that resolves for each block, and never the same node twice.
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip nodes already replaced by an earlier parser.
    const parsedNames = [];
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
          parsedNames.push(block.name);
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Map the homepage ('/') to '/index' so the
    //    empty path doesn't crash the bundled importer's path polyfill.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: parsedNames,
      },
    }];
  },
};
