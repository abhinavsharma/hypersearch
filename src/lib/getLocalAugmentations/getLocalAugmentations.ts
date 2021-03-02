export const getLocalAugmentations: GetLocalAugmentations = async () => {
  const results = await new Promise((resolve) =>
    chrome.storage.local.get('augmentations', (res) => resolve(res)),
  );
  return results?.['augmentations'] ?? [];
};
