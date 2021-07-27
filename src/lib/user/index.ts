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
import { debug } from 'lib/helpers';
import {
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_POOL_ID,
  ENV,
  DEFAULT_LICENSE,
  SYNC_DISTINCT_KEY,
  SYNC_EMAIL_KEY,
  LEGACY_LOCAL_LICENSE,
  SYNC_PRIVACY_KEY,
  SYNC_LICENSE_KEY,
  SYNC_USER_TAGS,
  SYNC_LAST_USED_TAGS,
  USER_UPDATED_MESSAGE,
  SYNC_START_MESSAGE,
  SYNC_TRIGGER_START_MESSAGE,
  REFRESH_SIDEBAR_TABS_MESSAGE,
} from 'constant';

class User {
  private _id: string | undefined = undefined;
  private _email: string | undefined = undefined;
  private _licenses: Array<string> = Array(0);
  private _privacy: boolean | undefined = undefined;
  private _cognitoUser: CognitoUser | undefined = undefined;
  private _token: CognitoIdToken | undefined = undefined;
  private _tags: string[] = Array(0);
  private _lastUsedTags: string[] = Array(0);
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
    getItem: (key: string) => User.getStorageItem(key),
    setItem: (key: string, value: any) => User.setStorageItem(key, value),
    removeItem: (key: string) => User.removeStorageItem(key),
    clear: () => User.clearStorage(),
  };

  public getCognitoPool() {
    return new CognitoUserPool({
      UserPoolId: AWS_COGNITO_POOL_ID[ENV],
      ClientId: AWS_COGNITO_CLIENT_ID[ENV],
      Storage: User.STORAGE,
    });
  }

  public getCognitoUser() {
    if (this._email && !this._cognitoUser) {
      this._cognitoUser = new CognitoUser({
        Pool: this.getCognitoPool(),
        Username: this._email,
        Storage: User.STORAGE,
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
    this.configureListeners();
    debug('User Initialized', this.user);
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
      licenses: this._licenses,
      token: this._token,
      tags: this._tags,
      lastUsedTags: this._lastUsedTags,
    };
  }

  /**
   * Refreshes user tokens and return its identity token.
   *
   * @returns A promise of `string` or `undefined`
   */
  public async getIdentityToken(): Promise<string | undefined> {
    const session = await this.getSession();
    return session?.getIdToken().getJwtToken();
  }

  /**
   * Refreshes user tokens and return its access token.
   *
   * @returns A promise of `string` or `undefined`
   */
  public async getAccessToken(): Promise<string | undefined> {
    const session = await this.getSession();
    return session?.getAccessToken().getJwtToken();
  }

  /**
   * Create a Cognito account with the given email address
   *
   * @param email The email value
   */
  public async signup(email: string): Promise<void> {
    const customAttributes = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];
    return new Promise((resolve) => {
      if (!this.getCognitoPool()) {
        return resolve();
      }

      this.getCognitoPool().signUp(email, uuid(), customAttributes, [], (error, result) => {
        result && debug('AWS Cognito Sign Up Success', result);
        error && debug('AWS Cognito Sign Up Error', error);
        resolve();
      });
    });
    
  }

  /**
   * Trigger the email verification after the user has signed in
   *
   * @param code The activation code
   * @returns Cognito Token
   */
  public async activate(code: string) {
    return await new Promise<TAccessToken | undefined>((resolve) =>
      chrome.storage.sync.set(
        { [LEGACY_LOCAL_LICENSE]: 'ABHINAV-FRIENDS-FAMILY-SPECIAL-ACCESS-K' },
        () =>
          this.getCognitoUser()?.sendCustomChallengeAnswer(code, {
            onSuccess: (session) => {
              debug('AWS Cognito Custom Challenge Success', session);
              this._token = session?.getAccessToken();
              this.notifyUserUpdated(true);
              debug('AWS Cognito Token', this._token);
              resolve(this._token);

              chrome.runtime.sendMessage({ type: REFRESH_SIDEBAR_TABS_MESSAGE });
            },
            onFailure: (error) => {
              debug('AWS Cognito Custom Challenge Error', error), resolve(undefined);
            },
          }),
      ),
    );
  }

  /**
   * Initiate the user login process
   *
   * @param email The email value
   * @returns Boolean
   */
  public async login(email: string) {
    if (email && this._token) {
      return null;
    }
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: email }, () => resolve(true)),
    );
    !this._licenses.length && (await this.addUserLicense(DEFAULT_LICENSE));
    this._email = email;
    
    await this.signup(email);

    this._cognitoUser = new CognitoUser({
      Pool: this.getCognitoPool(),
      Username: this._email,
      Storage: User.STORAGE,
    });

    debug('Current Cognito User Set', this._cognitoUser);

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
    this.notifyUserUpdated(false);
  }

  public async setUserEmail(email: string) {
    this._email = email;
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_EMAIL_KEY]: email }, () => resolve(true)),
    );
  }

  public async replaceUserLicenses(licenses: string[]) {
    return new Promise<string[] | null>((resolve, reject) =>
      chrome.storage.sync.set({ [SYNC_LICENSE_KEY]: licenses }, () => {
        const hasError = chrome.runtime.lastError;
        if (hasError) {
          debug('UserManager - Add User License - Error', hasError.message);
          reject(null);
        }
        this._licenses = licenses;
        debug('UserManager - Add User License - Success', licenses);
        resolve(this._licenses);
      }),
    );
  }

  public async addUserLicense(license: string) {
    this._licenses.push(license);
    return new Promise<string[] | null>((resolve, reject) =>
      chrome.storage.sync.set({ [SYNC_LICENSE_KEY]: this._licenses }, () => {
        const hasError = chrome.runtime.lastError;
        if (hasError) {
          debug('UserManager - Add User License - Error', hasError.message);
          reject(null);
        }
        debug('UserManager - Add User License - Success', license);
        resolve(this._licenses);
      }),
    );
  }

  public async addUserTag(tag: string) {
    this._tags.push(tag);
    return new Promise<string[]>((resolve, reject) =>
      chrome.storage.sync.set({ [SYNC_USER_TAGS]: this._tags }, () => {
        const hasError = chrome.runtime.lastError;
        if (hasError) {
          debug('UserManager - Add User Tag - Error', hasError.message);
          reject(null);
        }
        debug('UserManager - Add User Tag - Success', tag);
        resolve(this._tags);
      }),
    );
  }

  public async updateUserPrivacy(privacy: boolean) {
    this._privacy = privacy;
    await new Promise((resolve) =>
      chrome.storage.sync.set({ [SYNC_PRIVACY_KEY]: privacy }, () => resolve(true)),
    );
  }

  public async changeLastUsedTags(tags: string[]) {
    this._lastUsedTags = tags;
    chrome.storage.sync.set({
      [SYNC_LAST_USED_TAGS]: tags,
    });
  }

  public async startSync(userInitiated: boolean) {
    const token = await this.getIdentityToken();
    chrome.runtime.sendMessage({
      token,
      userInitiated,
      type: SYNC_START_MESSAGE
    });
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
      chrome.storage.sync.get(LEGACY_LOCAL_LICENSE, resolve),
    ).then((data) => data?.[LEGACY_LOCAL_LICENSE]);
    const storedLicenses = await new Promise<Record<string, string[]> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_LICENSE_KEY, resolve),
    ).then((data) => data?.[SYNC_LICENSE_KEY]);

    this._licenses = Array.from(
      new Set(storedLicense ? [storedLicense, ...(storedLicenses ?? [])] : storedLicenses ?? []),
    );

    const storedUserPrivacy = await new Promise<Record<string, any> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_PRIVACY_KEY, resolve),
    );
    this._privacy = String(storedUserPrivacy?.[SYNC_PRIVACY_KEY]) === 'true';

    const storedUserTags = await new Promise<Record<string, string[]> | undefined>((resolve) => {
      chrome.storage.sync.get(SYNC_USER_TAGS, resolve);
    }).then((data) => data?.[SYNC_USER_TAGS]);
    this._tags = storedUserTags ?? [];

    const storedLastUserTags = await new Promise<Record<string, string[]> | undefined>(
      (resolve) => {
        chrome.storage.sync.get(SYNC_LAST_USED_TAGS, resolve);
      },
    ).then((data) => data?.[SYNC_LAST_USED_TAGS]);
    this._lastUsedTags = storedLastUserTags ?? [];

    if (!this._id) {
      this._id = uuid();
      await new Promise<boolean>((resolve) =>
        chrome.storage.sync.set({ [SYNC_DISTINCT_KEY]: this._id }, () => resolve(true)),
      );
    }

    await new Promise((resolve) =>
      chrome.storage.local.get((data) => {
        User._storage = data;
        resolve(true);
      }),
    );

    const session = await this.getSession();
    this.notifyUserUpdated(!!session);
  }

  private async getSession(): Promise<TCognitoUserSession | null> {
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
          resolve(session);
        });
        user.getSignInUserSession();
      } else {
        resolve(null);
      }
    });
  }

  private async configureListeners() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === SYNC_TRIGGER_START_MESSAGE) {
        this.startSync(false);
      }
    });
  }

  private notifyUserUpdated(authenticated: boolean) {
    chrome.runtime.sendMessage({
      type: USER_UPDATED_MESSAGE,
      authenticated,
    });
  }
}

const instance = new User();
export default instance;
