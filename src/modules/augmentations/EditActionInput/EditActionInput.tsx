import React, { Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { Dropdown } from 'modules/shared';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditActionInput.scss';
import { OPEN_URL_ACTION, SEARCH_DOMAINS_ACTION, SEARCH_HIDE_DOMAIN_ACTION } from 'utils';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const EditActionInput: EditActionInput = ({ action, saveAction, deleteAction }) => {
  const [newValue, setNewValue] = useState('');
  const [type, setType] = useState<string>(action?.key);
  const [newLabel, setNewLabel] = useState<string>(action?.label ?? 'Choose Action Type');

  const handleSaveValue = (e: string, i: number) => {
    const newValue = action.value;
    newValue[i] = e;
    saveAction({ ...action, value: newValue });
    setNewValue('');
  };

  const handleValueDelete = (e: string) => {
    const newValue = action.value.filter((i) => i !== e);
    saveAction({ ...action, value: newValue });
  };

  const AvailableActions = [
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => {
        setNewLabel('Search only these domains');
        setType(SEARCH_DOMAINS_ACTION);
        saveAction({
          ...action,
          label: 'Search only these domains',
          key: SEARCH_DOMAINS_ACTION,
          value: [],
        });
      }}
    >
      Search only these domains
    </Button>,
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => {
        setNewLabel('Open page');
        setType(OPEN_URL_ACTION);
        saveAction({
          ...action,
          label: 'Open page',
          key: OPEN_URL_ACTION,
          value: [],
        });
      }}
    >
      Open page
    </Button>,
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => {
        setNewLabel('Minimize results from domain');
        setType(SEARCH_HIDE_DOMAIN_ACTION);
        saveAction({
          ...action,
          label: 'Minimize results from domain',
          key: SEARCH_HIDE_DOMAIN_ACTION,
          value: [],
        });
      }}
    >
      Minimize results from domain
    </Button>,
  ];

  return (
    <>
      <Col xs={12} className="action-value-col">
        {!action.key ? (
          <Dropdown button={newLabel} items={AvailableActions} className="edit-action-dropdown" />
        ) : (
          <div className="edit-input-row">
            <Button
              onClick={() => deleteAction(action)}
              className="edit-input-delete-button"
              danger
              type="link"
            >
              <Suspense fallback={null}>
                <MinusCircleOutlined />
              </Suspense>
            </Button>
            <span>{action.label}</span>
          </div>
        )}
      </Col>
      <Col xs={12} className="action-value-col">
        {action.value.map(
          (value, i) =>
            type && (
              <div key={value + i} className="action-value-row">
                <span>{value.slice(0, 25) + (value.length > 25 ? '...' : '')}</span>
                <Button
                  onClick={() => handleValueDelete(value)}
                  className="edit-input-delete-button"
                  danger
                  type="link"
                >
                  <Suspense fallback={null}>
                    <MinusCircleOutlined />
                  </Suspense>
                </Button>
              </div>
            ),
        )}
        {type &&
          (![OPEN_URL_ACTION, SEARCH_HIDE_DOMAIN_ACTION].includes(type) ||
            action.value.length === 0) && (
            <Row className="no-border edit-input-row">
              <Input.Search
                enterButton="Add"
                className="add-action-value-input"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onSearch={() => handleSaveValue(newValue, action.value.length)}
              />
            </Row>
          )}
      </Col>
    </>
  );
};
