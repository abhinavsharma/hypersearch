import { GET_TAB_DOMAINS_MESSAGE, SET_TAB_DOMAINS_MESSAGE } from 'utils/constants';

((document, window) => {
  let tab = '';

  document.addEventListener('DOMContentLoaded', () => {
    const domainsContainer = document.querySelector('#message.results--message');
    domainsContainer?.setAttribute('style', 'display: none;');
  });

  window.addEventListener('message', (e) => {
    if (e.data.type === GET_TAB_DOMAINS_MESSAGE) {
      tab = e.data.tab;
      if (document.readyState === 'complete' || 'interactive') {
        const domains = Array.from(document.querySelectorAll(e.data.selector)).map((i) =>
          window.location.href.search(/bing\.com/g) === -1 ? i : i.textContent,
        );
        window.top.postMessage(
          {
            tab,
            type: SET_TAB_DOMAINS_MESSAGE,
            domains: domains.map((i) =>
              window.location.href.search(/bing\.com/g) === -1 ? i.getAttribute('href') : i,
            ),
          },
          '*',
        );
      }
    }
  });

  // not exactly ad blocking but removing known bad components
  const toRemove = {
    'google.com': ['header.Fh5muf'],
    'bing.com': ['header#b_header'],
    'duckduckgo.com': ['div#header_wrapper', '.search-filters-wrap'],
  };

  // Remove Accelerated Modile Page references and make them open in a new browser tab.
  // This script will be injected in the parent document as well as the sidebar.
  const _cleanupAmp = () => {
    document.querySelectorAll('a.amp_r').forEach((a: HTMLLinkElement) => {
      a.href = a.getAttribute('href');
      if (a.href.indexOf('?') === -1) a.href = a.href + '?';
      a.removeAttribute('data-amp');
      a.removeAttribute('data-amp-cur');
      a.removeAttribute('data-amp-title');
      a.removeAttribute('data-amp-vgi');
      a.removeAttribute('oncontextmenu');
      a.removeAttribute('jsaction');
      a.removeAttribute('data-ved');
      a.removeAttribute('ping');
    });

    document.querySelectorAll('span[aria-label="AMP logo"]').forEach((a: HTMLLinkElement) => {
      a.style.display = 'none';
    });
  };

  const waitUntilElementExists = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    setTimeout(() => waitUntilElementExists(selector, callback), 100);
  };

  const removeElement = (el) => el.parentNode.removeChild(el);

  if (window.location !== window.parent.location) {
    window.setInterval(() => {
      document.querySelectorAll('a').forEach((linkElement) => {
        linkElement.setAttribute('target', '_blank');
      });
      _cleanupAmp();

      document.getElementsByTagName('html')[0]?.classList.remove('is-not-mobile-device');
    }, 100);

    let hostname = new URL(window.location.href).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }
    if (hostname in toRemove) {
      for (const element of toRemove[hostname]) {
        waitUntilElementExists(element, (el) => removeElement(el));
      }
    }

    document.addEventListener('DOMNodeInserted', _cleanupAmp);
    _cleanupAmp();

    document.getElementsByTagName('html')[0]?.classList.remove('is-not-mobile-device');
  }
})(document, window);
