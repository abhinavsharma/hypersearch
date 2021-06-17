/**
 * @module lib:user
 * @version 1.0.0
 * @license (C) Insight
 */

import { v4 as uuid } from 'uuid';
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoIdToken,
} from 'amazon-cognito-identity-js';
import { debug } from 'utils/helpers';
import {
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_POOL_ID,
  SYNC_DISTINCT_KEY,
  SYNC_EMAIL_KEY,
  SYNC_LICENSE_KEY,
  SYNC_PRIVACY_KEY,
} from 'utils';

/**
 * User Manager
 * --------------------------------------
 * - Load and manage user attributes
 */
class UserManager {
  private _id: string | undefined = undefined;
  private _email: string | undefined = undefined;
  private _license: string | undefined = undefined;
  private _privacy: boolean | undefined = undefined;
  private _cognitoUser: CognitoUser | undefined = undefined;
  private _token: TAccessToken | undefined = undefined;
  private static _storage: Record<string, any> = Object.create(null);

  private static getStorageItem(key: string) {
    return this._storage[key];
  }

  private static setStorageItem(key: string, value: any) {
    this._storage[key] = value;
    chrome.storage.local.set({ [key]: value });
  }

  private static removeStorageItem(key: string) {
    this._storage[key] = undefined;
    chrome.storage.local.remove(key);
  }

  private static clearStorage() {
    this._storage = Object.create(null);
  }

  private static STORAGE = {
    getItem: (key: string) => UserManager.getStorageItem(key),
    setItem: (key: string, value: any) => UserManager.setStorageItem(key, value),
    removeItem: (key: string) => UserManager.removeStorageItem(key),
    clear: () => UserManager.clearStorage(),
  };

  public getCognitoPool() {
    return new CognitoUserPool({
      UserPoolId: AWS_COGNITO_POOL_ID,
      ClientId: AWS_COGNITO_CLIENT_ID,
      Storage: UserManager.STORAGE,
    });
  }

  public getCognitoUser() {
    if (this._email && !this._cognitoUser) {
      this._cognitoUser = new CognitoUser({
        Pool: this.getCognitoPool(),
        Username: this._email,
        Storage: UserManager.STORAGE,
      });
      debug('Current Cognito User Set', this._cognitoUser);
    }
    return this._cognitoUser;
  }

  /**
   * Load locally stored user properties if not exists.
   */
  public async initialize() {
    await this.getLocalUserData();
    debug('UserManager Initialized', this.user);
  }

  /**
   * Get the current user object.
   *
   * @readonly
   * @static
   */
  public get user() {
    return {
      id: this._id,
      email: this._email,
      privacy: this._privacy,
      license: this._license,
      token: this._token,
    };
  }

  /**
   * Gets the most recent user token and updates cached property.
   */
  public getUserToken(): Promise<CognitoIdToken | null> {
    return new Promise((resolve) => {
      const user = this.getCognitoUser();
      if (user) {
        user.getSession((error: Error, session: TCognitoUserSession) => {
          if (error) {
            debug('AWS Cognito Authenticate Error', error);
            return resolve(null);
          }
          debug('AWS Cognito Authenticate Success', session);
          debug('AWS Cognito Token', session?.getIdToken());
          this._token = session?.getIdToken();
          resolve(this._token || null);
        });
        user.getSignInUserSession();
      } else {
        resolve(null);
      }
    });
  }

  public signup(email: string) {
    const customAttributes = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];
    this.getCognitoPool()?.signUp(email, uuid(), customAttributes, [], (error, result) => {
      result && debug('AWS Cognito Sign Up Success', result);
      error && debug('AWS Cognito Sign Up Error', error);
    });
  }

  public async activate(code: string) {
    return await new Promise<TAccessToken | undefined>((resolve) =>
      chrome.storage.sync.set(
        { [SYNC_LICENSE_KEY]: 'ABHINAV-FRIENDS-FAMILY-SPECIAL-ACCESS-K' },
        () =>
          this.getCognitoUser()?.sendCustomChallengeAnswer(code, {
            onSuccess: (session) => {
              debug('AWS Cognito Custom Challenge Success', session);
              this._token = session?.getAccessToken();
              debug('AWS Cognito Token', this._token);
              resolve(this._token);
            },
            onFailure: (error) => {
              debug('AWS Cognito Custom Challenge Error', error), resolve(undefined);
            },
          }),
      ),
    );
  }

  public async login(email: string) {
    if (email && this._token) {
      return null;
    }
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: email }, () => resolve(true)),
    );
    this._email = email;
    !this.getCognitoUser() && this.signup(email);
    this.getCognitoUser()?.setAuthenticationFlowType('CUSTOM_AUTH');
    const authDetails = new AuthenticationDetails({ Username: email });
    this.getCognitoUser()?.initiateAuth(authDetails, {
      onSuccess: (result) => debug('AWS Cognito Initiate Auth Success', result.isValid()),
      onFailure: (error) => debug('AWS Cognito Initiate Auth Error', error),
      customChallenge: () => null,
    });
  }

  public async logout() {
    await new Promise((resolve) =>
      chrome.storage.sync.remove(SYNC_PRIVACY_KEY, () => resolve(true)),
    );
    await new Promise((resolve) => chrome.storage.sync.remove(SYNC_EMAIL_KEY, () => resolve(true)));
    this.getCognitoUser()?.globalSignOut({
      onSuccess: (result) => debug('AWS Cognito Logout Success', result),
      onFailure: (error) => debug('AWS Cognito Logout Error', error),
    });
    this._email = '';
    this._token = undefined;
  }

  public async setUserEmail(email: string) {
    this._email = email;
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: email }, () => resolve(true)),
    );
  }

  //-----------------------------------------------------------------------------------------------
  // ! Internal Implementation
  //-----------------------------------------------------------------------------------------------

  private async getLocalUserData() {
    const storedUserId = await new Promise<Record<string, string> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_DISTINCT_KEY, resolve),
    );
    this._id = storedUserId?.[SYNC_DISTINCT_KEY] ?? '';

    const storedEmail = await new Promise<Record<string, string> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_EMAIL_KEY, resolve),
    );
    this._email = storedEmail?.[SYNC_EMAIL_KEY] ?? '';

    const storedLicense = await new Promise<Record<string, string> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_LICENSE_KEY, resolve),
    );
    this._license = storedLicense?.[SYNC_LICENSE_KEY] ?? '';

    const storedUserPrivacy = await new Promise<Record<string, string> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    );
    this._privacy = storedUserPrivacy?.[SYNC_PRIVACY_KEY] === 'true';

    if (!this._id) {
      this._id = uuid();
      await new Promise<boolean>((resolve) =>
        chrome.storage.sync.set({ [SYNC_DISTINCT_KEY]: this._id }, () => resolve(true)),
      );
    }

    await new Promise((resolve) =>
      chrome.storage.local.get((data) => {
        UserManager._storage = data;
        resolve(true);
      }),
    );

    await this.getUserToken();
  }
}

const instance = new UserManager();
export default instance;