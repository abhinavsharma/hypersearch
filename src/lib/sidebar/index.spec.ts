import { ACTION_KEY, ACTION_LABEL, ANY_URL_CONDITION_TEMPLATE } from 'constant';
import { chrome } from 'jest-chrome';
import SidebarLoader from '.';

const mockAugmentation = (actions: ActionObject[], conditions: ConditionObject[]): Augmentation => {
  return {
    id: '',
    name: '',
    description: '',
    actions: {
      action_list: actions,
    },
    conditions: {
      condition_list: conditions,
      evaluate_with: 'AND',
    },
  };
};

describe('Sidebar tests', () => {

  test('getDomains', () => {
    // Given
    const element = document.createElement('div');
    element.innerHTML = `
      <span>Span</span>
      <div>
        <a class="target" href="https://www.google.com/">Link 1</a>
        <a href="https://www.apple.com/">Link 2</a>
      </div>
      <button>Button</button>
      <a class="target" href="https://www.yahoo.com/">Link 3</a>
    `;

    document.body.appendChild(element);

    SidebarLoader.customSearchEngine = {
      querySelector: {
        desktop: '.target',
        container: '',
        featured: [],
        pad: '',
        phone: '',
        result_container_selector: '',
      },
      search_engine_json: {
        required_params: [],
        required_prefix: '',
      }
    }

    // When
    const domains = SidebarLoader.getDomains(document, false);

    // Then
    expect(domains).toStrictEqual([ 'google.com/', 'yahoo.com/' ]);
  });

  describe('getTabUrls', () => {

    beforeEach(() => {
      SidebarLoader.url = new URL('https://www.google.com');
      SidebarLoader.publicationSlices = {
        original: [],
      } as any;
    });

    test('', async () => {
      // Given
      chrome.storage.local.get.mockImplementation((_: any, cb: any) => cb?.({}))

      SidebarLoader.query = 'some-query';
      const se = {
        required_params: ['q'],
        required_prefix: 'https://www.url.com/search',
      };
      const augmentations: Augmentation[] = [
        mockAugmentation([
          {
            key: ACTION_KEY.OPEN_URL,
            label: ACTION_LABEL.OPEN_URL,
            type: 'string',
            value: [ 'https://www.apple.com/' ],
          },
          {
            key: ACTION_KEY.SEARCH_ALSO,
            label: ACTION_LABEL.SEARCH_ALSO,
            type: 'string',
            value: [ se ],
          },
        ], [ ANY_URL_CONDITION_TEMPLATE ])
      ];

      // When
      const tabs = await SidebarLoader.getTabsAndAugmentations(augmentations);

      // Then
      expect(tabs.length).toBe(2);
      expect(tabs[0].url.href).toBe('https://url.com/search?q=some-query&qhfabdyvaykdf=qhfabdyvaykdf');
      expect(tabs[1].url.href).toBe('https://apple.com/?insight-possible-serp-result=insight-possible-serp-result&qhfabdyvaykdf=qhfabdyvaykdf&insight-tab-title=apple.com');
    });

  });

})
