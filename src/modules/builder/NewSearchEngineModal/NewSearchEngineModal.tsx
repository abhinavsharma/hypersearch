import React, { ChangeEvent, useRef, useState } from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import Alert from 'antd/lib/alert';
import SearchEngineManager from 'lib/engines';
import SidebarLoader from 'lib/sidebar';
import { EMPTY_CUSTOM_SEARCH_ENGINE_BLOB } from 'constant';
import { extractUrlProperties } from 'lib/helpers';
import 'antd/lib/alert/style/index.css';
import 'antd/lib/typography/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/modal/style/index.css';
import './NewSearchEngineModal.scss';

/** MAGICS **/
const URL_REPLACE_STRING = '%s';
const MODAL_TITLE = 'Add Search Engine';
const ADD_BUTTON_TEXT = 'Add';
const NAME_INPUT_PLACEHOLDER_TEXT = 'Search Engine Name';
const URL_INPUT_PLACEHOLDER_TEXT = 'https://mysearchengine.com/search?q=%s';

const { Text } = Typography;

export const NewSearchEngineModal: NewSearchEngineModal = ({
  handleSelect,
  isModalVisible,
  setIsModalVisible,
}) => {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUrl(e.target.value);
  };

  const handleSubmit = () => {
    try {
      const url = new URL(newUrl);
      const requiredParam = url.search
        .split('&')
        .find((value) => value.split('=')[1] === URL_REPLACE_STRING)
        ?.split('=')[0]
        .replace('?', '');
      if (!requiredParam) {
        throw new Error(`URL must contain ${URL_REPLACE_STRING}!`);
      }
      const cseObject: SearchEngineObject = {
        querySelector: EMPTY_CUSTOM_SEARCH_ENGINE_BLOB.querySelector,
        search_engine_json: {
          required_prefix: extractUrlProperties(newUrl).full ?? '',
          required_params: [requiredParam],
        },
      };
      SearchEngineManager.createArbitraryEngine(newName, cseObject);
      if (SidebarLoader.url.href.match(cseObject.search_engine_json.required_prefix)) {
        SidebarLoader.customSearchEngine = cseObject;
        SidebarLoader.query =
          new URL(window.location.href).searchParams.get(
            cseObject.search_engine_json.required_params[0],
          ) ?? '';
      }
      handleSelect({
        key: newName,
        value: JSON.stringify(cseObject.search_engine_json),
        label: newName,
      });
      setIsModalVisible(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    Modal.destroyAll();
  };

  const handleAlertClose = () => {
    setTimeout(() => setError(''), 150);
  };

  const getContainer = () => containerRef.current as HTMLElement;

  const containerStyle: React.CSSProperties = { position: 'absolute' };

  return (
    <div id="new-cse-modal">
      <Modal
        title={MODAL_TITLE}
        visible={isModalVisible}
        closable={false}
        destroyOnClose
        maskClosable
        onOk={handleSubmit}
        okText={ADD_BUTTON_TEXT}
        onCancel={handleCancel}
        getContainer={getContainer}
      >
        <div className="modal-content-wrapper">
          <Input
            placeholder={NAME_INPUT_PLACEHOLDER_TEXT}
            value={newName}
            onChange={handleNameChange}
          />
          <Input
            placeholder={URL_INPUT_PLACEHOLDER_TEXT}
            value={newUrl}
            onChange={handleUrlChange}
          />
          <span>
            <Text code type="secondary">
              %s
            </Text>
            <Text type="secondary">will be replaced with your actual query</Text>
          </span>
        </div>
        {error && (
          <Alert message={error} type="error" showIcon closable onClose={handleAlertClose} />
        )}
      </Modal>
      <div className="insight-modal-root" ref={containerRef} style={containerStyle} />
    </div>
  );
};
