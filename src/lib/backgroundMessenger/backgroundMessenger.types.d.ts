import { INativePostMessageToReactApp } from 'lumos-shared-js';

declare module './backgroundMessenger' {
  type PostMessage = INativePostMessageToReactApp;
  type NativePostMessenger = (message: PostMessage) => void;
}
