import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Row, Col } from 'antd';

export const ToggleAnonymousQueries = () => {
  const [checked, setChecked] = useState<boolean>();

  const getStorageValue = useCallback(async () => {
    const isAnonymous = await new Promise((resolve) =>
      chrome.storage.local.get('anonymousQueries', resolve),
    ).then(({ anonymousQueries }) => anonymousQueries);
    setChecked(isAnonymous);
  }, []);

  useEffect(() => {
    getStorageValue();
  }, [getStorageValue]);

  const handleToggle = (e) => {
    setChecked(e);
    chrome.storage.local.set({ anonymousQueries: e });
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <div className="privacy-panel-lr">
          <Switch className="privacy-toggle" checked={checked} onChange={handleToggle} />
          <span>Enable anonymous & obfuscated logging.</span>
        </div>
      </Col>
    </Row>
  );
};
