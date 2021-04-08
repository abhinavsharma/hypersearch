import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, List, Typography } from 'antd';
import { StepContext } from 'modules/introduction';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import './QueriesFrame.scss';

const { Title } = Typography;

const SyncOutlined = React.lazy(
  async () => await import('@ant-design/icons/SyncOutlined').then((mod) => mod),
);

const LIST_DATA = {
  'Startups: sources trusted by top founders & investors': [
    { text: 'how to raise a seed round' },
    { text: 'how to hire engineers' },
    { text: 'how to hire marketers' },
  ],

  'Dev: see sources trusted by engineers, designers, data scientists': [
    { text: 'best js framework' },
    { text: 'best machine learning books' },
  ],

  "Shopping: see real people's perspectives and trusted review sites": [
    { text: 'best car insurance' },
    { text: 'best baby monitor' },
    { text: 'best ev to buy 2021' },
  ],

  'News: see different perspectives': [{ text: 'will trump run in 2024' }],

  'Misc: learn new things better & faster with insider trusted sources': [
    { text: 'how to build a bunker' },
    { text: 'best crypto books' },
    { text: 'best red wines for beginners' },
  ],
};

const entries = Object.entries(LIST_DATA);

export const QueriesFrame = () => {
  const [index, setIndex] = useState(0);
  const stepContext = useContext(StepContext);

  const handleRandomize = () => {
    let newIndex = Math.floor(Math.random() * entries.length);
    while (newIndex === index) {
      newIndex = Math.floor(Math.random() * entries.length);
    }
    setIndex(newIndex);
  };

  useEffect(() => {
    if (!stepContext.finished) {
      chrome.storage.sync.set({ [SYNC_FINISHED_KEY]: true });
      stepContext.setFinished(true);
    }
  }, []);

  const [key, value] = entries[index];

  const header = (
    <>
      <Suspense fallback={null}>
        <Button type="link" icon={<SyncOutlined />} onClick={handleRandomize}></Button>
      </Suspense>
      <Title level={3}>{key}</Title>
    </>
  );

  return (
    <>
      <Helmet>
        <title>{APP_NAME} - Ready!</title>
      </Helmet>
      <div id="queries-frame-container">
        <Title level={2}>Ready! Try some queries</Title>
        <List
          header={header}
          dataSource={value}
          renderItem={(item) => (
            <List.Item>
              <a target="_blank" href={'https://www.google.com/search?q=' + item.text}>
                {item.text}
              </a>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
