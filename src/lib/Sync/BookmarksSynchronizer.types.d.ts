declare type RemoteBookmark = {
  url?: string;
  type?: string;
  parent?: string;
  position?: number;
  title?: string;
  dateAdded?: number;
  guid?: string;
  children?: [RemoteBookmark];
};

declare type BookmarksResponse = {
  add?: RemoteBookmark[];
  update?: RemoteBookmark[];
  delete?: RemoteBookmark[];
};
