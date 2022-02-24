import { chrome } from 'jest-chrome';

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

})
