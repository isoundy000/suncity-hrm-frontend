import React from 'react';
import { Link } from 'react-router';
import { Modal, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const ClearAllModifyModal = ({ rosterDetail, dispatch, ...props }) => {
  const { formatMessage } = props.intl;

  const modalType = 'clearAllMOdifyModal';

  const handleOnClick = () => {
    dispatch({
      type: 'rosterDetail/toggleModal',
      payload: {
        type: modalType,
        result: true,
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'rosterDetail/toggleModal',
      payload: {
        type: modalType,
        result: false,
      },
    });
  };

  const handleOk = () => {
    dispatch({
      type: 'rosterDetail/clearAllModify',
      payload: null,
    });

    dispatch({
      type: 'rosterDetail/toggleModal',
      payload: {
        result: false,
        type: modalType,
      },
    });
  };
  return (
    <span>
      <Button onClick={handleOnClick}>清空修改</Button>
      <Modal
        okText="確認"
        title="提示"
        visible={rosterDetail.modalVisible[modalType] === true}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        您確定清除所有修改?
      </Modal>
    </span>
  );
};

export default injectIntl(ClearAllModifyModal);
