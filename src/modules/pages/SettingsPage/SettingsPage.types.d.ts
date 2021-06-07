declare type TSettingsContext = {
  storedEmail: string;
  storedToken: TAccessToken | undefined;
  setStoredEmail: React.Dispatch<React.SetStateAction<string>>;
  setStoredToken: React.Dispatch<React.SetStateAction<TAccessToken | undefined>>;
};
