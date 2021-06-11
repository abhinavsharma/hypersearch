declare type TSettingsContext = {
  storedEmail: string;
  storedToken: TAccessToken | undefined;
  useServerSuggestions: boolean | undefined;
  setStoredEmail: React.Dispatch<React.SetStateAction<string>>;
  setStoredToken: React.Dispatch<React.SetStateAction<TAccessToken | undefined>>;
  handlePrivacyChange: (value: boolean | undefined) => Promise<void>;
};
