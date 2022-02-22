import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import List from 'antd/lib/list';
import Typography from 'antd/lib/typography';
import { StepContext } from 'modules/onboarding';
import { APP_NAME, SYNC_FINISHED_KEY } from 'constant';
import 'antd/lib/button/style/index.css';
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
  'Startups: sources trusted by top founders & investors': [
    { text: 'how to raise a seed round' },
    { text: 'how to hire engineers' },
    { text: 'how to hire marketers' },
  ],
};

const { Title } = Typography;

const entries = Object.entries(LIST_DATA);

export const QueriesFrame = () => {
  const stepContext = useContext(StepContext);

  useEffect(() => {
    if (!stepContext.finished) {
      chrome.storage.sync.set({ [SYNC_FINISHED_KEY]: true });
      stepContext.setFinished(true);
    }
  }, [stepContext]);

  const [key, value] = entries[0];

  const header = <Title level={3}>{key}</Title>;

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
        <List header={header} dataSource={value} renderItem={item} />
      </div>
    </>
  );
};
