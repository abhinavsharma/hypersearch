import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import { debug } from 'utils';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);
