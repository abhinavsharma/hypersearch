import { debug, fetchInformationForModifiedPage } from 'lumos-shared-js';
import { reloadSidebar } from './sidebar';
import { nativeBrowserPostMessageToReactApp } from './messenger_content';

debug('executing content script on', location.href);

((document: Document, location: Location) => {
  try {
    const url = new URL(location.href);
    debug('function call - handleUrlUpdated:', url);
    fetchInformationForModifiedPage(url, nativeBrowserPostMessageToReactApp);
    reloadSidebar(document, url);
  } catch (e) {
    console.log(e);
  }
})(document, location);
