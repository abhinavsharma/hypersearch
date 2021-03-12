import { debug } from 'lumos-shared-js';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

(async (document: Document, location: Location) => {
  debug('execute content script\n---\n\tCurrent Location', location.href, '\n---');
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);
