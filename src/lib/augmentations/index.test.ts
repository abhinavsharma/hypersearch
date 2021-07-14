import { chrome } from 'jest-chrome';

import AugmentationManager from 'lib/augmentations';
import SidebarLoader from 'lib/sidebar';
import SearchEngineManager from 'lib/engines';
import { CONDITION_KEY, CONDITION_LABEL, UPDATE_SIDEBAR_TABS_MESSAGE } from 'constant';

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

  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({})) as any;
  })

  test('processSearchAlsoActionString', () => {
    SidebarLoader.query = 'some_query';
  
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

    test('Should return empty object when augmentatio has no actions or conditions', () => {
      let augmentation: any = {
        id: 'some_id',
        name: 'some_name',
        description: '',
        actions: {
          action_list: [],
        },
      };
      
      expect(AugmentationManager.getAugmentationRelevancy(augmentation)).toStrictEqual(Object.create(null));

      augmentation = {
        id: 'some_id',
        name: 'some_name',
        description: '',
        conditions: {
          evaluate_with: 'OR',
          condition_list: [],
        },
      };
      
      expect(AugmentationManager.getAugmentationRelevancy(augmentation)).toStrictEqual(Object.create(null));
    });

    test('With any url condition should be relevant', () => {
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
      
      const relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.hasPreventAutoexpand).toBe(false);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With any search engine condition should be relevant in serp only', () => {
      SidebarLoader.isSerp = false;
      SidebarLoader.url = new URL('https://www.some.url/');
      
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
      
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(false);

      SidebarLoader.isSerp = true;
      SidebarLoader.url = new URL('https://www.google.com/');

      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search contains condition should be relevant for any of given domains', () => {
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
      
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition.includes('domain1.com')).toBe(true);
      expect(relevancy.domainsToLookCondition.includes('domain2.org')).toBe(true);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.hasPreventAutoexpand).toBe(false);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      SidebarLoader.domains = [ 'domain1.com', 'google.com' ];

      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search contains condition should use escaped string', () => {
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
      
      const relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search query condition should be relevant for given query', () => {
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
      
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.hasPreventAutoexpand).toBe(false);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      SidebarLoader.query = 'query3%20query4';

      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.isRelevant).toBe(true);
    });

    test('With search intent is condition should be relevant for relevant domains', () => {
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
      
      let relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.domainsToLookAction).toStrictEqual([]);
      expect(relevancy.domainsToLookCondition).toStrictEqual([]);
      expect(relevancy.matchingDomainsAction).toStrictEqual([]);
      expect(relevancy.matchingDomainsCondition).toStrictEqual([]);
      expect(relevancy.matchingIntent).toStrictEqual([]);
      expect(relevancy.hasPreventAutoexpand).toBe(false);
      expect(relevancy.isHidden).toBe(false);
      expect(relevancy.isRelevant).toBe(false);

      SidebarLoader.publicationSlices['original'] = [ 'nbcnews.com', 'foxnews.com', 'somenews.com' ];

      relevancy = AugmentationManager.getAugmentationRelevancy(augmentation);
      expect(relevancy.matchingIntent).toStrictEqual([ 'foxnews.com' ]);
      expect(relevancy.isRelevant).toBe(true);
    });

  });

})
