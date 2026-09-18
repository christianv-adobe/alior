/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget-calculator. Base: widget.
 * Source: https://www.aliorbank.pl/ (.calculator-pmt)
 *
 * The block's decorate (blocks/widget-calculator/widget-calculator.js) reads
 * `key | value` config rows and renders two sliders + a live result panel.
 * We extract the calculator's configuration from the source markup and emit
 * those config rows. Every content row has 2 cells (key, value).
 */
export default function parse(element, { document }) {
  const cells = [];

  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  // Pull the leading number out of a label like "250000 zł" / "3 mies.".
  const numOf = (s) => {
    const m = String(s).replace(/ /g, ' ').match(/-?[\d\s.,]+/);
    return m ? m[0].replace(/\s/g, '').replace(',', '.').replace(/\.(?=\d{3}\b)/g, '') : '';
  };

  const addRow = (key, value) => {
    if (value === '' || value == null) return;
    const k = document.createElement('p');
    k.textContent = key;
    const v = document.createElement('p');
    v.textContent = value;
    cells.push([[k], [v]]);
  };

  // Title.
  addRow('title', text(element.querySelector('.calculator-pmt-title')));

  // Amount slider (first control group).
  const amountGroup = element.querySelector('.control-group.depositAmount, .depositAmount');
  if (amountGroup) {
    addRow('amount-label', text(amountGroup.querySelector('label')));
    addRow('amount-min', numOf(text(amountGroup.querySelector('.nouislider-min'))));
    addRow('amount-max', numOf(text(amountGroup.querySelector('.nouislider-max'))));
    const currency = text(amountGroup.querySelector('.right-slot'));
    if (currency) addRow('currency', currency);
  }

  // Term slider (second control group).
  const termGroup = element.querySelector('.control-group.duration, .duration');
  if (termGroup) {
    addRow('term-label', text(termGroup.querySelector('label')));
    addRow('term-min', numOf(text(termGroup.querySelector('.nouislider-min'))));
    addRow('term-max', numOf(text(termGroup.querySelector('.nouislider-max'))));
    const unit = text(termGroup.querySelector('.right-slot'));
    if (unit) addRow('term-unit', unit);
  }

  // Result panel.
  const results = element.querySelector('.results-container');
  if (results) {
    addRow('result-label', text(results.querySelector('.results-title')));
    const rrso = numOf(text(results.querySelector('.interest-rate')));
    if (rrso) addRow('rrso', rrso);
    // Interest rate drives the installment; source only exposes RRSO, reuse it.
    if (rrso) addRow('rate', rrso);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'widget-calculator', cells });
  element.replaceWith(block);
}
