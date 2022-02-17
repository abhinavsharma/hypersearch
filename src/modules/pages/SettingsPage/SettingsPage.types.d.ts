import { FunctionComponent } from 'react';

declare module './SettingsPage' {
  type SettingsContext = {
    email: string | undefined;
    storedEmail: string;
    useServerSuggestions: boolean | undefined;
    setStoredEmail: React.Dispatch<React.SetStateAction<string>>;
    handlePrivacyChange: (value: boolean | undefined) => Promise<void>;
  };

  type SettingsPageProps = {
    email?: string;
  };

  type SettingsPage = FunctionComponent<SettingsPageProps>;
}
