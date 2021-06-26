/**
 * @module lib:publication
 * @version 1.0.0
 * @license (C) Insight
 */

import { PUBLICATION_INFO_BLOB_URL, PUBLICATION_REDIRECT_URL } from 'constant';
import { extractPublication, extractUrlProperties } from 'lib/helpers';
import { useCallback, useEffect, useState } from 'react';

const fetchPublicationInfo = async () => {
  const raw = await fetch(PUBLICATION_INFO_BLOB_URL, { mode: 'cors' });
  const json = await raw.json();
  return json as Record<string, PublicationInfo>;
};

export const getPublicationInfo = async (url: string) => {
  const id = `${PUBLICATION_REDIRECT_URL}-${
    extractPublication(url) || extractUrlProperties(url).hostname
  }`;
  const redirectData = await new Promise<Record<string, { from: string; to: string }>>((resolve) =>
    chrome.storage.local.get(id, resolve),
  ).then((data) => data[id]);
  const publicationInfos = await fetchPublicationInfo();
  const publicationInfo = publicationInfos[redirectData?.from] ?? publicationInfos[url];
  return {
    ...publicationInfo,
    url: redirectData?.from,
    publication: redirectData?.to,
  } as PublicationInfo;
};

export const usePublicationInfo = (publication: string) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [publicationInfo, setPublicationInfo] = useState<PublicationInfo>(Object.create(null));

  const getAverageRating = (ratings: number[]) => {
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const getInfo = useCallback(async () => {
    const result: PublicationInfo = (await getPublicationInfo(publication)) ?? Object.create(null);
    setPublicationInfo(result);
    const ratings = result.tags?.map((tag) => tag.rating) ?? [];
    setAverageRating(getAverageRating(ratings));
  }, [publication]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return { publicationInfo, averageRating };
};
