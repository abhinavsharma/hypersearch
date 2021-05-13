import { TRIGGER_FRAME_SCROLL_LOG_MESSAGE, HIDE_FRAME_OVERLAY_MESSAGE } from 'utils/constants';
import { extractUrlProperties } from 'utils/helpers';
import { getLCP, ReportHandler } from 'web-vitals';
import './results';

const CLEAN_ELEMENTS_FROM: Record<string, string[]> = {
  google: ['a.amp_r', '.jGGQ5e', '.U3THc', '.QzoJOb', '[jsname]', '[data-ved]'],
  duckduckgo: ['.result', '.result__body', '.result__snippet'],
};

const REMOVE_ADS: Record<string, string[]> = {
  google: ['[aria-label=Ads]'],
  'bing.com': ['.b_ad'],
  'duckduckgo.com': ['#ads', '.results--ads'],
};

const REMOVE_ELEMENTS_FROM: Record<string, string[]> = {
  google: [
    '#appbar.appbar',
    '.I7zR5',
    'header.Fh5muf',
    '.mnr-c.cUnQKe',
    '.mnr-c.AuVD',
    '[data-has-queries]',
    '.commercial-unit-mobile-top',
  ],
  bing: ['header#b_header'],
  ecosia: ['.search-header', '.navbar-row'],
};

const HIDE_ELEMENTS_FROM: Record<string, string[]> = {
  google: ['span[aria-label="AMP logo"]'],
  duckduckgo: ['div#header_wrapper', '.search-filters-wrap'],
};

type ALLOWED_ELEMENT = HTMLDivElement & HTMLLinkElement;

((document, window) => {
  const LOCAL_HOSTNAME = extractUrlProperties(window.location.href)?.hostname.replace(
    /\.[\w.]*$/,
    '',
  );
  const APP_FRAME = window.location !== window.parent.location;

  const handleLCP: ReportHandler = () => {
    chrome.runtime.sendMessage({
      type: HIDE_FRAME_OVERLAY_MESSAGE,
    });
  };

  getLCP(handleLCP, true);

  const clearElement = (el: ALLOWED_ELEMENT) => {
    el.onclick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    if (el?.href) {
      el.href = el.getAttribute('href') ?? '';
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
    el.parentNode?.removeChild(el);
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
      if ((href?.search(/amp(\.|-)reddit(\.|-)com/gi) ?? -1) > -1) {
        const redditLink = href?.match(/reddit\.com[\w/?=%_-]*/gi)?.[0];
        el.setAttribute('href', `https://www.${redditLink}`);
      }
      if (el.innerHTML?.search('amp.reddit') > -1 || (href?.search('amp.reddit') ?? -1) > -1) {
        el.innerHTML = el.innerHTML.replace('amp.reddit', 'www.reddit');
        el.setAttribute('href', el.getAttribute('href')?.replace('amp.reddit', 'www.reddit') ?? '');
        el.setAttribute('rel', 'noopener noreferrer');
      }
      el.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const href = el.getAttribute('href');
        href && window.open(href);
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
          const href = el.getAttribute('href');
          href && window.open(href);
        };
        const target = el.getAttribute('target');
        if (target !== '_blank') el.setAttribute('target', '_blank');
      });
    }, 200);
  }

  if (APP_FRAME) {
    setInterval(() => cleanupFrame(), 200);
    document.addEventListener(
      'scroll',
      () => {
        chrome.runtime.sendMessage({
          type: TRIGGER_FRAME_SCROLL_LOG_MESSAGE,
          url: window.location.href,
        });
      },
      { once: true },
    );
  }
})(document, window);
