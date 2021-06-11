declare type RemoteBookmark = {
  url?: string;
  type?: string;
  parent?: string;
  position?: number;
  title?: string;
  dateAdded?: Number;
  guid?: string;
  children?: [ RemoteBookmark ];
};

declare type BookmarksReponse = {
  add?: RemoteBookmark[];
  update?: RemoteBookmark[];
  delete?: RemoteBookmark[];
};