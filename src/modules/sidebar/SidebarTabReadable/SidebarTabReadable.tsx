import React from 'react';

export const SidebarTabReadable: SidebarTabReadable = ({ readable }) => {
  const content = { __html: readable };
  return <div className="insight-readable-content" dangerouslySetInnerHTML={content} />;
};
