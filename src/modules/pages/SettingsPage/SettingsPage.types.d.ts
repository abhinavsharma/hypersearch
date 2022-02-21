import { FunctionComponent } from 'react';

declare module './SettingsPage' {
  type SettingsContext = {
    useServerSuggestions: boolean | undefined;
    handlePrivacyChange: (value: boolean | undefined) => Promise<void>;
  };

  type SettingsPageProps = {
    email?: string;
  };

  type SettingsPage = FunctionComponent<SettingsPageProps>;
}
