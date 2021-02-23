import { debug } from 'lumos-shared-js';
import { loadOrUpdateSidebar } from 'lib/loadOrUpdateSidebar/loadOrUpdateSidebar';

debug('executing content script on', location.href);

((document: Document, location: Location) => {
  const url = new URL(location.href);
  loadOrUpdateSidebar(document, url);
})(document, location);
