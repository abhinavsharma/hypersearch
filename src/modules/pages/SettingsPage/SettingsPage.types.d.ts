import { FunctionComponent } from 'react';

declare module './SettingsPage' {
  type SettingsContext = {
    email: string | undefined;
    storedEmail: string;
    storedToken: TAccessToken | undefined;
    useServerSuggestions: boolean | undefined;
    setStoredEmail: React.Dispatch<React.SetStateAction<string>>;
    setStoredToken: React.Dispatch<React.SetStateAction<TAccessToken | undefined>>;
    handlePrivacyChange: (value: boolean | undefined) => Promise<void>;
  };

  type SettingsPageProps = {
    email?: string;
  };

  type SettingsPage = FunctionComponent<SettingsPageProps>;
}
