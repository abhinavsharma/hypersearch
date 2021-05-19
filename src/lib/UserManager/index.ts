/**
 * @module lib:user
 * @version 1.0.0
 * @license (C) Insight
 */

import { SYNC_DISTINCT_KEY, SYNC_EMAIL_KEY, SYNC_LICENSE_KEY, SYNC_PRIVACY_KEY } from 'utils';
import { debug } from 'utils/helpers';
import { v4 as uuid } from 'uuid';

/**
 * User Manager
 * --------------------------------------
 * - Load and manage user attributes
 */
export default class _User {
  private static _id: string | undefined = undefined;
  private static _email: string | undefined = undefined;
  private static _license: string | undefined = undefined;
  private static _privacy: boolean | undefined = undefined;

  /**
   * Load locally stored user properties if not exists.
   */
  public static async initialize() {
    debug('Loading User...');
    if (this._id === undefined || this._license === undefined || this._privacy === undefined) {
      await this.getUser();
      debug('User Loaded!');
    }
  }

  /**
   * Get the current user object.
   *
   * @readonly
   * @static
   */
  public static get user() {
    return {
      id: this._id,
      email: this._email,
      privacy: this._privacy,
      license: this._license,
    };
  }

  //-----------------------------------------------------------------------------------------------
  // ! Internal Implementation
  //-----------------------------------------------------------------------------------------------

  private static async getUser() {
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

    return {
      id: this._id,
      license: this._license,
      privacy: this._privacy,
    };
  }
}
