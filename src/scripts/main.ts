import SidebarLoader from 'lib/SidebarLoader/SidebarLoader';
import {
  debug,
  HIDE_DOMAINS_MESSAGE,
  hideSerpResults,
  expandSidebar,
  UPDATE_SIDEBAR_TABS_MESSAGE,
  HIDE_TAB_FAKE_URL,
  getFirstValidTabIndex,
  SWITCH_TO_TAB,
  shouldPreventEventBubble,
} from 'utils';

(async (document: Document, location: Location) => {
  debug(
    'execute content script\n---\n\tCurrent Location',
    location.href,
    '\n\tProject --- ',
    process.env.PROJECT === 'is' ? 'Insight' : 'SearchClub',
    '\n---',
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (shouldPreventEventBubble(event)) return;
    const validTabs = SidebarLoader.sidebarTabs.filter(({ url }) => url.href !== HIDE_TAB_FAKE_URL);
    if (event.code === 'ArrowRight') {
      if (!SidebarLoader.isExpanded) {
        SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
        expandSidebar();
        chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      } else {
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index:
            Number(SidebarLoader.currentTab) === validTabs.length
              ? getFirstValidTabIndex(SidebarLoader.sidebarTabs)
              : (Number(SidebarLoader.currentTab) + 1).toString(),
        });
      }
    }
    if (event.code === 'ArrowLeft') {
      if (!SidebarLoader.isExpanded) return;
      if (SidebarLoader.currentTab === getFirstValidTabIndex(SidebarLoader.sidebarTabs)) {
        SidebarLoader.isExpanded = !SidebarLoader.isExpanded;
        expandSidebar();
        chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      } else {
        chrome.runtime.sendMessage({
          type: SWITCH_TO_TAB,
          index: (Number(SidebarLoader.currentTab) - 1).toString(),
        });
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown, true);

  let blockingAugmentations: AugmentationObject[] = [];
  window.top.addEventListener('message', ({ data }) => {
    if (data.name === HIDE_DOMAINS_MESSAGE) {
      if (data.remove) {
        blockingAugmentations = blockingAugmentations.filter(({ id }) => id !== data.remove);
        const blockedElements = Array.from(document.querySelectorAll(`[insight-blocked-by]`));
        blockedElements.forEach((element) => {
          const blockers = element.getAttribute('insight-blocked-by').replace(data.remove, '');
          element.setAttribute('insight-blocked-by', blockers);
          if (!blockers.split(' ').filter((i) => !!i).length) {
            element.parentElement.removeChild(element);
          }
          const button = element.querySelector(`#${data.remove}`);
          button.parentElement.removeChild(button);
        });
      } else {
        if (!blockingAugmentations.find(({ id }) => id === data.augmentation?.id)) {
          blockingAugmentations.push(data.augmentation);
        }
        const blocks = [];
        const results = Array.from(document.querySelectorAll(data.selector.link)) as HTMLElement[];
        results.forEach((result) => {
          data.hideDomains.forEach((domain) => {
            let domainName = '';
            if (result instanceof HTMLLinkElement) {
              domainName = result.getAttribute('href');
            } else {
              domainName = result.textContent;
            }
            if (domainName.match(domain)?.length) {
              blocks.push(result);
            }
          });
        });

        if (document.readyState === 'complete' || document.readyState === 'interactive')
          hideSerpResults(
            blocks,
            data.selector.container,
            {
              header: `🙈 Result muted by lens`,
              text: 'Click to show',
            },
            'hidden-domain',
            blockingAugmentations,
          );
      }
    }
  });
  const url = new URL(location.href);
  await SidebarLoader.loadOrUpdateSidebar(document, url);
})(document, location);
