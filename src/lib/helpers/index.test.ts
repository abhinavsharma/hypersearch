import { chrome } from 'jest-chrome';
import SidebarLoader from 'lib/sidebar';
import {
  AUGMENTATION_ID,
  CONDITION_KEY,
  CONDITION_LABEL,
  CUSTOM_UA_STRING,
  PROCESS_SERP_OVERLAY_MESSAGE,
  SIDEBAR_TAB_FAKE_URL,
  SPECIAL_URL_JUNK_STRING,
  STRIPPED_RESPONSE_HEADERS,
  SYNC_PRIVACY_KEY,
} from 'constant';
import {
  applyRequestHeaderMutations,
  applyResponseHeaderModifications,
  compareTabs,
  decodeSpace,
  encodeSpace,
  extractPublication,
  extractUrlProperties,
  getFirstValidTabIndex,
  getLastValidTabIndex,
  getRankedDomains,
  getStoredUserSettings,
  getUrlSlices,
  makeEllipsis,
  processCookieString,
  removeEmoji,
  removeProtocol,
  removeTrailingSlash,
  sanitizeUrl,
  shouldPreventEventBubble,
  triggerSerpProcessing,
} from '.';

const mockAugmentation = (id: string = 'some_id'): Augmentation => {
  return {
    id,
    name: 'some_name',
    description: '',
    conditions: {
      evaluate_with: 'OR',
      condition_list: [],
    },
    actions: {
      action_list: [],
    },
  };
};

const mockTab = ({ id = 'some_id', pinned = false, installed = false } = {}, url: string = 'https://www.google.com'): SidebarTab => {
  return {
    augmentation: {
      ...mockAugmentation(id),
      pinned,
      installed
    },
    url: new URL(url),
  };
};

describe('Helper tests', () => {

  test('getRankedDomains', () => {
    // Given

    // When
    const ranked = getRankedDomains([ 'domain_1', 'domain_2', 'domain_2', 'domain_3', 'domain_1', 'domain_2' ]);

    // Then
    expect(ranked).toStrictEqual([ 'domain_2', 'domain_1', 'domain_3' ])
  });

  describe('triggerSerpProcessing', () => {

    test('should dispatch two messages when subtabsOnly is false', async () => {
      // Given
      SidebarLoader.sidebarTabs = [
        mockTab({ id: 'aug_1' }, 'https://www.google.com/'),
        mockTab({ id: 'aug_2' }, 'https://www.bing.com/'),
        mockTab({ id: 'aug_3' }, 'https://www.yahoo.com/'),
      ];
      SidebarLoader.customSearchEngine = {
        querySelector: {
          container: 'container',
          desktop: 'desktop',
          featured: ['featured'],
          pad: 'pad',
          phone: 'phone',
          result_container_selector: 'result',
        },
        search_engine_json: {
          required_params: [],
          required_prefix: '',
        }
      }

      const listener = ({ data }: any) => {
        if (data.name !== PROCESS_SERP_OVERLAY_MESSAGE) { return; }
        // Then
        if (data.customLink) {
          expect(data).toStrictEqual ({
            customLink: 'custom_link',
            augmentation: [
              SidebarLoader.sidebarTabs[0].augmentation,
              SidebarLoader.sidebarTabs[1].augmentation,
              SidebarLoader.sidebarTabs[2].augmentation,
            ],
            createdUrls: [
              'https://www.google.com/',
              'https://www.bing.com/',
              'https://www.yahoo.com/',
            ],
            name: PROCESS_SERP_OVERLAY_MESSAGE,
            selector: {
              container: null,
              featured: [ 'featured' ],
              link: 'custom_link',
            },
          });
        } else {
          expect(data).toStrictEqual ({
            augmentation: [
              SidebarLoader.sidebarTabs[0].augmentation,
              SidebarLoader.sidebarTabs[1].augmentation,
              SidebarLoader.sidebarTabs[2].augmentation,
            ],
            createdUrls: [
              'https://www.google.com/',
              'https://www.bing.com/',
              'https://www.yahoo.com/',
            ],
            name: PROCESS_SERP_OVERLAY_MESSAGE,
            selector: {
              container: 'result',
              featured: [ 'featured' ],
              link: 'phone',
            },
          });
        }
      }

      window.addEventListener('message', listener);
  
      // When
      triggerSerpProcessing(SidebarLoader, false, 'custom_link');

      await new Promise(resolve => setTimeout(resolve, 500));

      window.removeEventListener('message', listener);

      expect.assertions(2);
    });

    test('should dispatch one message when subtabsOnly is true', async () => {
      // Given
      SidebarLoader.sidebarTabs = [
        mockTab({ id: 'aug_1' }, 'https://www.google.com/'),
        mockTab({ id: 'aug_2' }, 'https://www.bing.com/'),
        mockTab({ id: 'aug_3' }, 'https://www.yahoo.com/'),
      ];
      SidebarLoader.customSearchEngine = {
        querySelector: {
          container: 'container',
          desktop: 'desktop',
          featured: ['featured'],
          pad: 'pad',
          phone: 'phone',
          result_container_selector: 'result',
        },
        search_engine_json: {
          required_params: [],
          required_prefix: '',
        }
      }

      const listener = ({ data }: any) => {
        if (data.name !== PROCESS_SERP_OVERLAY_MESSAGE) { return; }
        // Then
        expect(data).toStrictEqual ({
          augmentation: [
            SidebarLoader.sidebarTabs[0].augmentation,
            SidebarLoader.sidebarTabs[1].augmentation,
            SidebarLoader.sidebarTabs[2].augmentation,
          ],
          createdUrls: [
            'https://www.google.com/',
            'https://www.bing.com/',
            'https://www.yahoo.com/',
          ],
          name: PROCESS_SERP_OVERLAY_MESSAGE,
          selector: {
            container: 'result',
            featured: [ 'featured' ],
            link: 'phone',
          },
        });
      }

      window.addEventListener('message', listener);
  
      // When
      triggerSerpProcessing(SidebarLoader, true, 'custom_link');

      await new Promise(resolve => setTimeout(resolve, 500));

      window.removeEventListener('message', listener);

      expect.assertions(1);
    });

  });

  describe('compareTabs', () => {

    test('pinned tabs should have first priority', () => {
      // Given
      const tabs: SidebarTab[] = [
        mockTab({ id: 'some_id_0'}),
        mockTab({ id: AUGMENTATION_ID.TRUSTLIST }),
        mockTab({ id: AUGMENTATION_ID.REDDIT }),
        mockTab({ id: 'some_id_1', pinned: true }),
        mockTab({ id: AUGMENTATION_ID.HACKER_NEWS }),
      ];
  
      // When
      const sorted = tabs.sort((a, b) => compareTabs(a, b, []));

      // Then
      expect(sorted.length).toBe(5);
      expect(sorted[0].augmentation.id).toBe('some_id_1');
    });

    test('special cases should have third priority', () => {
      // Given
      const tabs: SidebarTab[] = [
        mockTab({ id: 'some_id_0' }),
        mockTab({ id: 'some_id_1' }),
        mockTab({ id: AUGMENTATION_ID.REDDIT }),
        mockTab({ id: 'some_id_2', pinned: true }),
        mockTab({ id: AUGMENTATION_ID.HACKER_NEWS }),
      ];
  
      // When
      const sorted = tabs.sort((a, b) => compareTabs(a, b, []));

      // Then
      expect(sorted.length).toBe(5);
      expect(sorted[0].augmentation.id).toBe('some_id_2');
      expect(sorted[1].augmentation.id).toBe(AUGMENTATION_ID.REDDIT);
      expect(sorted[2].augmentation.id).toBe(AUGMENTATION_ID.HACKER_NEWS);
    });

    test('augmentation with any condition should be low priority', () => {
      // Given
      const tabs: SidebarTab[] = [
        mockTab({ id: 'some_id_0', installed: true }),
        mockTab({ id: 'some_id_1' }),
        mockTab({ id: 'some_id_2', installed: true }),
        mockTab({ id: AUGMENTATION_ID.REDDIT }),
        mockTab({ id: 'some_id_3', pinned: true }),
        mockTab({ id: AUGMENTATION_ID.HACKER_NEWS }),
      ];

      tabs[0].augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.ANY_URL,
          unique_key: CONDITION_KEY.ANY_URL,
          label: CONDITION_LABEL.ANY_URL,
          value: ['.*'],
          type: 'regexp',
        }
      ];
  
      // When
      const sorted = tabs.sort((a, b) => compareTabs(a, b, []));

      // Then
      expect(sorted.length).toBe(6);
      expect(sorted[0].augmentation.id).toBe('some_id_3');
      expect(sorted[1].augmentation.id).toBe(AUGMENTATION_ID.REDDIT);
      expect(sorted[2].augmentation.id).toBe(AUGMENTATION_ID.HACKER_NEWS);
      expect(sorted[3].augmentation.id).toBe('some_id_2');
      expect(sorted[4].augmentation.id).toBe('some_id_1');
      expect(sorted[5].augmentation.id).toBe('some_id_0');
    });

    test('trust list should have last priority', () => {
      // Given
      const tabs: SidebarTab[] = [
        mockTab({ id: 'some_id_0' }),
        mockTab({ id: AUGMENTATION_ID.TRUSTLIST }),
        mockTab({ id: AUGMENTATION_ID.REDDIT }),
        mockTab({ id: 'some_id_1', pinned: true }),
        mockTab({ id: AUGMENTATION_ID.HACKER_NEWS }),
      ];
  
      // When
      const sorted = tabs.sort((a, b) => compareTabs(a, b, []));

      // Then
      expect(sorted.length).toBe(5);
      expect(sorted[4].augmentation.id).toBe(AUGMENTATION_ID.TRUSTLIST);
    });

  });

  test('removeProtocol', () => {
    // Given
    // Initial state

    // Then
    expect(removeProtocol('https://www.google.com/')).toBe('google.com/')
    expect(removeProtocol('https://www.yahoo.com/search')).toBe('yahoo.com/search')
    expect(removeProtocol('https://www4.bing.com/')).toBe('www4.bing.com/')
  });

  test('extractUrlProperties', () => {
    // Given
    // Initial state

    // Then
    expect(extractUrlProperties('https://www.google.com/')).toStrictEqual({
      full: 'google.com',
      fullWithParams: 'google.com/',
      hostname: 'google.com',
      params: [ '' ],
    });
    expect(extractUrlProperties('https://www.bing.com/search?query=1')).toStrictEqual({
      full: 'bing.com/search',
      fullWithParams: 'bing.com/search?query=1',
      hostname: 'bing.com',
      params: [ 'query' ],
    });
    expect(extractUrlProperties('https://sub.yahoo.com/search?query=1&other=2')).toStrictEqual({
      full: 'sub.yahoo.com/search',
      fullWithParams: 'sub.yahoo.com/search?query=1&other=2',
      hostname: 'sub.yahoo.com',
      params: [ 'query', 'other' ],
    });
  });

  test('extractPublication', () => {
    // Given
    // Initial state

    // Then
    expect(extractPublication('https://www.reddit.com/r/test?q=1')).toBe('reddit.com/r/test');
    expect(extractPublication('https://www.medium.com/@username/test')).toBe('medium.com/@username');
    expect(extractPublication('https://www.medium.com/test/0')).toBe('medium.com/test');
    expect(extractPublication('https://www.medium.com/tag/0')).toBe('medium.com');
    expect(extractPublication('https://www.dev.to/abc/0')).toBe('dev.to/abc');
    expect(extractPublication('https://www.dev.to/t/abc')).toBe('dev.to');
    expect(extractPublication('https://www.github.com/test')).toBe('github.com/test');
    expect(extractPublication('https://www.github.com/about')).toBe('github.com');
    expect(extractPublication('https://www.twitter.com/tag')).toBe('twitter.com/tag');
    expect(extractPublication('https://www.twitter.com/search')).toBe('twitter.com');
    expect(extractPublication('https://www.instagram.com/tag')).toBe('instagram.com/tag');
    expect(extractPublication('https://www.instagram.com/explore')).toBe('instagram.com');
  });

  test('removeTrailingSlash', () => {
    // Given
    // Initial state

    // Then
    expect(removeTrailingSlash('https://www.gogole.com/')).toBe('https://www.gogole.com')
  });

  test('encodeSpace', () => {
    // Given
    // Initial state

    // Then
    expect(encodeSpace('google .   com')).toBe('google[<INSIGHT_SPACE>].[<INSIGHT_SPACE>][<INSIGHT_SPACE>][<INSIGHT_SPACE>]com');
  });

  test('decodeSpace', () => {
    // Given
    // Initial state

    // Then
    expect(decodeSpace(encodeURIComponent('google[<INSIGHT_SPACE>].[<INSIGHT_SPACE>]com'))).toBe('google%20.%20com')
  });

  test('sanitizeUrl', () => {
    // Given

    // Then
    expect(sanitizeUrl('https://www.google.com')).toBe('https%3A%2F%2Fwww.google.com');
  });

  test('getUrlSlices', () => {
    // Given
    // Initial state

    // Then
    expect(getUrlSlices('https://www.reddit.com/t/test')).toStrictEqual([ 'reddit.com/t/test', 'reddit.com/t', 'reddit.com' ]);
  });

  test('makeEllipsis', () => {
    // Given
    // Initial state

    // Then
    expect(makeEllipsis('abcdefghij', 5)).toBe('abcde...');
    expect(makeEllipsis('abcdefghij', 1)).toBe('a...');
  });

  test('shouldPreventEventBubble', async () => {
    // Given
    const el1 = document.createElement('input');
    const el2 = document.createElement('div');
    const el3 = document.createElement('textarea');
    const el4 = document.createElement('span');
    const el5 = document.createElement('span');

    el5.setAttribute('contenteditable', 'true');

    const listener = (evt: KeyboardEvent) => {
      // Then
      if (evt.key === '1') {
        expect(shouldPreventEventBubble(evt)).toBe(true);
      } else if (evt.key === '2') {
        expect(shouldPreventEventBubble(evt)).toBe(false);
      } else if (evt.key === '3') {
        expect(shouldPreventEventBubble(evt)).toBe(true);
      } else if (evt.key === '4') {
        expect(shouldPreventEventBubble(evt)).toBe(false);
      } else {
        expect(shouldPreventEventBubble(evt)).toBe(true);
      }
    };

    el1.addEventListener('keydown', listener);
    el2.addEventListener('keydown', listener);
    el3.addEventListener('keydown', listener);
    el4.addEventListener('keydown', listener);
    el5.addEventListener('keydown', listener);

    el1.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    el2.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    el3.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    el4.dispatchEvent(new KeyboardEvent('keydown', { key: '4' }));
    el5.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }));

    await new Promise(resolve => setTimeout(resolve, 100));

    el1.removeEventListener('keydown', listener);
    el2.removeEventListener('keydown', listener);
    el3.removeEventListener('keydown', listener);
    el4.removeEventListener('keydown', listener);
    el5.removeEventListener('keydown', listener);

    expect.assertions(5);
  });

  test('removeEmoji', () => {
    // Given
    // Initial state

    // Then
    expect(removeEmoji('😀 emoji')).toBe(' emoji');
    expect(removeEmoji('emoji 😀 emoji')).toBe('emoji 😀 emoji');
    expect(removeEmoji('emoji 😀')).toBe('emoji 😀');
  });

  test('getFirstValidTabIndex', () => {
    // Given
    const tabs: SidebarTab[] = [
      mockTab({ id: 'some_id_1' }, SIDEBAR_TAB_FAKE_URL),
      mockTab({ id: 'some_id_1' }, SIDEBAR_TAB_FAKE_URL),
      mockTab({ id: 'some_id_1' }, 'https://www.google.com'),
      mockTab({ id: 'some_id_1' }, SIDEBAR_TAB_FAKE_URL),
    ];

    // Then
    expect(getFirstValidTabIndex(tabs)).toBe('3');
  });

  test('getLastValidTabIndex', () => {
    // Given
    const tabs: SidebarTab[] = [
      mockTab({ id: 'some_id_1' }, SIDEBAR_TAB_FAKE_URL),
      mockTab({ id: 'some_id_1' }, 'https://www.google.com'),
      mockTab({ id: 'some_id_1' }, SIDEBAR_TAB_FAKE_URL),
      mockTab({ id: 'some_id_1' }, 'https://www.google.com'),
    ];

    // Then
    expect(getLastValidTabIndex(tabs)).toBe('4');
  });

  test('getStoredUserSettings', async () => {
    // Given
    chrome.storage.sync.get.mockImplementation((keys, resolve) => {
      expect((keys as string[])[0]).toBe(SYNC_PRIVACY_KEY);
      resolve({});
    });

    // When
    await getStoredUserSettings();

    // Then
    expect(chrome.storage.sync.get).toBeCalled();
  });

  describe('processCookieString', () => {

    test('should do nothing if cookie contains __sso.key', () => {
      // Given
      // Initial state
  
      // When
      let header = processCookieString('cookie __sso.key');
  
      // Then
      expect(header).toBe('cookie __sso.key');
    });

    test('should append Secure and SameSite if it does not contain', () => {
      // Given
      // Initial state
  
      // When
      let header = processCookieString('cookie');
  
      // Then
      expect(header).toBe('cookie Secure SameSite=None');
    });

    test('should replace SameSite', () => {
      // Given
      // Initial state
  
      // When
      let header = processCookieString('cookie SameSite=some');
  
      // Then
      expect(header).toBe('cookie SameSite=None Secure');
    });

  });

  test('applyResponseHeaderModifications', () => {
    // Given
    const headers: chrome.webRequest.HttpHeader[] = STRIPPED_RESPONSE_HEADERS.map((h) => ({ name: h }));

    headers.push({ name: 'header-1' });
    headers.push({ name: 'set-cookie', value: 'cookie' });
    headers.push({ name: 'location', value: 'http://www.google.com/' });

    // Then
    expect(applyResponseHeaderModifications('https://www.google.com', headers)).toStrictEqual([
      {
        name: 'header-1',
      },
      {
        name: 'set-cookie',
        value: 'cookie Secure SameSite=None',
      },
      {
        name: 'location',
        value: 'https://www.google.com/',
      }
    ]);
  });

  describe('applyResponseHeaderModifications', () => {

    test('for frame 0', () => {
      // Given
      const headers: chrome.webRequest.HttpHeader[] = [
        { name: 'header-1' },
        { name: 'cookie', value: 'cookie' },
        { name: 'user-agent', value: 'ua' },
      ];
      const url = 'https://www.google.com?q=' + SPECIAL_URL_JUNK_STRING;
  
      // Then
      expect(applyRequestHeaderMutations(headers, url, 0)).toStrictEqual([
        {
          name: 'header-1',
        },
        {
          name: 'cookie',
          value: 'cookie',
        },
        {
          name: 'user-agent',
          value: 'ua',
        }
      ]);
    });

    test('for other frames', () => {
      // Given
      const headers: chrome.webRequest.HttpHeader[] = [
        { name: 'header-1' },
        { name: 'cookie', value: 'cookie' },
        { name: 'user-agent', value: 'ua' },
      ];
      const url = 'https://www.google.com?q=' + SPECIAL_URL_JUNK_STRING;
  
      // Then
      expect(applyRequestHeaderMutations(headers, url, 1)).toStrictEqual([
        {
          name: 'header-1',
        },
        {
          name: 'cookie',
          value: 'cookie Secure SameSite=None',
        },
        {
          name: 'user-agent',
          value: CUSTOM_UA_STRING,
        }
      ]);
    });

  });

});
