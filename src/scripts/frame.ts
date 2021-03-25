((document, window) => {
  // not exactly ad blocking but removing known bad components
  const toRemove = {
    'google.com': ['header.Fh5muf', '.mnr-c.cUnQKe', '.mnr-c.AuVD'],
    'bing.com': ['header#b_header'],
    'duckduckgo.com': ['div#header_wrapper', '.search-filters-wrap'],
  };

  const removeElement = (el) => {
    el.removeAttribute('jscontroller');
    el.removeAttribute('jsaction');
    el.removeAttribute('data-ved');
    el.parentNode.removeChild(el);
  };

  // Remove Accelerated Modile Page references and make them open in a new browser tab.
  // This script will be injected in the parent document as well as the sidebar.
  const cleanUp = () => {
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

    let hostname = new URL(window.location.href).hostname;

    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    if (hostname in toRemove) {
      for (const selector of toRemove[hostname]) {
        document.querySelectorAll(selector).forEach((a: HTMLElement) => removeElement(a));
      }
    }
  };

  if (window.location !== window.parent.location) {
    window.setInterval(() => {
      document.querySelectorAll('a').forEach((linkElement) => {
        const target = linkElement.getAttribute('target');
        if (target !== '_blank') linkElement.setAttribute('target', '_blank');
        if (
          linkElement.innerHTML?.search('amp.reddit') > -1 ||
          linkElement.getAttribute('href')?.search('amp.reddit') > -1
        ) {
          linkElement.innerHTML = linkElement.innerHTML.replace('amp.reddit', 'www.reddit');
          linkElement.setAttribute(
            'href',
            linkElement.getAttribute('href')?.replace('amp.reddit', 'www.reddit'),
          );
          linkElement.setAttribute('target', '_blank');
          linkElement.removeAttribute('data-amp-cdn');
          linkElement.removeAttribute('data-amp-sxg');
          linkElement.removeAttribute('data-ved');
          linkElement.removeAttribute('rel');
        }
      });
      cleanUp();
      document.getElementsByTagName('html')[0]?.classList.remove('is-not-mobile-device');
    }, 500);

    document.addEventListener('DOMNodeInserted', cleanUp);
    document.addEventListener('DOMContentLoaded', cleanUp);
    cleanUp();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const domainsContainer = document.querySelector('#message.results--message');
    domainsContainer?.setAttribute('style', 'display: none;');
  });
})(document, window);
