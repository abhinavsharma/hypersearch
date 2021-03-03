import { INativePostMessageToReactApp } from 'lumos-shared-js';

declare module './BackgroundMessenger' {
  type PostMessage = INativePostMessageToReactApp;
  type NativePostMessenger = (message: PostMessage) => void;
}
