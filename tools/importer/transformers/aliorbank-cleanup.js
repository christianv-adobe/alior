/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alior Bank site-wide cleanup.
 * Removes non-authorable site chrome (header, footer, nav, search, cookie/alert
 * banners, login/apply popup overlays) and leftover non-authorable elements.
 * Every selector below was verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Login / apply popup overlays that live INSIDE <main> (calculator section).
    // Non-authorable UI widgets. Verified: <div class="modal-overlay" id="pmt-modal">,
    // <div class="drawer-overlay" id="pmt-drawer"> inside <main id="main">.
    WebImporter.DOMUtils.remove(element, [
      '#pmt-modal',
      '#pmt-drawer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Verified in cleaned.html:
    //  <ul class="skip-link-wrapper">, <div class="revamp-nav">,
    //  <div class="alert-message ..."> (upper-top / popup-top / popup-bottom),
    //  <header class="desktop-header">, <header class="mobile-header">,
    //  <nav class="main-nav">, <nav class="mobile-bottom-nav">,
    //  <footer id="footer" class="footer footer--burgund">,
    //  search panels/drawers/suggestions (ens-* / *SearchPanel / searchDrawer),
    //  login modal overlay (#loginModal).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '#footer',
      'nav.main-nav',
      'nav.mobile-bottom-nav',
      '.revamp-nav',
      '.skip-link-wrapper',
      '.alert-message',
      '#loginModal',
      '#desktopSearchPanel',
      '#searchDrawer',
      '.ens-search-suggestions',
      '.ens-mobile-search-suggestions',
      'link',
      'noscript',
      'iframe',
    ]);
  }
}
