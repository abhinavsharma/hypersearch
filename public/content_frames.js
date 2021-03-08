// not exactly ad blocking but removing known bad components
let toRemove = {
  'google.com': ['header.Fh5muf'],
  'bing.com': ['header#b_header'],
  'duckduckgo.com': ['div#header_wrapper', '.search-filters-wrap'],
}

const waitUntilElementExists = (selector, callback) => {
  const el = document.querySelector(selector);
  if (el){
      return callback(el);
  }
  setTimeout(() => waitUntilElementExists(selector, callback), 100);
}

const removeElement = (el) => {
  el.parentNode.removeChild(el)
}

const clickElement = (el) => {
  el.click()
}

// main logic to run in iframes
if (window.location !== window.parent.location) {
  window.setInterval(() => {
    document.querySelectorAll('a').forEach((linkElement) => {
      linkElement.setAttribute('target', '_blank');
    });
  }, 100);

  let hostname = new URL(window.location.href).hostname;
  if (hostname.startsWith('www.')) {
    hostname = hostname.slice(4)
  }
  if (hostname in toRemove) {
    for(const element of toRemove[hostname]) {
      waitUntilElementExists(element, (el) => removeElement(el));
    }
  }
}