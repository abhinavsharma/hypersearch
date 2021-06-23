import React from 'react';
import { render } from 'react-dom';
import { IntroductionPage } from 'modules/introduction';
import UserManager from 'lib/user';

(async () => {
  await UserManager.initialize();
  const root = document.getElementById('root');
  render(<IntroductionPage />, root);
})();
