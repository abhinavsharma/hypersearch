/**
 * @module BookmarksSynchronizer
 * @license (C) Insight
 * @version 1.0.0
 */

import axios, { AxiosInstance } from 'axios';
import {
  debug,
  isFirefox,
  LUMOS_API_URL_DEBUG,
  BOOKMARKS_READ_ENDPOINT,
  BOOKMARKS_SAVE_ENDPOINT,
  BOOKMARKS_LAST_FETCH,
  BOOKMARKS_TO_UPDATE,
  BOOKMARKS_TO_ADD,
  BOOKMARKS_TO_DELETE,
  BOOKMARKS_REMOTE_TO_LOCAL_ID,
} from 'utils';

/**
 * Constants
 */

const DEFAULT_FOLDERS = {
  mobile: {
    id: 'mobile______',
    name: 'Mobile Bookmarks',
  },
  menu: {
    id: 'menu________',
    name: 'Bookmarks Menu',
  },
  toolbar: {
    id: 'toolbar_____',
    name: 'Bookmarks Toolbar',
  },
  unfiled: {
    id: 'unfiled_____',
    name: 'Other Bookmarks',
  },
};

const FIREFOX_ROOT_ID = 'root________';
const CHROME_ROOT_ID = '0';
const CHROME_BOOKMARKS_BAR_ID = '1';
const CHROME_OTHER_BOOKMARKS_ID = '2';
const NOT_SYNCED = [
  FIREFOX_ROOT_ID,
  CHROME_ROOT_ID,
  CHROME_BOOKMARKS_BAR_ID,
  CHROME_OTHER_BOOKMARKS_ID,
  DEFAULT_FOLDERS.mobile.id,
  DEFAULT_FOLDERS.menu.id,
  DEFAULT_FOLDERS.toolbar.id,
  DEFAULT_FOLDERS.unfiled.id,
];
const BOOKMARKS_PERMISSION = 'bookmarks';

/**
 * Types & enums
 */

type ParentsAndChildren = Record<string, { parent?: RemoteBookmark; children: RemoteBookmark[] }>;

enum BookmarkType {
  BOOKMARK = 'BOOKMARK',
  FOLDER = 'FOLDER',
}

/**
 * Synchronizer class to apply remote changes to bookmarks and upload local changes to server.
 */
class BookmarksSynchronizer {
  private _axios: AxiosInstance;
  private _lastFetch: number;
  private _toAdd: string[];
  private _toUpdate: string[];
  private _toDelete: string[];
  private _remoteToLocalId: Record<string, string>;
  private _isSyncing: boolean;

  constructor() {
    debug('BookmarksSynchronizer - initialize\n---\n\tSingleton Instance', this, '\n---');
    this._lastFetch = 0;
    this._toAdd = [];
    this._toUpdate = [];
    this._toDelete = [];
    this._remoteToLocalId = {};
    this._isSyncing = false;
    this._axios = axios.create({
      baseURL: LUMOS_API_URL_DEBUG,
    });
    this.configure();
  }

  /**
   * Starts the bookmarks sync process, first fetching and applying
   * remote changes and then uploading local changes to the server.
   *
   * @param apiToken User token to access API.
   */
  public async sync(apiToken: string) {
    if (isFirefox()) {
      await this.startSync(apiToken);
    } else {
      return new Promise((resolve) => {
        chrome.permissions.request(
          {
            permissions: [BOOKMARKS_PERMISSION],
          },
          async (granted) => {
            if (!granted) return resolve(null);

            this.startSync(apiToken).then(resolve);
          },
        );
      });
    }
  }

  private async startSync(apiToken: string) {
    if (this._isSyncing) return;

    this._isSyncing = true;
    debug('Bookmarks sync started');

    try {
      await this.ensureDefaultFolders();
      await this.fetchAndApplyRemoteChanges(apiToken);
      await this.checkNewBookmarks();
      await this.uploadLocalChanges(apiToken);

      this._lastFetch = Math.floor(Date.now() / 1000);
      await this.store(this._lastFetch, BOOKMARKS_LAST_FETCH);
    } catch (e) {
      debug('Bookmarks synchronizer error', e);
    }

    this._isSyncing = false;
    debug('Bookmarks sync ended');
  }

  /**
   * Helper to store the given value for the given key.
   */
  private store(toStore: any, key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(
        {
          [key]: toStore,
        },
        () => {
          resolve();
        },
      );
    });
  }

  /**
   * Convinience method to store IDs of newly created bookmarks.
   */
  private storeToAdd() {
    return this.store(this._toAdd, BOOKMARKS_TO_ADD);
  }

  /**
   * Convinience method to store IDs of recently updated bookmarks.
   */
  private storeToUpdate() {
    return this.store(this._toUpdate, BOOKMARKS_TO_UPDATE);
  }

  /**
   * Convinience method to store IDs of recently deleted bookmarks.
   */
  private storeToDelete() {
    return this.store(this._toDelete, BOOKMARKS_TO_DELETE);
  }

  /**
   * Convinience method to store remote to local IDs mapping.
   */
  private storeRemoteToLocalId() {
    return this.store(this._remoteToLocalId, BOOKMARKS_REMOTE_TO_LOCAL_ID);
  }

  /**
   * Does the basic configuration to the class.
   */
  private configure() {
    chrome.storage.local.get(
      [
        BOOKMARKS_LAST_FETCH,
        BOOKMARKS_TO_ADD,
        BOOKMARKS_TO_UPDATE,
        BOOKMARKS_TO_DELETE,
        BOOKMARKS_REMOTE_TO_LOCAL_ID,
      ],
      (items) => {
        this._lastFetch = items[BOOKMARKS_LAST_FETCH] ?? 0;
        this._toAdd = items[BOOKMARKS_TO_ADD] ?? [];
        this._toUpdate = items[BOOKMARKS_TO_UPDATE] ?? [];
        this._toDelete = items[BOOKMARKS_TO_DELETE] ?? [];
        this._remoteToLocalId = items[BOOKMARKS_REMOTE_TO_LOCAL_ID] ?? {};
      },
    );

    this.checkPermission();
  }

  /**
   * Checks if the necessary bookmarks permission is granted.
   *
   * If granted, configure listeners for bookmarks changes.
   *
   * Otherwise sets a listener to wait for the permission, and then
   * configure the listeners.
   */
  private checkPermission() {
    debug('check permission');
    chrome.permissions.contains(
      {
        permissions: ['bookmarks'],
      },
      (hasPermission) => {
        debug('has permission', hasPermission);
        if (hasPermission) {
          debug('configure permission');
          this.configureListeners();
        } else {
          debug('add listener permission');
          chrome.permissions.onAdded.addListener((permission) => {
            debug('permissoin changed', permission);
            if (permission.permissions?.includes('bookmarks')) {
              debug('configure listeners after permission');
              this.configureListeners();
            }
          });
        }
      },
    );
  }

  /**
   * Configure bookmarks listeners.
   */
  private configureListeners() {
    chrome.bookmarks.onCreated.addListener((bookmarkId) => {
      if (this._isSyncing || this._toAdd.includes(bookmarkId)) {
        return;
      }

      this.addLocalId(bookmarkId);
      this.storeRemoteToLocalId();

      this._toAdd.push(bookmarkId);
      this.storeToAdd();
    });

    chrome.bookmarks.onMoved.addListener(async (_, info) => {
      if (this._isSyncing) return;

      const checkReorderedChildren = (
        parentId: string,
        minIndex: number,
        maxIndex: number = Number.MAX_SAFE_INTEGER,
      ) => {
        return new Promise((resolve) => {
          chrome.bookmarks.getChildren(parentId, (children) => {
            if (children) {
              const ids = children
                .filter((c) => (c.index ?? 0) >= minIndex && (c.index ?? 0) <= maxIndex)
                .map((c) => c.id);

              for (const id of ids) {
                if (!this._toAdd.includes(id) && !this._toUpdate.includes(id)) {
                  this._toUpdate.push(id);
                }
              }
            }

            resolve(null);
          });
        });
      };

      if (info.parentId !== info.oldParentId) {
        await checkReorderedChildren(info.oldParentId, info.oldIndex);
        await checkReorderedChildren(info.parentId, info.index);
      } else {
        await checkReorderedChildren(info.oldParentId, Math.min(info.index, info.oldIndex));
      }

      this.storeToUpdate();
    });

    chrome.bookmarks.onChanged.addListener((bookmarkId) => {
      if (
        this._isSyncing ||
        this._toAdd.includes(bookmarkId) ||
        this._toUpdate.includes(bookmarkId)
      ) {
        return;
      }

      this._toUpdate.push(bookmarkId);
      this.storeToUpdate();
    });

    const onRemove = (bookmarkId: string, node: chrome.bookmarks.BookmarkTreeNode) => {
      if (!NOT_SYNCED.includes(bookmarkId) && !NOT_SYNCED.includes(this.getRemoteId(bookmarkId))) {
        if (this._toAdd.indexOf(bookmarkId) > -1) {
          this._toAdd.splice(this._toAdd.indexOf(bookmarkId), 1);
          this.storeToAdd();
        } else {
          if (this._toUpdate.indexOf(bookmarkId) > -1) {
            this._toUpdate.splice(this._toUpdate.indexOf(bookmarkId), 1);
            this.storeToUpdate();
          }

          if (!this._toDelete.includes(bookmarkId)) {
            this._toDelete.push(bookmarkId);
            this.storeToDelete();
          }
        }
      }

      node.children?.forEach((child) => {
        onRemove(child.id, child);
      });
    };

    chrome.bookmarks.onRemoved.addListener((bookmarkId, info) => {
      if (this._isSyncing) return;

      onRemove(bookmarkId, info.node);
      this.ensureDefaultFolders();
    });

    this.mapNativeFolders();
  }

  /**
   * Maps native folders to remote to local IDs dictionary.
   */
  private mapNativeFolders = (): Promise<void> => {
    return new Promise((resolve) => {
      let root: string;

      if (isFirefox()) {
        root = FIREFOX_ROOT_ID;
      } else {
        root = CHROME_ROOT_ID;
      }

      chrome.bookmarks.getChildren(root, (children) => {
        children.forEach((child) => {
          if (isFirefox()) {
            this.addLocalId(child.id, child.id);
          } else {
            if (child.id === CHROME_BOOKMARKS_BAR_ID) {
              this.addLocalId(child.id, DEFAULT_FOLDERS.toolbar.id);
            } else if (child.id === CHROME_OTHER_BOOKMARKS_ID) {
              this.addLocalId(child.id, DEFAULT_FOLDERS.unfiled.id);
            } else {
              this.addLocalId(child.id);
            }
          }
        });

        resolve();
      });
    });
  };

  /**
   * Ensures roots folders exists.
   */
  private ensureDefaultFolders = (): Promise<void> => {
    return new Promise((resolve) => {
      let root: string;
      let folders: { id: string; name: string }[] = [];

      if (isFirefox()) {
        root = FIREFOX_ROOT_ID;
        folders = [
          DEFAULT_FOLDERS.toolbar,
          DEFAULT_FOLDERS.unfiled,
          DEFAULT_FOLDERS.mobile,
          DEFAULT_FOLDERS.menu,
        ];
      } else {
        root = CHROME_OTHER_BOOKMARKS_ID;
        folders = [DEFAULT_FOLDERS.mobile, DEFAULT_FOLDERS.menu];
      }

      chrome.bookmarks.getChildren(root, async (children) => {
        const localMaps = Object.values(this._remoteToLocalId);

        const checkFolder = async (defaultFolder: { id: string; name: string }) => {
          const localFolder = children.find(
            (c) => c.title === defaultFolder.name || c.id === defaultFolder.id,
          );

          if (localFolder) {
            if (!localMaps.includes(localFolder.id)) {
              this.addLocalId(localFolder.id, defaultFolder.id);
            }
          } else {
            await this.createLocalBookmark({
              guid: defaultFolder.id,
              title: defaultFolder.name,
            });
          }
        };

        const promises = folders.map(checkFolder);
        Promise.all(promises).then(() => resolve());
      });
    });
  };

  /**
   * Fetches bookmarks from the server.
   * @param apiToken token to access server API.
   */
  private async fetchBookmarks(apiToken: string): Promise<BookmarksResponse> {
    const { data } = await this._axios.get(BOOKMARKS_READ_ENDPOINT, {
      headers: {
        Authorization: apiToken,
      },
      params: {
        since: this._lastFetch,
      },
    });

    return data;
  }

  /**
   * Uploads bookmarks to the server.
   * @param apiToken token to access server API.
   * @param changes array of addeded or updated bookmkarks.
   * @param deletions array of deleted bookmarks IDs.
   */
  private async uploadBookmarks(
    apiToken: string,
    changes: RemoteBookmark[],
    deletions: string[],
  ): Promise<BookmarksResponse> {
    return await this._axios.post(
      BOOKMARKS_SAVE_ENDPOINT,
      {
        changes,
        deletions,
      },
      {
        headers: {
          Authorization: apiToken,
        },
      },
    );
  }

  /**
   * Updates local bookmarks with the given remote bookmarks.
   * @param remoteBookmarks array of remote bookmarks.
   */
  private updateRemoteBookmarks(remoteBookmarks: RemoteBookmark[]) {
    const promises = remoteBookmarks
      .map(async (remoteBookmark) => {
        if (!remoteBookmark.guid) {
          return;
        }

        let localId = await this.getLocalId(remoteBookmark.guid);

        // If local not found by ID
        if (!localId) {
          // Try to find lcoal with same title/url.
          const local = await this.findLocalBookmark(remoteBookmark);

          // If found, add local mapping.
          if (local) {
            await this.addLocalId(local.id, remoteBookmark.guid);
            localId = local.id;
          } else {
            return;
          }
        }

        this.updateLocalBookmark(localId, remoteBookmark);
      })
      .filter((p) => !!p);

    return Promise.all(promises);
  }

  /**
   * Deletes local bookmarks with the given remote bookmarks.
   * @param remoteBookmarks array of remote bookmarks.
   */
  private deleteRemoteBookmarks(remoteBookmarks: RemoteBookmark[]) {
    const promises = remoteBookmarks
      .map(async (remoteBookmark) => {
        if (!remoteBookmark.guid) {
          return;
        }

        const localId = await this.getLocalId(remoteBookmark.guid);

        if (!localId) {
          return;
        }

        await this.deleteLocalBookmark(localId, remoteBookmark);
      })
      .filter((p) => !!p);

    return Promise.all(promises);
  }

  /**
   * Checks for bookmarks that were added while listeners were not set.
   */
  private async checkNewBookmarks(): Promise<void> {
    const mappedLocalIds = Object.values(this._remoteToLocalId);

    const check = (node: chrome.bookmarks.BookmarkTreeNode) => {
      // If not mapped, map it
      if (!NOT_SYNCED.includes(node.id) && !mappedLocalIds.includes(node.id)) {
        this.addLocalId(node.id);

        if (!this._toAdd.includes(node.id)) {
          this._toAdd.push(node.id);
          this.storeToAdd();
        }
      }

      node.children?.forEach((child) => {
        check(child);
      });
    };

    return new Promise<void>((resolve) => {
      chrome.bookmarks.getTree(async (tree) => {
        if (tree && tree[0]) {
          check(tree[0]);
        }

        resolve();
      });
    }).then(() => this.storeRemoteToLocalId());
  }

  /**
   * Update local changes to server
   */
  private async uploadLocalChanges(apiToken: string) {
    debug('uploading added', this._toAdd);
    debug('uploading updated', this._toUpdate);
    debug('uplaoding deleted', this._toDelete);

    const localChanges = this._toAdd.concat(this._toUpdate);
    const promises: Promise<any>[] = localChanges.map((localBookmark) => {
      return new Promise((resolve) => {
        chrome.bookmarks.get(localBookmark, (bookmarks) => {
          if (!bookmarks || bookmarks.length === 0) {
            return resolve(null);
          }

          const bookmark = bookmarks[0];

          if (
            NOT_SYNCED.includes(bookmark.id) ||
            NOT_SYNCED.includes(this.getRemoteId(bookmark.id))
          ) {
            return resolve(null);
          }

          const guid = this.getRemoteId(bookmark.id);
          const parentId = bookmark.parentId && this.getRemoteId(bookmark.parentId);
          const remoteBookmark = {
            guid,
            parent: parentId,
            position: bookmark.index ?? 0,
            title: bookmark.title,
            url: bookmark.url,
            type: bookmark.url ? BookmarkType.BOOKMARK : BookmarkType.FOLDER,
          } as RemoteBookmark;

          resolve(remoteBookmark);
        });
      });
    });
    const changes = (await Promise.all(promises)).filter((p) => !!p);
    const deletions = this._toDelete
      .filter((id) => !NOT_SYNCED.includes(id) && !NOT_SYNCED.includes(this.getRemoteId(id)))
      .map((localId) => this.getRemoteId(localId));

    for (const key in this._remoteToLocalId) {
      if (deletions.includes(key)) {
        delete this._remoteToLocalId[key];
      }
    }

    await this.storeRemoteToLocalId();
    await this.uploadBookmarks(apiToken, changes, deletions);

    this._toAdd = [];
    this._toUpdate = [];
    this._toDelete = [];

    await Promise.all([this.storeToAdd(), this.storeToUpdate(), this.storeToDelete()]);
  }

  /**
   * Fetch remote changes and apply locally.
   *
   * @param lastFetch last time changes were successfully fetched.
   */
  private async fetchAndApplyRemoteChanges(apiToken: string) {
    const remoteItems = await this.fetchBookmarks(apiToken);

    debug('remote response', remoteItems);

    if (remoteItems.add) {
      const parentsAndChildren = this.groupParentsAndChildren(remoteItems.add);
      await this.addParentsAndChildren(parentsAndChildren);
    }

    if (remoteItems.update) {
      await this.updateRemoteBookmarks(remoteItems.update);
    }

    if (remoteItems.delete) {
      await this.deleteRemoteBookmarks(remoteItems.delete);
    }
  }

  /**
   * Tries to get the corresponding remote ID for the given local ID. If no
   * remote ID is found then local ID is returned.
   *
   * @param localId bookmark local ID.
   */
  private getRemoteId(localId: string) {
    for (const key in this._remoteToLocalId) {
      if (this._remoteToLocalId[key] === localId) {
        return key;
      }
    }

    return localId;
  }

  /**
   * Retrieves the local ID for the given bookmark remote ID, if any.
   * @param remoteId bookmark remote ID.
   * @returns bookmark local ID, or null.
   */
  private getLocalId(remoteId: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      if (this._remoteToLocalId[remoteId]) {
        resolve(this._remoteToLocalId[remoteId]);
      } else {
        chrome.bookmarks.get(remoteId, (result) => {
          resolve(result && result[0].id);
        });
      }
    });
  }

  /**
   * Stores the mapping from bookmark remote ID to its local ID.
   * @param localId bookmark local ID.
   * @param remoteId bookmark remote ID.
   */
  private addLocalId(localId: string, remoteId?: string): Promise<void> {
    return new Promise((resolve) => {
      const newGuid = remoteId ?? this.randomGuid();

      this._remoteToLocalId[newGuid] = localId;
      this.storeRemoteToLocalId().then(resolve);
    });
  }

  /**
   * Retrieves a local bookmark, if any, with the given remote ID.
   * @param id bookmark remote ID.
   * @returns a local bookmark, or null.
   */
  private async getBookmarkByRemoteId(
    id: string,
  ): Promise<chrome.bookmarks.BookmarkTreeNode | null> {
    const localId = await this.getLocalId(id);
    return new Promise((resolve) => {
      if (localId) {
        chrome.bookmarks.get(localId, (localBookmark) => {
          resolve(localBookmark && localBookmark[0]);
        });
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Get local bookmarks by ID.
   */
  private getLocalBookmarkById(id: string): Promise<chrome.bookmarks.BookmarkTreeNode | null> {
    return new Promise((resolve) => {
      chrome.bookmarks.get(id, (bookmarks) => {
        resolve(bookmarks && bookmarks[0]);
      });
    });
  }

  /**
   * Tries to find a local bookmark based on the remote bookmark.
   * @param remoteBookmark remote bookmark
   * @returns a local bookmark, or null.
   */
  private findLocalBookmark(
    remoteBookmark: RemoteBookmark,
    parent?: RemoteBookmark,
  ): Promise<chrome.bookmarks.BookmarkTreeNode | null> {
    return new Promise((resolve) => {
      const query: Record<string, string> = {};

      if (remoteBookmark.url) {
        query.url = remoteBookmark.url;
      }

      if (remoteBookmark.title) {
        query.title = remoteBookmark.title;
      }

      chrome.bookmarks.search(query, async (result) => {
        const filtered = result.filter(async (localBookmark) => {
          let localParent: chrome.bookmarks.BookmarkTreeNode | null = null;
          let newParentTitle: string | undefined;

          // Just root should have not parent
          if (localBookmark.parentId) {
            localParent = await this.getLocalBookmarkById(localBookmark.parentId);
          }

          // If parent provided (from response), get its title
          if (parent) {
            newParentTitle = parent.title;
          }
          // No parent provided
          else {
            // If remote has no parent it's on root
            if (!remoteBookmark.parent && localParent && this.isRoot(localParent?.id)) {
              return true;
            }

            // If remote has parent, try to get it
            if (remoteBookmark.parent) {
              newParentTitle = (await this.getBookmarkByRemoteId(remoteBookmark.parent))?.title;
            }
          }

          return localParent?.title === newParentTitle;
        });
        resolve(filtered[0]);
      });
    });
  }

  /**
   * Creates local bookmark with data from the given remote bookmark.
   * @param remoteBookmark remote bookmark.
   */
  private async createLocalBookmark(remoteBookmark: RemoteBookmark): Promise<void> {
    const parentId = remoteBookmark.parent && (await this.getLocalId(remoteBookmark.parent));
    return new Promise((resolve) => {
      const createParams: chrome.bookmarks.BookmarkCreateArg = {
        parentId,
        title: remoteBookmark.title,
        url: remoteBookmark.url,
      };

      chrome.bookmarks.create(createParams, async (newBookmark) => {
        if (newBookmark) {
          await this.addLocalId(newBookmark.id, remoteBookmark.guid);
        }

        resolve();
      });
    });
  }

  /**
   * Updates a local bookmark with the given remote bookmark.
   * @param localId ID of the local bookmark
   * @param remoteBookmark remote bookmark
   */
  private updateLocalBookmark(localId: string, remoteBookmark: RemoteBookmark): Promise<void> {
    return new Promise((resolve) => {
      chrome.bookmarks.update(
        localId,
        {
          title: remoteBookmark.title,
          url: remoteBookmark.url,
        },
        async (updatedBookmark) => {
          const complete = async () => {
            // Storing remote ID to local ID mapping, if not stored before
            if (remoteBookmark.guid && !this._remoteToLocalId[remoteBookmark.guid]) {
              await this.addLocalId(updatedBookmark.id, remoteBookmark.guid);
            }

            resolve();
          };

          if (updatedBookmark) {
            const moveParams: chrome.bookmarks.BookmarkDestinationArg = {
              // index: remoteBookmark.position,
            };

            if (updatedBookmark.parentId !== remoteBookmark.parent) {
              moveParams.parentId =
                remoteBookmark.parent && (await this.getLocalId(remoteBookmark.parent));
            }

            chrome.bookmarks.move(localId, moveParams, complete);
          }
        },
      );
    });
  }

  /**
   * Deletes a local bookmark with the given local ID.
   * @param localId ID of the local bookmark
   * @param remoteBookmark remote bookmark
   */
  private deleteLocalBookmark(localId: string, remoteBookmark: RemoteBookmark): Promise<void> {
    return new Promise((resolve) => {
      if (remoteBookmark.type === BookmarkType.FOLDER) {
        chrome.bookmarks.removeTree(localId, resolve);
      } else {
        chrome.bookmarks.remove(localId, resolve);
      }
    });
  }

  /**
   * Inserts or updates a local bookmark with data from the given remote bookmark.
   * @param remoteBookmark remote bookmark.
   */
  private async handleRemoteBookmark(remoteBookmark: RemoteBookmark, parent?: RemoteBookmark) {
    if (!remoteBookmark.guid) {
      return;
    }

    const localBookmark = await this.getBookmarkByRemoteId(remoteBookmark.guid);

    if (localBookmark) {
      return this.updateLocalBookmark(localBookmark.id, remoteBookmark);
    } else {
      return this.findLocalBookmark(remoteBookmark, parent).then((local) => {
        if (local) {
          return this.updateLocalBookmark(local.id, remoteBookmark);
        } else {
          return this.createLocalBookmark(remoteBookmark);
        }
      });
    }
  }

  /**
   * Created a dictionary of parents (key) and children (value).
   * @param remoteBookmarks remote bookmarks.
   * @returns a `ParentsAndChildren` object.
   */
  private groupParentsAndChildren(remoteBookmarks: RemoteBookmark[]) {
    const parentsAndChildren: ParentsAndChildren = {};

    const add = (bookmark: RemoteBookmark, parentId: string) => {
      if (bookmark.type !== BookmarkType.BOOKMARK && bookmark.type !== BookmarkType.FOLDER) {
        return;
      }

      if (Object.keys(parentsAndChildren).includes(parentId)) {
        parentsAndChildren[parentId].children =
          parentsAndChildren[parentId]?.children.concat(bookmark);
      } else {
        parentsAndChildren[parentId] = {
          children: [bookmark],
        };
      }
    };

    remoteBookmarks.forEach((bookmark) => {
      if (!bookmark.type || !bookmark.guid) {
        return;
      }

      if (bookmark.type === BookmarkType.FOLDER) {
        if (Object.keys(parentsAndChildren).includes(bookmark.guid)) {
          parentsAndChildren[bookmark.guid].parent = bookmark;
        } else {
          parentsAndChildren[bookmark.guid] = {
            parent: bookmark,
            children: [],
          };
        }
      }

      if (bookmark.parent) {
        add(bookmark, bookmark.parent);
      }
    });

    return parentsAndChildren;
  }

  /**
   * Adds the children of the first parent in the given object.
   * @param parentAndChildrenDict `ParentsAndChildren` object.
   */
  private addParentsAndChildren(parentAndChildrenDict: ParentsAndChildren) {
    const parentId = Object.keys(parentAndChildrenDict)[0];

    if (parentId) {
      return this.addParentsAndChildrenOf(parentAndChildrenDict, parentId);
    }
  }

  /**
   *
   * @private
   * @param parentAndChildrenDict
   * @param parentId
   * @returns
   */
  private addParentsAndChildrenOf(
    parentAndChildrenDict: ParentsAndChildren,
    parentId: string,
  ): Promise<void> {
    if (!parentAndChildrenDict[parentId]) {
      return Promise.resolve();
    }

    const add = (children: RemoteBookmark[], parent?: RemoteBookmark) => {
      return Promise.all(
        children.map((child) => {
          return this.handleRemoteBookmark(child, parent);
        }),
      );
    };

    const parentAndChildren = parentAndChildrenDict[parentId];
    delete parentAndChildrenDict[parentId];

    const parent = parentAndChildren.parent;
    const children = parentAndChildren.children;

    if (parent) {
      const parentsParent = parent.parent;

      if (parentsParent && Object.keys(parentAndChildren).includes(parentsParent)) {
        return this.addParentsAndChildrenOf(parentAndChildrenDict, parentsParent).then(async () => {
          await add(children, parent);
        });
      } else {
        return this.handleRemoteBookmark(parent)
          .then(() => add(children, parent))
          .then(() => this.addParentsAndChildren(parentAndChildrenDict));
      }
    } else {
      return add(children).then(() => this.addParentsAndChildren(parentAndChildrenDict));
    }
  }

  /**
   * Returns a random GUID.
   */
  private randomGuid() {
    const length = 9;
    const array = new Uint8Array(length);

    window.crypto.getRandomValues(array);
    const base64 = btoa(String.fromCharCode(...array));

    return base64.replaceAll('/', '-').replaceAll('+', '-');
  }

  /**
   * Whether the provided ID belongs to root folders.
   */
  private isRoot(id?: string) {
    return !id || id === CHROME_OTHER_BOOKMARKS_ID || id === CHROME_BOOKMARKS_BAR_ID;
  }
}

/**
 * Static instance of the augmentation manager.
 */
const instance = new BookmarksSynchronizer();

export default instance;
