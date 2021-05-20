import { FunctionComponent } from 'react';

declare module './NewSearchEngineModal' {
  type NewSearchEngineModalProps = {
    handleSelect: (e: any) => void;
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    isModalVisible: boolean;
  };

  type NewSearchEngineModal = FunctionComponent<NewSearchEngineModalProps>;
}
