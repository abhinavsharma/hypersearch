declare type TSettingsContext = {
  activationCode: string;
  emailValue: string;
  hasEmail: boolean;
  isLoggedIn: boolean;
  setActivationCode: React.Dispatch<React.SetStateAction<string>>;
  setEmailValue: React.Dispatch<React.SetStateAction<string>>;
  setHasEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};
