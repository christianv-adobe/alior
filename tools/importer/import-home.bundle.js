/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/cards-articles.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const columns = element.querySelectorAll(".articles-widget__column");
    const groups = columns.length ? [...columns] : [element];
    groups.forEach((column) => {
      const title = column.querySelector(".articles-widget__title, h2, h3");
      const seeAll = column.querySelector(".articles-widget__link, a.button.tertiary");
      if (title) {
        const headerCell = [title];
        const titleRow = title.closest(".articles-widget__title-row");
        if (seeAll && titleRow && titleRow.contains(seeAll)) headerCell.push(seeAll);
        cells.push([headerCell]);
      }
      const cards = column.querySelectorAll(".article-card");
      cards.forEach((card) => {
        const cardCell = [];
        const date = card.querySelector(".articles-date, .article-info span");
        const cardTitle = card.querySelector(".article-title, h3");
        const description = card.querySelector(".article-description");
        const readMore = card.querySelector(".article-card > a.button, a.button.tertiary:not(.article-title-link)");
        if (date) cardCell.push(date);
        if (cardTitle) cardCell.push(cardTitle);
        if (description) {
          const existingP = description.querySelector("p");
          if (existingP) {
            cardCell.push(existingP);
          } else {
            const p = document2.createElement("p");
            p.textContent = description.textContent.trim();
            cardCell.push(p);
          }
        }
        if (readMore) cardCell.push(readMore);
        if (cardCell.length) cells.push([cardCell]);
      });
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-bento.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const tiles = element.querySelectorAll(".bento-boxes__box");
    const list = tiles.length ? [...tiles] : [element];
    list.forEach((tile) => {
      const img = tile.querySelector(".bento-boxes__content img, .bento-boxes__content picture, img");
      const textCell = [];
      const badge = tile.querySelector(".bento-boxes__badge, .promotion-badge-text");
      if (badge) {
        const p = document2.createElement("p");
        p.textContent = badge.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) textCell.push(p);
      }
      const link = tile.querySelector("a.bento-boxes__link");
      const title = tile.querySelector(".bento-boxes__title, h2, h3");
      if (link && title && link.contains(title)) {
        textCell.push(link);
      } else if (title) {
        textCell.push(title);
      } else if (link) {
        textCell.push(link);
      }
      const description = tile.querySelector(".bento-boxes__description");
      if (description) textCell.push(description);
      if (!img && !textCell.length) return;
      if (img) {
        cells.push([img, textCell]);
      } else {
        cells.push(["", textCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-bento", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-highlight.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const boxes = element.querySelectorAll(".highlight-box");
    const list = boxes.length ? [...boxes] : [element];
    list.forEach((box) => {
      const cardCell = [];
      const link = box.querySelector("a.highlight-box-link");
      const title = box.querySelector(".highlight-box-title, h2, h3");
      if (link && title && link.contains(title)) {
        cardCell.push(link);
      } else if (title) {
        cardCell.push(title);
      } else if (link) {
        cardCell.push(link);
      }
      const text = box.querySelector(".highlight-box-text, p");
      if (text) cardCell.push(text);
      if (cardCell.length) cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-highlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-offers.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const slides = element.querySelectorAll("article.benefits-slide, .benefits-slide, .swiper-slide article");
    [...slides].forEach((slide) => {
      const bodyCell = [];
      const tag = slide.querySelector(".tag");
      if (tag) bodyCell.push(tag);
      const link = slide.querySelector("a.benefits-slide-link");
      const title = slide.querySelector(".slide-title, h2, h3, h4");
      if (link && title && link.contains(title)) {
        bodyCell.push(link);
      } else if (title) {
        bodyCell.push(title);
      } else if (link) {
        bodyCell.push(link);
      }
      const img = slide.querySelector(".benefits-image, .image-wrapper img, img");
      if (!img && !bodyCell.length) return;
      if (img) {
        cells.push([[img], bodyCell]);
      } else {
        cells.push(["", bodyCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-offers", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-overlay.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const normalizeImg = (img) => {
      if (!img) return img;
      const real = img.getAttribute("data-src") || img.getAttribute("data-lazy") || img.getAttribute("data-original");
      if (real) img.setAttribute("src", real);
      return img;
    };
    const slides = element.querySelectorAll("article.image-overlay-slide, .image-overlay-slide, .swiper-slide.image-overlay-slide");
    const imgFromBackground = (slide) => {
      const style = slide.getAttribute("style") || "";
      const m = style.match(/background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/i);
      if (!m || !m[2]) return null;
      const img = document2.createElement("img");
      img.setAttribute("src", m[2]);
      const heading = slide.querySelector("h1, h2, h3");
      img.setAttribute("alt", heading ? heading.textContent.trim() : "");
      return img;
    };
    [...slides].forEach((slide) => {
      const bgImage = normalizeImg(slide.querySelector(":scope > img, :scope > picture") || slide.querySelector("img:not(.tile-notification-image)")) || imgFromBackground(slide);
      const contentCell = [];
      const heading = slide.querySelector(".promotion-title, h1, h2, h3");
      if (heading) contentCell.push(heading);
      const description = slide.querySelector(".promotion-description");
      if (description) contentCell.push(description);
      const cta = slide.querySelector(".button-wrapper a, a.button");
      if (cta) contentCell.push(cta);
      const notification = slide.querySelector(".tile-notification");
      if (notification) {
        notification.querySelectorAll(".tile-notification-title, .tile-notification-text").forEach((p) => {
          contentCell.push(p);
        });
      }
      if (!bgImage && !contentCell.length) return;
      if (bgImage) {
        cells.push([[bgImage], contentCell]);
      } else {
        cells.push(["", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document: document2 }) {
    const textCell = [];
    const heading = element.querySelector(".text-wrapper .title, .title, h1, h2");
    if (heading) textCell.push(heading);
    const description = element.querySelector(".text-wrapper .description, .description, p");
    if (description) textCell.push(description);
    const cta = element.querySelector(".button-wrapper a, a.button");
    if (cta) textCell.push(cta);
    const img = element.querySelector(".image-wrapper img, .image-wrapper picture, img");
    if (!textCell.length && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, img ? [img] : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-slider.js
  function parse7(element, { document: document2 }) {
    const cells = [];
    const slides = element.querySelectorAll(".main-slide, .swiper-slide.main-slide");
    [...slides].forEach((slide) => {
      const activeTab = slide.querySelector(".tabs-container .tab-active, .tab.tab-active");
      const labelCell = [];
      if (activeTab) {
        const p = document2.createElement("p");
        p.textContent = activeTab.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) labelCell.push(p);
      }
      const contentCell = [];
      const heading = slide.querySelector(".content-inner .hero-title, .hero-title, h1, h2");
      if (heading) contentCell.push(heading);
      const description = slide.querySelector(".content-inner .description, .description");
      if (description) contentCell.push(description);
      const ctas = slide.querySelectorAll(".buttons-container a, .buttons-container a.button");
      ctas.forEach((a) => contentCell.push(a));
      const img = slide.querySelector(".image-column img, .image-column picture, img");
      if (!contentCell.length && !img && !labelCell.length) return;
      cells.push([
        labelCell.length ? labelCell : "",
        contentCell,
        img ? [img] : ""
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-slider", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/widget-calculator.js
  function parse8(element, { document: document2 }) {
    const cells = [];
    const text = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const numOf = (s) => {
      const m = String(s).replace(/ /g, " ").match(/-?[\d\s.,]+/);
      return m ? m[0].replace(/\s/g, "").replace(",", ".").replace(/\.(?=\d{3}\b)/g, "") : "";
    };
    const addRow = (key, value) => {
      if (value === "" || value == null) return;
      const k = document2.createElement("p");
      k.textContent = key;
      const v = document2.createElement("p");
      v.textContent = value;
      cells.push([[k], [v]]);
    };
    addRow("title", text(element.querySelector(".calculator-pmt-title")));
    const amountGroup = element.querySelector(".control-group.depositAmount, .depositAmount");
    if (amountGroup) {
      addRow("amount-label", text(amountGroup.querySelector("label")));
      addRow("amount-min", numOf(text(amountGroup.querySelector(".nouislider-min"))));
      addRow("amount-max", numOf(text(amountGroup.querySelector(".nouislider-max"))));
      const currency = text(amountGroup.querySelector(".right-slot"));
      if (currency) addRow("currency", currency);
    }
    const termGroup = element.querySelector(".control-group.duration, .duration");
    if (termGroup) {
      addRow("term-label", text(termGroup.querySelector("label")));
      addRow("term-min", numOf(text(termGroup.querySelector(".nouislider-min"))));
      addRow("term-max", numOf(text(termGroup.querySelector(".nouislider-max"))));
      const unit = text(termGroup.querySelector(".right-slot"));
      if (unit) addRow("term-unit", unit);
    }
    const results = element.querySelector(".results-container");
    if (results) {
      addRow("result-label", text(results.querySelector(".results-title")));
      const rrso = numOf(text(results.querySelector(".interest-rate")));
      if (rrso) addRow("rrso", rrso);
      if (rrso) addRow("rate", rrso);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "widget-calculator", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aliorbank-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#pmt-modal",
        "#pmt-drawer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "#footer",
        "nav.main-nav",
        "nav.mobile-bottom-nav",
        ".revamp-nav",
        ".skip-link-wrapper",
        ".alert-message",
        "#loginModal",
        "#desktopSearchPanel",
        "#searchDrawer",
        ".ens-search-suggestions",
        ".ens-mobile-search-suggestions",
        "link",
        "noscript",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/aliorbank-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "cards-articles": parse,
    "cards-bento": parse2,
    "cards-highlight": parse3,
    "carousel-offers": parse4,
    "carousel-overlay": parse5,
    "columns-feature": parse6,
    "hero-slider": parse7,
    "widget-calculator": parse8
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Alior Bank homepage: tabbed hero, highlight boxes, bento grid, image-overlay carousel, offers carousel, loan calculator, two-column feature and article cards.",
    urls: [
      "https://www.aliorbank.pl/"
    ],
    blocks: [
      { name: "hero-slider", instances: [".hero-main-slider"] },
      { name: "cards-highlight", instances: [".highlight-boxes"] },
      { name: "cards-bento", instances: [".bento-boxes__wrapper", ".bento-boxes__slider"] },
      { name: "carousel-overlay", instances: ["#alior-mobile", ".image-overlay-section"] },
      { name: "carousel-offers", instances: [".benefits-section-2 .swiper", ".benefits-section-2"] },
      { name: "widget-calculator", instances: [".calculator-pmt"] },
      { name: "columns-feature", instances: [".header-photo-big"] },
      { name: "cards-articles", instances: [".articles-widget"] }
    ],
    sections: [
      { id: "section-hero", name: "Hero slider", selector: [".hero-main-slider", "#main > section.hero-main-slider"], style: null, blocks: ["hero-slider"], defaultContent: [] },
      { id: "section-highlight", name: "Highlight boxes", selector: [".highlight-boxes", "#main > section.highlight-boxes"], style: null, blocks: ["cards-highlight"], defaultContent: [] },
      { id: "section-bento", name: "Bento boxes", selector: [".bento-boxes", "#main > section.bento-boxes"], style: null, blocks: ["cards-bento"], defaultContent: [".bento-boxes__header"] },
      { id: "section-mobile", name: "Alior mobile overlay carousel", selector: ["#alior-mobile", ".image-overlay-section"], style: null, blocks: ["carousel-overlay"], defaultContent: [] },
      { id: "section-benefits", name: "Offers carousel", selector: [".benefits-section-2", "#main > section.benefits-section-2"], style: null, blocks: ["carousel-offers"], defaultContent: [".benefits-section-2 h2", ".benefits-section-2 h3"] },
      { id: "section-calculator", name: "Loan calculator", selector: [".calculator-pmt", "#main > section.calculator-pmt"], style: "grey", blocks: ["widget-calculator"], defaultContent: [] },
      { id: "section-feature", name: "Two-column feature", selector: [".header-photo-big", "#main > section.header-photo-big"], style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "section-articles", name: "Article cards", selector: [".articles-widget", "#main > section.articles-widget"], style: "grey", blocks: ["cards-articles"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      const parsedNames = [];
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
            parsedNames.push(block.name);
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: parsedNames
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
