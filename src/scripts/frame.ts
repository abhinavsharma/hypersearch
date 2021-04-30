import { extractUrlProperties } from 'utils/helpers';
import './results';

const CLEAN_ELEMENTS_FROM: Record<string, string[]> = {
  'google.com': ['a.amp_r', '.jGGQ5e', '.U3THc', '.QzoJOb', '[jsname]', '[data-ved]'],
  'duckduckgo.com': ['.result', '.result__body', '.result__snippet'],
};

const REMOVE_ADS = {
  'google.com': ['[aria-label=Ads]'],
  'bing.com': ['.b_ad'],
  'duckduckgo.com': ['#ads', '.results--ads'],
};

const REMOVE_ELEMENTS_FROM: Record<string, string[]> = {
  'google.com': [
    '#appbar.appbar',
    '.I7zR5',
    'header.Fh5muf',
    '.mnr-c.cUnQKe',
    '.mnr-c.AuVD',
    '[data-has-queries]',
    '.commercial-unit-mobile-top',
  ],
  'bing.com': ['header#b_header'],
};

const HIDE_ELEMENTS_FROM: Record<string, string[]> = {
  'google.com': ['span[aria-label="AMP logo"]'],
  'duckduckgo.com': ['div#header_wrapper', '.search-filters-wrap'],
};

type ALLOWED_ELEMENT = HTMLDivElement & HTMLLinkElement;

((document, window) => {
  const LOCAL_HOSTNAME = extractUrlProperties(window.location.href)?.hostname;
  const APP_FRAME = window.location !== window.parent.location;

  const clearElement = (el: ALLOWED_ELEMENT) => {
    el.onclick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    if (el?.href) {
      el.href = el.getAttribute('href');
      if (el.href.indexOf('?') === -1) el.href = el.href + '?';
    }
    el.removeAttribute('jscontroller');
    el.removeAttribute('jsaction');
    el.removeAttribute('jsdata');
    el.removeAttribute('jsname');
    el.removeAttribute('data-amp');
    el.removeAttribute('data-domain');
    el.removeAttribute('data-hostname');
    el.removeAttribute('data-nir');
    el.removeAttribute('data-amp-cur');
    el.removeAttribute('data-amp-title');
    el.removeAttribute('data-amp-vgi');
    el.removeAttribute('oncontextmenu');
    el.removeAttribute('data-amp-cdn');
    el.removeAttribute('data-amp-sxg');
    el.removeAttribute('data-ved');
    el.removeAttribute('data-atf');
    el.removeAttribute('ping');
  };

  const hideElement = (el: ALLOWED_ELEMENT) => {
    el.style.display = 'none';
    el.style.visibility = 'hidden';
  };

  const removeElement = (el: ALLOWED_ELEMENT) => {
    clearElement(el);
    el.parentNode.removeChild(el);
  };

  const getElements = (selector: string) =>
    (document.querySelectorAll(selector) ?? []) as NodeListOf<ALLOWED_ELEMENT>;

  const cleanupFrame = () => {
    getElements('html')?.[0].classList.remove('is-not-mobile-device');
    getElements('#message.results--message')?.[0]?.setAttribute('style', 'display: none;');
    CLEAN_ELEMENTS_FROM[LOCAL_HOSTNAME]?.forEach((selector) =>
      getElements(selector).forEach((el) => clearElement(el)),
    );
    HIDE_ELEMENTS_FROM[LOCAL_HOSTNAME]?.forEach((selector) =>
      getElements(selector).forEach((el) => hideElement(el)),
    );
    REMOVE_ELEMENTS_FROM[LOCAL_HOSTNAME]?.forEach((selector) =>
      getElements(selector).forEach((el) => removeElement(el)),
    );
    if (window.location !== window.parent.location) {
      REMOVE_ADS[LOCAL_HOSTNAME]?.forEach((selector) =>
        getElements(selector).forEach((el) => removeElement(el)),
      );
    }
    getElements('a').forEach((el) => {
      clearElement(el);
      const href = el.getAttribute('href');
      if (href?.search(/amp(\.|-)reddit(\.|-)com/gi) > -1) {
        const redditLink = href.match(/reddit\.com[\w\/?=%_-]*/gi)[0];
        el.setAttribute('href', `https://www.${redditLink}`);
      }
      if (el.innerHTML?.search('amp.reddit') > -1 || href?.search('amp.reddit') > -1) {
        el.innerHTML = el.innerHTML.replace('amp.reddit', 'www.reddit');
        el.setAttribute('href', el.getAttribute('href').replace('amp.reddit', 'www.reddit'));
        el.setAttribute('rel', 'noopener noreferrer');
      }
      el.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(el.getAttribute('href'));
      };
      const target = el.getAttribute('target');
      if (target !== '_blank') el.setAttribute('target', '_blank');
    });
  };

  if (window.location.href.search(/duckduckgo\.com/g) > -1 && !APP_FRAME) {
    setInterval(() => {
      CLEAN_ELEMENTS_FROM[LOCAL_HOSTNAME]?.forEach((selector) =>
        getElements(selector).forEach((el) => clearElement(el)),
      );
      getElements('a').forEach((el) => {
        el.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(el.getAttribute('href'));
        };
        const target = el.getAttribute('target');
        if (target !== '_blank') el.setAttribute('target', '_blank');
      });
    }, 200);
  }

  if (APP_FRAME) {
    setInterval(() => cleanupFrame(), 200);
  }
})(document, window);
