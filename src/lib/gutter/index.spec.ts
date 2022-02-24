import { INSIGHT_BLOCKED_BY_SELECTOR, INSIGHT_FEATURED_BY_SELECTOR, INSIGHT_HAS_CREATED_SUBTAB_SELECTOR, INSIGHT_RESULT_URL_SELECTOR, INSIGHT_SEARCHED_DOMAIN_SELECTOR, INSIGHT_SEARCH_BY_SELECTOR } from "constant";
import { processSerpResults } from ".";

describe.only('Gutter tests', () => {

  beforeEach(() => {
    (global.matchMedia as any) = () => false;
  });

  test('processSerpResults with basic attributes', async () => {
    // Given
    const wrapper1 = document.createElement('div');
    const node1 = document.createElement('a');
    node1.href = 'https://www.google.com/';
    node1.id = 'node-1';

    wrapper1.appendChild(node1);

    // When
    processSerpResults(
      [ node1 ],
      '#node-1',
      {
        header: 'Ad',
        text: 'Click to show likely ad.',
        selectorString: 'blocked-ad',
      },
      null,
    )

    // Then
    expect(node1.getAttribute(INSIGHT_RESULT_URL_SELECTOR)).toBe('https://www.google.com/');
    expect(node1.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR)).toBe('false');
    expect(node1.getAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR)).toBe('google.com');
    expect(node1.getAttribute(INSIGHT_BLOCKED_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_SEARCH_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_FEATURED_BY_SELECTOR)).toBe('');
  });

  test('processSerpResults with created URLs', async () => {
    // Given
    const wrapper1 = document.createElement('div');
    const node1 = document.createElement('a');
    node1.href = 'https://www.google.com/';
    node1.id = 'node-1';

    wrapper1.appendChild(node1);

    // When
    processSerpResults(
      [ node1 ],
      '#node-1',
      {
        header: 'Ad',
        text: 'Click to show likely ad.',
        selectorString: 'blocked-ad',
      },
      null,
      [ 'https://www.bing.com/', 'https://www.google.com/' ]
    )

    // Then
    expect(node1.getAttribute(INSIGHT_RESULT_URL_SELECTOR)).toBe('https://www.google.com/');
    expect(node1.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR)).toBe('true');
    expect(node1.getAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR)).toBe('google.com');
    expect(node1.getAttribute(INSIGHT_BLOCKED_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_SEARCH_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_FEATURED_BY_SELECTOR)).toBe('');
  });

  test('processSerpResults with feature augmentations', async () => {
    // Given
    const wrapper1 = document.createElement('div');
    const node1 = document.createElement('a');
    node1.href = 'https://www.google.com/';
    node1.id = 'node-1';

    wrapper1.appendChild(node1);

    // When
    processSerpResults(
      [ node1 ],
      '#node-1',
      {
        header: 'Ad',
        text: 'Click to show likely ad.',
        selectorString: 'blocked-ad',
      },
      {
        block: {
          'google.com': [],
        },
        feature: {
          'google.com': [
            {
              id: 'some-id-1',
              name: 'some-name',
              actions: {
                action_list: []
              },
              conditions: {
                condition_list: [],
                evaluate_with: 'AND',
              },
              description: 'some-desc',
            },
            {
              id: 'some-id-2',
              name: 'some-name',
              actions: {
                action_list: []
              },
              conditions: {
                condition_list: [],
                evaluate_with: 'AND',
              },
              description: 'some-desc',
            }
          ]
        },
        search: {
          'google.com': [],
        },
      },
      []
    )

    // Then
    expect(node1.getAttribute(INSIGHT_RESULT_URL_SELECTOR)).toBe('https://www.google.com/');
    expect(node1.getAttribute(INSIGHT_HAS_CREATED_SUBTAB_SELECTOR)).toBe('false');
    expect(node1.getAttribute(INSIGHT_SEARCHED_DOMAIN_SELECTOR)).toBe('google.com');
    expect(node1.getAttribute(INSIGHT_BLOCKED_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_SEARCH_BY_SELECTOR)).toBe('');
    expect(node1.getAttribute(INSIGHT_FEATURED_BY_SELECTOR)).toBe('some-id-1 some-id-2');
  });

})
