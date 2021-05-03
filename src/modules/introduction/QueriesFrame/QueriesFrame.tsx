import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Collapse, List, Typography } from 'antd';
import { StepContext } from 'modules/introduction';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import './QueriesFrame.scss';

const { Title } = Typography;
const { Panel } = Collapse;

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
        <title>{APP_NAME} - Try Searching</title>
      </Helmet>
      <div id="queries-frame-container">
        <Title level={2}>Ready, Set, Search!</Title>
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header="1. Make Your First Lens" key="1">
            Make a lens that filters news search queries to your trusted sources only.
            <div>
              <Button
                target="_blank"
                type="link"
                shape="round"
                size="large"
                className="step-button"
                href="https://google.com/search?q=news&insight-tour=true"
              >
                Create my personalized news lens
              </Button>
            </div>
          </Panel>

          <Panel header="2. Try Some Queries" key="2">
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
          </Panel>
          <Panel header="3. Watch the Walkthrough Video" key="3">
            <Button
              target="_blank"
              type="link"
              shape="round"
              size="large"
              className="step-button"
              href="https://share.insightbrowser.com/17"
            >
              Watch the full walkthrough video
            </Button>
            {/* <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <video
                src="https://cdn.loom.com/sessions/thumbnails/9cdcde99a02941e4a07a16d889134b5a-00001.mp4"
                controls
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></video>
            </div> */}
          </Panel>
        </Collapse>
      </div>
    </>
  );
};
