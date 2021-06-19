import { FunctionComponent } from 'react';
import { CognitoAccessToken } from 'amazon-cognito-identity-js';

declare module './BookmarksSyncButton' {
  type BookmarksSyncButtonProps = {
    token: CognitoAccessToken | undefined;
  };

  type BookmarksSyncButton = FunctionComponent<BookmarksSyncButtonProps>;
}
