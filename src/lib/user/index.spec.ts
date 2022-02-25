import { SYNC_LAST_USED_TAGS, SYNC_PRIVACY_KEY, SYNC_USER_TAGS } from 'constant';
import { chrome } from 'jest-chrome';
import UserManager from 'lib/user';

describe('UserManager tests', () => {

  beforeEach(() => {
    chrome.storage.sync.get.mockImplementation((_: any, cb: any) => {
      cb({});
    });
  })

  test('addUserTag', async () => {
    // Given
    expect(UserManager.user.tags).toStrictEqual([]);
    
    const spy = jest.fn((items: any, cb: any) => {
      expect(items[SYNC_USER_TAGS]).toStrictEqual([ 'tag' ]);
      cb()
    });
    chrome.storage.sync.set.mockImplementation(spy);

    // When
    UserManager.addUserTag('tag');

    // Then
    expect(spy).toHaveBeenCalled();
    expect(UserManager.user.tags).toStrictEqual([ 'tag' ]);
  });

  test('updateUserPrivacy', async () => {
    // Given
    expect(UserManager.user.privacy).toBe(undefined);

    const spy = jest.fn((items: any) => {
      expect(items[SYNC_PRIVACY_KEY]).toBe(true);
    });
    chrome.storage.sync.set.mockImplementation(spy);

    // When
    UserManager.updateUserPrivacy(true);

    // Then
    expect(spy).toHaveBeenCalled();
    expect(UserManager.user.privacy).toBe(true);
  });

  test('changeLastUsedTags', async () => {
    // Given
    expect(UserManager.user.lastUsedTags).toStrictEqual([]);

    const spy = jest.fn((items: any) => {
      expect(items[SYNC_LAST_USED_TAGS]).toStrictEqual([ 'tag1', 'tag2' ]);
    });
    chrome.storage.sync.set.mockImplementation(spy);

    // When
    UserManager.changeLastUsedTags([ 'tag1', 'tag2' ]);

    // Then
    expect(spy).toHaveBeenCalled();
    expect(UserManager.user.lastUsedTags).toStrictEqual([ 'tag1', 'tag2' ]);
  });

})
