import React, { useCallback, useEffect, useState } from 'react';
import { DEV_FEATURE_FLAGS, FEATURE_FLAG_BLOB_URL } from 'utils';

type TFeatureEntry = Record<string, boolean>;

export const useFeature = (feature: string) => {
  const [localFlags, setLocalFlags] = useState<TFeatureEntry>(Object.create(null));
  const [features, setFeatures] = useState<TFeatureEntry>(Object.create(null));

  const getFeatures = useCallback(async () => {
    const remoteBlob = await fetch(FEATURE_FLAG_BLOB_URL, { mode: 'cors' });
    const raw = await remoteBlob.json();
    const locals = await new Promise<Record<string, TFeatureEntry>>((resolve) =>
      chrome.storage.local.get(DEV_FEATURE_FLAGS, resolve),
    ).then((data) => data[DEV_FEATURE_FLAGS]);
    setLocalFlags(locals);
    setFeatures(
      Object.assign(
        raw['features'].reduce((record: TFeatureEntry, entry: Record<'name' | 'enabled', any>) => {
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
    },
  ] as [boolean, () => void];
};

export const FeatureGate: FeatureGate = ({ children, feature, fallback }) => {
  const [enabled] = useFeature(feature);
  return <>{enabled ? children : fallback ?? null}</>;
};
