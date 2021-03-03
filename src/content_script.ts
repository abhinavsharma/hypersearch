import { debug } from 'lumos-shared-js';
import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';

((document: Document, location: Location) => {
  debug('execute content script - location', location.href);
  const url = new URL(location.href);
  SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);
