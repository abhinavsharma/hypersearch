import { debug, fetchInformationForModifiedPage } from 'lumos-shared-js';
import { loadOrUpdateSidebar } from 'lib/loadOrUpdateSidebar/loadOrUpdateSidebar';
import { nativeBrowserPostMessageToReactApp } from 'lib/nativeMessenger';

debug('executing content script on', location.href);

((document: Document, location: Location) => {
  try {
    const url = new URL(location.href);
    debug('function call - handleUrlUpdated:', url);
    fetchInformationForModifiedPage(url, nativeBrowserPostMessageToReactApp);
    loadOrUpdateSidebar(document, url);
  } catch (e) {
    console.log(e);
  }
})(document, location);
