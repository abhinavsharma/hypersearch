import { FunctionComponent } from 'react';

declare module './ActivePage' {
  type ActivePageProps = any;

  type ActivePage = FunctionComponent<ActivePageProps>;
}
