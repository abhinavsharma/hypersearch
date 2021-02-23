export default `
    (function() {
      function _cleanupAmp()
      {
        document.querySelectorAll('a.amp_r').forEach(function(a) {
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

        document.querySelectorAll('span[aria-label=\"AMP logo\"]').forEach(function(a) {
          a.style.display='none';
        });
      }

      document.addEventListener('DOMNodeInserted', _cleanupAmp);
      _cleanupAmp();
    })();
  `;
