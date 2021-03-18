import { Dispatch, FunctionComponent, SetStateAction } from 'react';

declare module './ActiveAugmentationsPage' {
  type ActiveAugmentationsPageProps = {
    setActiveKey: Dispatch<SetStateAction<string>>;
  };

  type ActiveAugmentationsPage = FunctionComponent<ActiveAugmentationsPageProps>;
}
