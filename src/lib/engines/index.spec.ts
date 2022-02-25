import { chrome } from 'jest-chrome';
import { CUSTOM_SEARCH_ENGINES, DEDICATED_ENGINE_PREFIX } from 'constant';

describe('Engines tests', () => {

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          google: {
            querySelector: {
              desktop: '#desktop_selector',
            },
            search_engine_json: {
              is_web_search: false,
              required_params: [ 'q' ],
              required_prefix: 'google.com/s',
              match_prefix: 'google\\.com\/s',
            }
          },
        }),
      })
    ) as any;
  });

  test('getEngines should match required prefix and params', async () => {
    // Given
    chrome.storage.sync.get.mockImplementation((_: any, cb: any) => cb?.({}));

    const Engines = require('lib/engines').default;

    // Adding delay so Engines getEngines finish
    await new Promise((r) => setTimeout(r, 100));

    // When
    const se1 = await Engines.getSearchEngineObject('https://www.google.com/path');

    // Then
    expect(se1.querySelector.desktop).toBe('');

    // When
    const se2 = await Engines.getSearchEngineObject('https://www.google.com/s');

    // Then
    expect(se2.querySelector.desktop).toBe('');

    // When
    const se3 = await Engines.getSearchEngineObject('https://www.google.com/s?q=query');

    // Then
    expect(se3.querySelector.desktop).toBe('#desktop_selector');
  });

  test('sync should delete bad engines', async () => {
    // Given
    chrome.storage.sync.get.mockImplementation((param1: any) => {
      param1({
        [`${ DEDICATED_ENGINE_PREFIX }-1`]: {},
        [`${ DEDICATED_ENGINE_PREFIX }-2`]: {
          querySelector: {},
        },
        [`${ DEDICATED_ENGINE_PREFIX }-3`]: {
          search_engine_json: {},
        },
        [`${ DEDICATED_ENGINE_PREFIX }-4`]: {
          querySelector: {
            desktop: '#desktop_selector',
          },
          search_engine_json: {
            is_web_search: false,
              required_params: [ 'q' ],
              required_prefix: 'bing.com/s',
              match_prefix: 'bing\\.com\/s',
          },
        },
        [`${ DEDICATED_ENGINE_PREFIX }-5`]: {
          querySelector: {
            desktop: 'outdated-selector',
          },
          search_engine_json: {
            is_web_search: false,
              required_params: [ 'q' ],
              required_prefix: 'bing.com/s',
              match_prefix: 'bing\\.com\/s',
          },
        },
        [`${ DEDICATED_ENGINE_PREFIX }-6`]: {
          querySelector: {
            desktop: '#desktop_selector',
          },
          search_engine_json: {
            is_web_search: false,
            required_params: [ 'outdated-q' ],
            required_prefix: 'bing.com/s',
            match_prefix: 'bing\\.com\/s',
          },
        },
      });
    });
    chrome.storage.sync.remove.mockImplementation((key: any, cb: any) => {
      expect(key).not.toBe('dedicated-serp-4');
      cb();
    });

    expect.assertions(7);

    const Engines = require('lib/engines').default;

    // Adding delay so Engines getEngines finish
    await new Promise((r) => setTimeout(r, 100));

    const spy = jest.fn((url: string) => {
      expect(url).toBe(CUSTOM_SEARCH_ENGINES);
      return {
        json: () => ({
          bing: {
            querySelector: {
              desktop: '#desktop_selector',
            },
            search_engine_json: {
              is_web_search: false,
              required_params: [ 'q' ],
              required_prefix: 'bing.com/s',
              match_prefix: 'bing\\.com\/s',
            }
          },
        }),
      };
    });
    (global.fetch as any) = spy;

    // When
    await Engines.sync();

    // Then
    expect(spy).toHaveBeenCalled();
  });

})
