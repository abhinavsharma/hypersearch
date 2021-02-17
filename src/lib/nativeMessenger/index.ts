import { debug, INativeAddReactAppListener, INativePostMessageToReactApp } from 'lumos-shared-js';

export function nativeBrowserPostMessageToReactApp({
  command,
  data,
}: INativePostMessageToReactApp): void {
  debug('function call - foreground nativeBrowserPostMessageToReactApp - posting', command, data);
  chrome.runtime.sendMessage({
    command: command,
    data: data,
  });
}

export function nativeBrowserAddReactAppListener({
  window,
  message,
  callback,
}: INativeAddReactAppListener): void {
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.data && msg.data.command && msg.data.command === message) {
      debug(
        'nativeBrowserAddReactAppListener - received message from background into content',
        msg,
      );
      callback(msg);
    }
  });
}
