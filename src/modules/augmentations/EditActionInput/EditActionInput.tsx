import React, { Suspense, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { Dropdown } from 'modules/shared';
import { EditActionValueInput } from 'modules/augmentations';
import 'antd/lib/button/style/index.css';
import 'antd/lib/grid/style/index.css';
import './EditActionInput.scss';

const MinusCircleOutlined = React.lazy(
  async () => await import('@ant-design/icons/MinusCircleOutlined').then((mod) => mod),
);

export const EditActionInput: EditActionInput = ({ action, saveAction, deleteAction }) => {
  const [type, setType] = useState<string>(action?.key);
  const [newLabel, setNewLabel] = useState<string>(
    action?.label ?? 'Hover to select action type...',
  );

  const handleSaveValue = (e: string, i: number) => {
    const newValue = action.value;
    newValue[i] = e;
    saveAction({ ...action, value: newValue });
  };

  const handleValueDelete = (e: string) => {
    const newValue = action.value.filter((i) => i !== e);
    if (action.value.length > 1 && action.value[0] !== '') {
      saveAction({ ...action, value: newValue });
    } else {
      deleteAction(action);
    }
  };

  const AvailableActions = [
    <Button
      className="dropdown-button"
      type="link"
      onClick={() => {
        setNewLabel('Search only these domains');
        setType('search_domains');
        saveAction({
          ...action,
          label: 'Search only these domains',
          key: 'search_domains',
          value: [''],
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
        setType('open_url');
        saveAction({
          ...action,
          label: 'Open page',
          key: 'open_url',
          value: [''],
        });
      }}
    >
      Open page
    </Button>,
  ];

  return (
    <>
      <Col xs={12} className="action-value-col">
        {!action.key ? (
          <Dropdown button={newLabel} items={AvailableActions} className="edit-action-dropdown" />
        ) : (
          action.label
        )}
      </Col>
      <Col xs={12} className="action-value-col">
        {(type === 'open_url'
          ? action.value.slice(0, 1)
          : Array.from(new Set(action.value.concat('')))
        ).map((value, i) => {
          return (
            type && (
              <Row key={value + i} className="no-border edit-input-row">
                <EditActionValueInput saveValue={handleSaveValue} value={value ?? ''} index={i} />
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
              </Row>
            )
          );
        })}
      </Col>
    </>
  );
};
