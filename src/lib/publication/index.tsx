/**
 * @module lib:publication
 * @version 1.0.0
 * @license (C) Insight
 */

import { PUBLICATION_INFO_BLOB_URL } from 'constant';
import { useCallback, useEffect, useState } from 'react';

const fetchPublicationInfo = async () => {
  const raw = await fetch(PUBLICATION_INFO_BLOB_URL, { mode: 'cors' });
  const json = await raw.json();
  return json as Record<string, PublicationInfo>;
};

export const getPublicationInfo = async (url: string) => {
  const publicationInfos = await fetchPublicationInfo();
  const publicationInfo =
    publicationInfos[url] ||
    Object.values(publicationInfos).find((value) => {
      return value.url === url;
    });
  return publicationInfo;
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
