// makes all iframe links open outside the iframe, used for the sidebar
if (window.location !== window.parent.location) {
  window.setInterval(() => {
    document.querySelectorAll('a').forEach((linkElement) => {
      linkElement.setAttribute('target', '_blank');
    });
  }, 1000);
}
