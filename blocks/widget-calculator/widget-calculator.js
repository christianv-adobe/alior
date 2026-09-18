/**
 * widget-calculator — interactive loan-installment calculator.
 *
 * Authoring model: each row is a `key | value` config pair. Recognised keys
 * (case-insensitive, diacritics-insensitive) drive the calculator; unknown
 * keys are ignored. All are optional and fall back to sensible defaults.
 *   - title            heading shown above the calculator
 *   - amount-label     label for the amount slider
 *   - amount-min / amount-max / amount-default / amount-step
 *   - term-label       label for the term slider
 *   - term-min / term-max / term-default / term-step
 *   - term-unit        unit shown next to the term value (e.g. "mies.")
 *   - rate             nominal annual interest rate as a percent (e.g. 9.15)
 *   - rrso             APR / RRSO percent shown in the result panel
 *   - result-label     label above the computed installment
 *   - currency         currency suffix (e.g. "zł")
 * CTA links authored anywhere in the block are collected into the result panel.
 */

const norm = (s) => (s || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .trim();

function readConfig(block) {
  const config = {};
  const ctas = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const anchors = row.querySelectorAll('a[href]');
    if (anchors.length && cells.length < 2) {
      anchors.forEach((a) => ctas.push(a));
      return;
    }
    if (cells.length >= 2) {
      const key = norm(cells[0].textContent);
      const value = cells[1].textContent.trim();
      if (key) config[key] = value;
      cells[1].querySelectorAll('a[href]').forEach((a) => ctas.push(a));
    }
  });
  return { config, ctas };
}

const num = (v, fallback) => {
  const n = parseFloat(String(v).replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
};

function formatMoney(value, currency) {
  const formatted = value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${formatted} ${currency}` : formatted;
}

/* Standard annuity installment formula. */
function installment(principal, annualRatePct, months) {
  const r = (annualRatePct / 100) / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - (1 + r) ** -months);
}

export default function decorate(block) {
  const { config, ctas } = readConfig(block);

  const amountMin = num(config['amount-min'], 500);
  const amountMax = num(config['amount-max'], 250000);
  const amountDefault = num(config['amount-default'], 6000);
  const amountStep = num(config['amount-step'], 100);
  const termMin = num(config['term-min'], 3);
  const termMax = num(config['term-max'], 120);
  const termDefault = num(config['term-default'], 16);
  const termStep = num(config['term-step'], 1);
  const rate = num(config.rate, 9.15);
  const rrso = config.rrso || '9.15';
  const currency = config.currency || 'zł';
  const termUnit = config['term-unit'] || 'mies.';

  block.textContent = '';

  const controls = document.createElement('div');
  controls.className = 'widget-calculator-controls';

  // Each field: label on its own line, then a full-width bordered box holding the
  // current value (left) and its unit (right), then the range slider, then the
  // min/max bounds — mirroring the source .field-wrapper / .input-wrapper.
  const makeSlider = (id, label, min, max, value, step, unit) => {
    const field = document.createElement('div');
    field.className = 'widget-calculator-field';
    field.innerHTML = `
      <label class="widget-calculator-field-label" for="${id}">${label}</label>
      <div class="widget-calculator-inputbox">
        <output class="widget-calculator-value" id="${id}-out" for="${id}"></output>
        <span class="widget-calculator-unit">${unit}</span>
      </div>
      <input type="range" id="${id}" min="${min}" max="${max}" value="${value}" step="${step}">
      <div class="widget-calculator-range-bounds">
        <span>${min} ${unit}</span>
        <span>${max} ${unit}</span>
      </div>`;
    return field;
  };

  if (config.title) {
    const h = document.createElement('h2');
    h.className = 'widget-calculator-title';
    h.textContent = config.title;
    block.append(h);
  }

  const amountField = makeSlider('wc-amount', config['amount-label'] || 'Ile chcesz pożyczyć?', amountMin, amountMax, amountDefault, amountStep, currency);
  const termField = makeSlider('wc-term', config['term-label'] || 'Na ile chcesz?', termMin, termMax, termDefault, termStep, termUnit);
  controls.append(amountField, termField);

  const result = document.createElement('div');
  result.className = 'widget-calculator-result';

  // Optional small tertiary toggle at the top of the card (source "+ sprawdź koszt").
  const costNote = config['cost-note'];
  const rrsoDisplay = String(rrso).replace('.', ',');
  result.innerHTML = `
    ${costNote ? `<button type="button" class="widget-calculator-costnote" aria-expanded="false">${costNote}</button>` : ''}
    <p class="widget-calculator-result-label">${config['result-label'] || 'Szacunkowa rata'}</p>
    <p class="widget-calculator-installment" id="wc-installment"></p>
    <ul class="widget-calculator-meta">
      <li>RRSO: ${rrsoDisplay}%</li>
      <li>0% prowizji</li>
    </ul>
    ${config.disclaimer ? `<p class="widget-calculator-disclaimer">${config.disclaimer}</p>` : ''}`;

  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'widget-calculator-actions';
    ctas.forEach((a) => {
      a.classList.add('button');
      actions.append(a);
    });
    result.append(actions);
  }

  block.append(controls, result);

  const amountInput = block.querySelector('#wc-amount');
  const termInput = block.querySelector('#wc-term');
  const amountOut = block.querySelector('#wc-amount-out');
  const termOut = block.querySelector('#wc-term-out');
  const installmentOut = block.querySelector('#wc-installment');

  /* Paint the filled portion of the track (magenta up to the thumb).
     WebKit has no ::-moz-range-progress equivalent, so we set a
     linear-gradient background reflecting the current value. */
  const TRACK_FILL = 'var(--link-color, #79003c)';
  const TRACK_BG = 'rgb(222 222 227)';
  const paintTrack = (input) => {
    const min = num(input.min, 0);
    const max = num(input.max, 100);
    const val = num(input.value, min);
    const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    input.style.background = `linear-gradient(to right, ${TRACK_FILL} 0%, ${TRACK_FILL} ${pct}%, ${TRACK_BG} ${pct}%, ${TRACK_BG} 100%)`;
  };

  const update = () => {
    const amount = num(amountInput.value, amountDefault);
    const term = num(termInput.value, termDefault);
    // Value box shows only the number; the unit lives in the adjacent span.
    amountOut.textContent = amount.toLocaleString('pl-PL');
    termOut.textContent = String(term);
    installmentOut.textContent = formatMoney(installment(amount, rate, term), currency);
    paintTrack(amountInput);
    paintTrack(termInput);
  };

  amountInput.addEventListener('input', update);
  termInput.addEventListener('input', update);
  update();
}
