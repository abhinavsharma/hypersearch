import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Collapse from 'antd/lib/collapse';
import List from 'antd/lib/list';
import Typography from 'antd/lib/typography';
import { StepContext } from 'modules/onboarding';
import { APP_NAME, SYNC_FINISHED_KEY } from 'constant';
import 'antd/lib/collapse/style/index.css';
import 'antd/lib/list/style/index.css';
import 'antd/lib/typography/style/index.css';
import './QueriesFrame.scss';

type QueryListItem = Record<'text', string>;
type QueryList = Record<string, QueryListItem[]>;

/** MAGICS **/
const TAB_TITLE = `${APP_NAME} - Try Searching`;
const PAGE_MAIN_HEADER_TEXT = 'Ready, Set, Search!';
// * QUERIES
const QUERIES_REFERENCE_URL = 'https://www.google.com/search?q=<placeholder>';
// * QUERY LIST
const LIST_DATA: QueryList = {

  "Shopping: see real people's perspectives and trusted review sites": [
    { text: 'best car insurance' },
    { text: 'best baby monitor' },
    { text: 'best ev to buy 2021' },
  ],

  'Startups: sources trusted by top founders & investors': [
    { text: 'how to raise a seed round' },
    { text: 'how to hire engineers' },
    { text: 'how to hire marketers' },
  ],

  'Dev: see sources trusted by engineers, designers, data scientists': [
    { text: 'best js framework' },
    { text: 'best machine learning books' },
  ],

  'Misc: learn new things better & faster with insider trusted sources': [
    { text: 'how to build a bunker' },
    { text: 'best crypto books' },
    { text: 'best red wines for beginners' },
  ],
};

const { Title } = Typography;
const { Panel } = Collapse;

const entries = Object.entries(LIST_DATA);

export const QueriesFrame = () => {
  const stepContext = useContext(StepContext);

  useEffect(() => {
    if (!stepContext.finished) {
      chrome.storage.sync.set({ [SYNC_FINISHED_KEY]: true });
      stepContext.setFinished(true);
    }
  }, [stepContext]);

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

  const panelItem = (panel: [ string, QueryListItem[] ], index: number) => {
    return (
      <Panel header={ panel[0] } key={ String(index) }>
        <List dataSource={ panel[1] } renderItem={ item } />
      </Panel>
    );
  };

  return (
    <>
      <Helmet>
        <title>{TAB_TITLE}</title>
      </Helmet>
      <div id="queries-frame-container">
        <Title level={2}>{PAGE_MAIN_HEADER_TEXT}</Title>
        <Collapse accordion defaultActiveKey={['0']}>
          { entries.map(panelItem) }
        </Collapse>
      </div>
    </>
  );
};
