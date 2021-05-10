import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Collapse, List, Typography } from 'antd';
import { StepContext } from 'modules/introduction';
import { APP_NAME, SYNC_FINISHED_KEY } from 'utils';
import './QueriesFrame.scss';

type QueryListItem = Record<'text', string>;
type QueryList = Record<string, QueryListItem[]>;

/** MAGICS **/
const TAB_TITLE = `${APP_NAME} - Try Searching`;
const PAGE_MAIN_HEADER_TEXT = 'Ready, Set, Search!';
// * QUERIES
const QUERIES_PANEL_HEADER = '1. Try Some Queries';
const QUERIES_REFERENCE_URL = 'https://www.google.com/search?q=<placeholder>';
// * TOUR
const TOUR_PANEL_HEADER = '2. Make Your First Lens';
const TOUR_PANEL_CONTENT =
  'Make a lens that filters news search queries to your trusted sources only.';
const TOUR_BUTTON_TEXT = 'Create my personalized news lens';
const TOUR_BUTTON_URL = 'https://google.com/search?q=news&insight-tour=true';
// * WALKTHROUGH
const WALKTHROUGH_PANEL_HEADER = '3. Watch the Walkthrough Video';
const WALKTHROUGH_BUTTON_TEXT = 'Watch the full walkthrough video';
const WALKTHROUGH_BUTTON_URL = 'https://share.insightbrowser.com/17';
// * QUERY LIST
const LIST_DATA: QueryList = {
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

const { Title } = Typography;
const { Panel } = Collapse;

const SyncOutlined = React.lazy(
  async () => await import('@ant-design/icons/SyncOutlined').then((mod) => mod),
);

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
  }, [stepContext]);

  const [key, value] = entries[index];

  const header = (
    <>
      <Suspense fallback={null}>
        <Button type="link" icon={<SyncOutlined />} onClick={handleRandomize}></Button>
      </Suspense>
      <Title level={3}>{key}</Title>
    </>
  );

  const item = (item: QueryListItem) => (
    <List.Item>
      <a
        target="_blank"
        href={QUERIES_REFERENCE_URL.replace('<placeholder>', item.text)}
        rel="noreferrer"
      >
        {item.text}
      </a>
    </List.Item>
  );

  return (
    <>
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <div id="queries-frame-container">
        <Title level={2}>{PAGE_MAIN_HEADER_TEXT}</Title>
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header={QUERIES_PANEL_HEADER} key="1">
            <List header={header} dataSource={value} renderItem={item} />
          </Panel>

          <Panel header={TOUR_PANEL_HEADER} key="2">
            {TOUR_PANEL_CONTENT}
            <div>
              <Button
                target="_blank"
                type="link"
                shape="round"
                size="large"
                className="step-button"
                href={TOUR_BUTTON_URL}
              >
                {TOUR_BUTTON_TEXT}
              </Button>
            </div>
          </Panel>

          <Panel header={WALKTHROUGH_PANEL_HEADER} key="3">
            <Button
              target="_blank"
              type="link"
              shape="round"
              size="large"
              className="step-button"
              href={WALKTHROUGH_BUTTON_URL}
            >
              {WALKTHROUGH_BUTTON_TEXT}
            </Button>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};
