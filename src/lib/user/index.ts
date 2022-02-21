/**
 * @module lib:user
 * @version 1.0.0
 * @license (C) Insight
 */

import { v4 as uuid } from 'uuid';
import { debug } from 'lib/helpers';
import {
  SYNC_DISTINCT_KEY,
  SYNC_PRIVACY_KEY,
  SYNC_USER_TAGS,
  SYNC_LAST_USED_TAGS,
} from 'constant';

class User {
  private _id: string | undefined = undefined;
  private _privacy: boolean | undefined = undefined;
  private _tags: string[] = Array(0);
  private _lastUsedTags: string[] = Array(0);

  /**
   * Load locally stored user properties if not exists.
   */
  public async initialize() {
    await this.getLocalUserData();
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
      privacy: this._privacy,
      tags: this._tags,
      lastUsedTags: this._lastUsedTags,
    };
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

  //-----------------------------------------------------------------------------------------------
  // ! Internal Implementation
  //-----------------------------------------------------------------------------------------------

  private async getLocalUserData() {
    const storedUserId = await new Promise<Record<string, string> | undefined>((resolve) =>
      chrome.storage.sync.get(SYNC_DISTINCT_KEY, resolve),
    );
    this._id = storedUserId?.[SYNC_DISTINCT_KEY] ?? '';

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
  }

}

const instance = new User();
export default instance;
