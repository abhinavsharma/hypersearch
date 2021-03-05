import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './SearchNeedsImprovementPage' {
  type SearchNeedsImprovementPageProps = {
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type SearchNeedsImprovementPage = FunctionComponent<SearchNeedsImprovementPageProps>;
}
