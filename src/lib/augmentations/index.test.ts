import { chrome } from 'jest-chrome';

import AugmentationManager from 'lib/augmentations';
import SidebarLoader from 'lib/sidebar';
import SearchEngineManager from 'lib/engines';
import {
  ACTION_KEY,
  ACTION_LABEL,
  ANY_SEARCH_ENGINE_CONDITION_TEMPLATE,
  ANY_URL_CONDITION_TEMPLATE,
  AUGMENTATION_ID,
  CONDITION_KEY,
  CONDITION_LABEL,
  EXTENSION_SHARE_URL,
  LEGACY_CONDITION_TYPE,
  MY_TRUSTLIST_TEMPLATE,
  UPDATE_SIDEBAR_TABS_MESSAGE,
} from 'constant';

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
}

describe('AugmentationManager tests', () => {

  test('isAugmentationEnabled', () => {
    // Given
    const conditions = Object.values(CONDITION_KEY);
    const actions = Object.values(ACTION_KEY);

    conditions.forEach((condition) => {
      // When
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: condition,
          unique_key: condition,
          value: [ 'google(\\.\\w+)' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      // Then
      expect(AugmentationManager.isAugmentationEnabled(augmentation)).toBe(true);
    });

    actions.forEach((action) => {
      // When
      const augmentation = mockAugmentation();
      augmentation.actions.action_list = [
        {
          key: action,
          value: [ 'https://www.google.com/' ],
          label: ACTION_LABEL.OPEN_URL,
          type: 'string',
        }
      ];

      // Then
      if (ACTION_KEY.INJECT_JS === action) {
        expect(AugmentationManager.isAugmentationEnabled(augmentation)).toBe(false);  
      } else {
        expect(AugmentationManager.isAugmentationEnabled(augmentation)).toBe(true);
      }
    });
  });

  test('updateBlockList', () => {
    // Given
    SidebarLoader.installedAugmentations = [{
      id: AUGMENTATION_ID.BLOCKLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [],
      },
      enabled: true,
    }];
    SidebarLoader.otherAugmentations = [];

    // When
    AugmentationManager.updateBlockList('google.com');

    // Then
    expect(SidebarLoader.installedAugmentations[0]).toStrictEqual({
      id: AUGMENTATION_ID.BLOCKLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [{
          key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
          label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
          type: LEGACY_CONDITION_TYPE.LIST,
          value: [ 'google.com' ],
        }],
      },
      enabled: true,
      installed: true,
    });
  });

  test('deleteFromBlockList', () => {
    // Given
    SidebarLoader.installedAugmentations = [{
      id: AUGMENTATION_ID.BLOCKLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [
          {
            key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
            label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
            type: LEGACY_CONDITION_TYPE.LIST,
            value: [ 'bing.com' ],
          },
          {
            key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
            label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
            type: LEGACY_CONDITION_TYPE.LIST,
            value: [ 'google.com' ],
          },
          {
            key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
            label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
            type: LEGACY_CONDITION_TYPE.LIST,
            value: [ 'google.com.br' ],
          },
        ],
      },
      enabled: true,
    }];
    SidebarLoader.otherAugmentations = [];

    // When
    AugmentationManager.deleteFromBlockList('google.com')

    // Then
    expect(SidebarLoader.installedAugmentations[0]).toStrictEqual({
      id: AUGMENTATION_ID.BLOCKLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [
          {
            key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
            label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
            type: LEGACY_CONDITION_TYPE.LIST,
            value: [ 'bing.com' ],
          },
          {
            key: ACTION_KEY.SEARCH_HIDE_DOMAIN,
            label: ACTION_LABEL.SEARCH_HIDE_DOMAIN,
            type: LEGACY_CONDITION_TYPE.LIST,
            value: [ 'google.com.br' ],
          },
        ],
      },
      enabled: true,
      installed: true,
    });
  });

  test('toggleTrustlist', () => {
    // Given
    SidebarLoader.installedAugmentations = [{
      id: AUGMENTATION_ID.TRUSTLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [
          {
            ...MY_TRUSTLIST_TEMPLATE.actions.action_list[0],
            value: [ 'bing.com' ],
          },
        ],
      },
      enabled: true,
    }];
    SidebarLoader.otherAugmentations = [];

    // When
    AugmentationManager.toggleTrustlist('google.com')

    // Then
    expect(SidebarLoader.installedAugmentations[0]).toStrictEqual({
      id: AUGMENTATION_ID.TRUSTLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [
          {
            ...MY_TRUSTLIST_TEMPLATE.actions.action_list[0],
            value: [ 'bing.com', 'google.com' ],
          },
        ],
      },
      enabled: true,
      installed: true,
    });

    // When
    AugmentationManager.toggleTrustlist('bing.com')

    // Then
    expect(SidebarLoader.installedAugmentations[0]).toStrictEqual({
      id: AUGMENTATION_ID.TRUSTLIST,
      name: 'name',
      description: 'des',
      conditions: {
        condition_list: [ANY_URL_CONDITION_TEMPLATE],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [
          {
            ...MY_TRUSTLIST_TEMPLATE.actions.action_list[0],
            value: [ 'google.com' ],
          },
        ],
      },
      enabled: true,
      installed: true,
    });
  });

  describe('processOpenPageActionString', () => {

    test('Should remove www', () => {
      // Given
      SidebarLoader.query = 'some_query';
    
      // Then
      const url = AugmentationManager.processOpenPageActionString('https://www.google.com/', []);
    
      expect(url.href).toBe('https://google.com/');
    });

    test('Should replace %s by the query', () => {
      // Given
      SidebarLoader.query = 'some_query';
    
      // Then
      const url = AugmentationManager.processOpenPageActionString('https://www.google.com/s?q=%s', []);
    
      expect(url.href).toBe('https://google.com/s?q=some_query');
    });

    test('Should replace %sr by search results', () => {
      // Given
      SidebarLoader.query = 'some_query';
      SidebarLoader.publicationSlices = {
        'original': [
          'https://first.com',
          'https://second.com',
          'https://third.com',
        ],
      } as any;
    
      // Then
      const url = AugmentationManager.processOpenPageActionString('https://www.google.com/s?q=%sr&q2=%sr3&q3=%sr', []);
    
      expect(url.href).toBe('https://google.com/s?q=https://first.com&q2=https://third.com&q3=https://first.com');
    });

    test('Should replace %m by groups', () => {
      // Given
      SidebarLoader.query = 'some_query';

      // Then
      const url = AugmentationManager.processOpenPageActionString('https://www.google.com/s?q=%m1&q2=%m2&q3=%m3&q4=%m', [ 'g1', 'g2', 'g3' ]);
    
      expect(url.href).toBe('https://google.com/s?q=g1&q2=g2&q3=g3&q4=g1');
    });

    test('Should replace %d by page hostname', () => {
      // Given
      SidebarLoader.url = new URL('https://www.bing.com/');

      // Then
      const url = AugmentationManager.processOpenPageActionString('https://www.google.com/s?q=%d', []);
    
      expect(url.href).toBe('https://google.com/s?q=www.bing.com');
    });

  });

  test('processSearchAlsoActionString', () => {
    // Given
    SidebarLoader.query = 'some_query';
  
    // Then
    const url = AugmentationManager.processSearchAlsoActionString({
        required_params: ['q'],
        required_prefix: 'google.com/search',
    });
  
    expect(url.href).toBe('https://google.com/search?q=some_query');
  });
  
  test('disableSuggestedAugmentation', () => {
    chrome.runtime.sendMessage.mockImplementation((message) => {
      expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    });

    const augmentation1 = mockAugmentation('some_id_1');
    const augmentation2 = mockAugmentation('some_id_2');
    const augmentation3 = mockAugmentation('some_id_3');

    SidebarLoader.ignoredAugmentations = [];
    SidebarLoader.pinnedAugmentations = [ augmentation1, augmentation2 ];
    SidebarLoader.suggestedAugmentations = [ augmentation2, augmentation3 ];

    AugmentationManager.disableSuggestedAugmentation(augmentation2);
  
    expect(chrome.runtime.sendMessage).toBeCalled();
    expect(SidebarLoader.ignoredAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_2' ])
    expect(SidebarLoader.pinnedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
    expect(SidebarLoader.suggestedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_3' ]);
  });

  describe('enableSuggestedAugmentation', () => {

    beforeEach(() => {
      SidebarLoader.pinnedAugmentations = [];
      SidebarLoader.suggestedAugmentations = [];
    });

    test('Should add pinned augmentation back', () => {
      chrome.runtime.sendMessage.mockImplementation((message) => {
        expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      });
  
      const augmentation = mockAugmentation('some_id_1');
      augmentation.pinned = true;
  
      SidebarLoader.url = new URL('https://www.google.com');
      SidebarLoader.ignoredAugmentations = [ augmentation ];

      AugmentationManager.enableSuggestedAugmentation(augmentation);
    
      expect(chrome.runtime.sendMessage).toBeCalled();
      expect(SidebarLoader.ignoredAugmentations.length).toBe(0);
      expect(SidebarLoader.pinnedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
      expect(SidebarLoader.suggestedAugmentations.length).toBe(0);
    });
  
    test('Should add non pinned augmentation as suggestion', () => {
      chrome.runtime.sendMessage.mockImplementation((message) => {
        expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      });
  
      const augmentation = mockAugmentation('some_id_1');
      augmentation.pinned = false;
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.ANY_URL,
          unique_key: CONDITION_KEY.ANY_URL,
          value: [ 'google.com' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];
  
      SidebarLoader.ignoredAugmentations = [ augmentation ];
  
      AugmentationManager.enableSuggestedAugmentation(augmentation);
    
      expect(chrome.runtime.sendMessage).toBeCalled();
      expect(SidebarLoader.ignoredAugmentations.length).toBe(0);
      expect(SidebarLoader.pinnedAugmentations.length).toBe(0);
      expect(SidebarLoader.suggestedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
    });

  });

  describe('pinAugmentation', () => {

    beforeEach(() => {
      SidebarLoader.pinnedAugmentations = [];
      SidebarLoader.enabledOtherAugmentations = [];
    });

    test('Should add non pinned augmentation to pinned augmentations', () => {
      chrome.runtime.sendMessage.mockImplementation((message) => {
        expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      });
  
      const augmentation = mockAugmentation('some_id_1');
      augmentation.pinned = false;
  
      SidebarLoader.installedAugmentations = [ augmentation ];
      SidebarLoader.suggestedAugmentations = [];
  
      AugmentationManager.pinAugmentation(augmentation);
    
      expect(chrome.runtime.sendMessage).toBeCalled();
      expect(SidebarLoader.pinnedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
      expect(SidebarLoader.enabledOtherAugmentations.length).toBe(0);
    });
  
    test('Should add non pinned and non installed/suggestion augmentation to pinned augmentations', () => {
      chrome.runtime.sendMessage.mockImplementation((message) => {
        expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      });
  
      const augmentation = mockAugmentation('some_id_1');
      augmentation.pinned = false;
  
      SidebarLoader.installedAugmentations = [];
      SidebarLoader.suggestedAugmentations = [];
  
      AugmentationManager.pinAugmentation(augmentation);
    
      expect(chrome.runtime.sendMessage).toBeCalled();
      expect(SidebarLoader.pinnedAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
      expect(SidebarLoader.enabledOtherAugmentations.map((a) => a.id)).toStrictEqual([ 'some_id_1' ]);
    });

  })
  
  test('unpinAugmentation should remove augmentation from pinned and enabledOther augmentations', () => {
    chrome.runtime.sendMessage.mockImplementation((message) => {
      expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    });

    const augmentation = mockAugmentation('some_id_1');

    SidebarLoader.pinnedAugmentations = [ augmentation ];
    SidebarLoader.enabledOtherAugmentations = [ augmentation ];

    AugmentationManager.unpinAugmentation(augmentation);
  
    expect(chrome.runtime.sendMessage).toBeCalled();
    expect(SidebarLoader.pinnedAugmentations.length).toBe(0);
    expect(SidebarLoader.enabledOtherAugmentations.length).toBe(0);
  });

  test('removeInstalledAugmentation', () => {
    chrome.runtime.sendMessage.mockImplementation((message) => {
      expect(message).toStrictEqual({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
    });

    const augmentation = mockAugmentation('some_id_1');

    SidebarLoader.installedAugmentations = [ augmentation ];
    SidebarLoader.pinnedAugmentations = [ augmentation ];
    SidebarLoader.enabledOtherAugmentations = [ augmentation ];

    AugmentationManager.removeInstalledAugmentation(augmentation);
  
    expect(chrome.runtime.sendMessage).toBeCalled();
    expect(SidebarLoader.installedAugmentations.length).toBe(0);
    expect(SidebarLoader.pinnedAugmentations.length).toBe(0);
    expect(SidebarLoader.enabledOtherAugmentations.length).toBe(0);
  });

  describe('getAugmentationRelevancy', () => {

    test('Should return empty object when augmentation has no actions or conditions', () => {
      // Given
      let augmentation: any = {
        id: 'some_id',
        name: 'some_name',
        description: '',
        actions: {
          action_list: [],
        },
      };
      
      // Then
      expect(AugmentationManager.getAugmentationRelevancy(augmentation)).toStrictEqual(Object.create(null));

      // When
      augmentation = {
        id: 'some_id',
        name: 'some_name',
        description: '',
        conditions: {
          evaluate_with: 'OR',
          condition_list: [],
        },
      };
      
      // Then
      expect(AugmentationManager.getAugmentationRelevancy(augmentation)).toStrictEqual(Object.create(null));
    });

    test('With any url condition should be relevant', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.ANY_URL,
          unique_key: CONDITION_KEY.ANY_URL,
          value: [ 'google.com' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];
      
      // Then
      const relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With url equals condition should be relevant to specific url', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.URL_EQUALS,
          unique_key: CONDITION_KEY.URL_EQUALS,
          value: [ 'https://google.com/' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      SidebarLoader.url = new URL('https://www.some.url/');
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.url = new URL('https://google.com/');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With url matches condition should be relevant to matching url', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.URL_MATCHES,
          unique_key: CONDITION_KEY.URL_MATCHES,
          value: [ 'google(\\.\\w+)(\\.\\w+)?\/s' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      SidebarLoader.url = new URL('https://google.com.br/s');
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://google.de/s');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://google.com.com.com/s');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);
    });

    test('With domain equals condition should be relevant to specific domain', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.DOMAIN_EQUALS,
          unique_key: CONDITION_KEY.URL_MATCHES,
          value: [ 'google.com' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      SidebarLoader.url = new URL('https://google.com/search');
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://google.de/search');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.url = new URL('https://google.com.br/');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With domain matches condition should be relevant to matching domains', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.DOMAIN_MATCHES,
          unique_key: CONDITION_KEY.DOMAIN_MATCHES,
          value: [ 'google(\\.\\w+)' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      SidebarLoader.url = new URL('https://google.com.br/search');
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://google.de/search');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://googler.com/search');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);
    });

    test('With domain contains condition should be relevant to domains array', () => {
      // Given
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.DOMAIN_CONTAINS,
          unique_key: CONDITION_KEY.DOMAIN_CONTAINS,
          value: [ 'google.com', 'bing.com' ],
          label: CONDITION_LABEL.ANY_URL,
          type: 'string',
        }
      ];

      SidebarLoader.url = new URL('https://google.com/search');
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://bing.com/search');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);

      // When
      SidebarLoader.url = new URL('https://wikipedia.org/');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);
    });

    test('With any search engine condition should be relevant in serp only', () => {
      // When
      SidebarLoader.isSerp = false;
      
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.ANY_SEARCH_ENGINE,
          unique_key: CONDITION_KEY.ANY_SEARCH_ENGINE,
          value: [],
          label: CONDITION_LABEL.ANY_SEARCH_ENGINE,
          type: 'regexp',
        }
      ];
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.isSerp = true;
      SidebarLoader.url = new URL('https://www.google.com/');

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search contains condition should be relevant for any of given domains', () => {
      // Given
      SidebarLoader.domains = [ 'url.com', 'google.com' ];
      
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.SEARCH_CONTAINS,
          unique_key: CONDITION_KEY.SEARCH_CONTAINS,
          value: [ 'domain1.com', 'domain2.org' ],
          label: CONDITION_LABEL.SEARCH_CONTAINS,
          type: 'list',
        }
      ];
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition.includes('domain1.com')).toBe(true);
      expect(relevancy.domainsToLookCondition.includes('domain2.org')).toBe(true);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.domains = [ 'domain1.com', 'google.com' ];

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search contains condition should use escaped string', () => {
      // Given
      SidebarLoader.url = new URL('https://www.google.com');
      SidebarLoader.domains = [
        'cdc.gov/meningitis/index.html#:~:text=Meningitis%20is%20an%20inflammation%20(swelling,infections%20also%20can%20cause%20meningitis.'
      ];
      
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.SEARCH_CONTAINS,
          unique_key: CONDITION_KEY.SEARCH_CONTAINS,
          value: [ 'cdc.gov' ],
          label: CONDITION_LABEL.SEARCH_CONTAINS,
          type: 'list',
        }
      ];
      
      // Then
      const relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search query condition should be relevant for given query', () => {
      // Given
      SidebarLoader.query = 'query1%20query2';
      
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.SEARCH_QUERY_CONTAINS,
          unique_key: CONDITION_KEY.SEARCH_QUERY_CONTAINS,
          value: [ 'query4' ],
          label: CONDITION_LABEL.SEARCH_QUERY_CONTAINS,
          type: 'list',
        }
      ];
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.query = 'query3%20query4';

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search intent is condition should be relevant for relevant domains', () => {
      // Given
      SearchEngineManager.intents = [{
        intent_id: 'news_us',
        sites: 'foxnews.com,politico.com,cbsnews.com',
      }] as any;

      SidebarLoader.publicationSlices['original'] = [ 'cdc.gov', 'mayoclinic.org', 'webmd.com' ];
      
      const augmentation = mockAugmentation();
      augmentation.conditions.condition_list = [
        {
          key: CONDITION_KEY.SEARCH_INTENT_IS,
          unique_key: CONDITION_KEY.SEARCH_INTENT_IS,
          value: [ 'news_us' ],
          label: CONDITION_LABEL.SEARCH_INTENT_IS,
          type: 'list',
        }
      ];
      
      // Then
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      // When
      SidebarLoader.publicationSlices['original'] = [ 'nbcnews.com', 'foxnews.com', 'somenews.com' ];

      // Then
      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.matchingIntent).toStrictEqual([ 'foxnews.com' ]);
      expect(relevancy.isRelevant).toBe(true);
    });

  });

  test('shareAugmentation', () => {
    // Given
    const param = 'param#%'
    const spy = jest.fn((url: string) => {
      expect(url).toBe(`${EXTENSION_SHARE_URL}${encodeURIComponent(param)}`)
    });

    (global.fetch as any) = spy;

    // When
    AugmentationManager.shareAugmentation(param);

    // Then
    expect(spy).toBeCalled();
  });

  describe('addOrEditAugmentation', () => {

    const augmentation: Augmentation = {
      id: 'some-id',
      name: 'some-name',
      description: 'some-desc',
      conditions: {
        condition_list: [],
        evaluate_with: 'AND',
      },
      actions: {
        action_list: [],
      },
      enabled: false,
    };

    beforeEach(() => {
      augmentation.enabled = true;
      SidebarLoader.installedAugmentations = [];
      SidebarLoader.otherAugmentations = [];
      SidebarLoader.ignoredAugmentations = [];
    });

    describe('add augmentation', () => {

      test('should add to ignored if not relevant and not enabled', () => {
        // Given
        augmentation.enabled = false;
  
        SidebarLoader.installedAugmentations = [];
        SidebarLoader.otherAugmentations = [];
        SidebarLoader.ignoredAugmentations = [];
  
        // When
        AugmentationManager.addOrEditAugmentation(augmentation, {});
  
        // Then
        expect(SidebarLoader.installedAugmentations).toStrictEqual([]);
        expect(SidebarLoader.otherAugmentations).toStrictEqual([]);
        expect(SidebarLoader.ignoredAugmentations.length).toBe(1);
        expect(SidebarLoader.ignoredAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);
      });

      test('should add to other if not relevant and enabled', () => {
        // Given
        augmentation.enabled = true;
  
        SidebarLoader.installedAugmentations = [];
        SidebarLoader.otherAugmentations = [];
        SidebarLoader.ignoredAugmentations = [];
  
        // When
        AugmentationManager.addOrEditAugmentation(augmentation, {});
  
        // Then
        expect(SidebarLoader.installedAugmentations).toStrictEqual([]);
        expect(SidebarLoader.ignoredAugmentations).toStrictEqual([]);
        expect(SidebarLoader.otherAugmentations.length).toBe(1);
        expect(SidebarLoader.otherAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);
      });

      test('should add to installed if relevant', () => {
        // Given
        augmentation.conditions.condition_list = [ANY_URL_CONDITION_TEMPLATE];
  
        SidebarLoader.installedAugmentations = [];
        SidebarLoader.otherAugmentations = [];
        SidebarLoader.ignoredAugmentations = [];
  
        // When
        AugmentationManager.addOrEditAugmentation(augmentation, {});
  
        // Then
        expect(SidebarLoader.installedAugmentations.length).toBe(1);
        expect(SidebarLoader.installedAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);
        expect(SidebarLoader.ignoredAugmentations).toStrictEqual([]);
        expect(SidebarLoader.otherAugmentations).toStrictEqual([]);
      });

    });

    test('activate augmentation', () => {
      // Given
      augmentation.enabled = false;

      AugmentationManager.addOrEditAugmentation(augmentation, {});
      expect(SidebarLoader.installedAugmentations.length).toBe(0);
      expect(SidebarLoader.ignoredAugmentations.length).toBe(1);
      expect(SidebarLoader.ignoredAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);

      // When
      AugmentationManager.addOrEditAugmentation(SidebarLoader.ignoredAugmentations[0], {
        isActive: true,
      });

      // Then
      expect(SidebarLoader.ignoredAugmentations.length).toBe(0);
      expect(SidebarLoader.installedAugmentations.length).toBe(1);
      expect(SidebarLoader.installedAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);
    });

    test('edit augmentation', () => {
      // Given
      augmentation.actions.action_list = [
        {
          key: ACTION_KEY.OPEN_URL,
          label: ACTION_LABEL.OPEN_URL,
          type: 'string',
          value: [ 'https://www.google.com/' ],
        }
      ];

      AugmentationManager.addOrEditAugmentation(augmentation, {});
      expect(SidebarLoader.installedAugmentations[0].id).toMatch(/^cse-custom-some-id.+/);
      expect(SidebarLoader.installedAugmentations[0].name).toBe('some-name');
      expect(SidebarLoader.installedAugmentations[0].description).toBe('some-desc');
      expect(SidebarLoader.installedAugmentations[0].conditions.evaluate_with).toBe('AND');

      // When
      AugmentationManager.addOrEditAugmentation(SidebarLoader.installedAugmentations[0], {
        name: 'new-name',
        description: 'new-desc',
        conditionEvaluation: 'OR',
        actions: [
          {
            key: ACTION_KEY.SEARCH_DOMAINS,
            label: ACTION_LABEL.SEARCH_DOMAINS,
            type: 'string',
            value: [ 'bing.com' ],
          }
        ],
        conditions: [ANY_SEARCH_ENGINE_CONDITION_TEMPLATE],
      });

      // Then
      const edited = SidebarLoader.installedAugmentations[0];

      expect(SidebarLoader.installedAugmentations.length).toBe(1);
      expect(edited.id).toMatch(/^cse-custom-some-id.+/);
      expect(edited.name).toBe('new-name');
      expect(edited.description).toBe('new-desc');
      expect(edited.conditions.evaluate_with).toBe('OR');
      expect(edited.conditions.condition_list).toStrictEqual([ ANY_SEARCH_ENGINE_CONDITION_TEMPLATE ]);
      expect(edited.actions.action_list).toStrictEqual([{
        key: ACTION_KEY.SEARCH_DOMAINS,
        label: ACTION_LABEL.SEARCH_DOMAINS,
        type: 'string',
        value: [ 'bing.com' ],
      }]);
    });

  });

})
