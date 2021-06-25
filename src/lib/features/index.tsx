/**
 * @module lib:features
 * @version 1.0.0
 * @license (C) Insight
 */

import React, { useCallback, useEffect, useState } from 'react';
import SidebarLoader from 'lib/sidebar';
import { triggerSerpProcessing } from 'lib/helpers';
import { DEV_FEATURE_FLAGS, FEATURE_FLAG_BLOB_URL, UPDATE_SIDEBAR_TABS_MESSAGE } from 'constant';

/**
 * Hook for getting the current state of the specified feature.
 *
 * @param feature - The name of the feature
 * @returns [Status, Setter]
 */
export const useFeature = (feature: string) => {
  const [localFlags, setLocalFlags] = useState<Features>(Object.create(null));
  const [features, setFeatures] = useState<Features>(Object.create(null));

  const getFeatures = useCallback(async () => {
    const remoteBlob = await fetch(FEATURE_FLAG_BLOB_URL, { mode: 'cors' });
    const raw = await remoteBlob.json();
    const locals = await new Promise<Record<string, Features>>((resolve) =>
      chrome.storage.local.get(DEV_FEATURE_FLAGS, resolve),
    ).then((data) => data[DEV_FEATURE_FLAGS]);
    setLocalFlags(locals);
    setFeatures(
      Object.assign(
        raw['features'].reduce((record: Features, entry: FeatureEntry) => {
          record[entry.name] = entry.enabled;
          return record;
        }, Object.create(null)),
        locals,
      ),
    );
  }, []);

  useEffect(() => {
    getFeatures();
  }, [getFeatures]);

  return [
    features[feature],
    () => {
      chrome.storage.local.set({
        [DEV_FEATURE_FLAGS]: {
          ...localFlags,
          [feature]: !features[feature],
        },
      });
      setFeatures({ ...features, [feature]: !features[feature] });
      chrome.runtime.sendMessage({ type: UPDATE_SIDEBAR_TABS_MESSAGE });
      triggerSerpProcessing(SidebarLoader, false);
    },
  ] as [boolean, () => void];
};

export const FeatureGate: FeatureGate = ({ component, feature, fallback }) => {
  const [enabled] = useFeature(feature);
  return <>{enabled ? component : fallback ?? null}</>;
};
