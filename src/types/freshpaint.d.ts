declare type FreshpaintTrackEvent = {
  event: string;
  properties: {
    distinct_id: string;
    token: string;
    time: number;
    [key: string]: any;
  };
};
