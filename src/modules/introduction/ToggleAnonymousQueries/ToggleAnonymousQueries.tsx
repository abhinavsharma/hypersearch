import React from 'react';
import { Switch, Row, Col } from 'antd';

export const ToggleAnonymousQueries = () => {
  const handleToggle = (e) => {
    console.log(e);
    chrome.storage.local.set({ anonymousQueries: e });
  };
  return (
    <Row gutter={24}>
      <Col>Anonymously send queries</Col>
      <Col span={12}>
        <Switch className="privacy-toggle" onChange={handleToggle} />
      </Col>
    </Row>
  );
};
