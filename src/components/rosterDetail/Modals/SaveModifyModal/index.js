import React from 'react';
import { Link } from 'react-router';
import { Modal, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const SaveModifyModal = ({ rosterDetail, dispatch, ...props }) => {
  const { formatMessage } = props.intl;

  const modalType = 'saveModifyModal';

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
      type: 'rosterDetail/sureToSaveModify',
      payload: null,
    });

    dispatch({
      type: 'rosterDetail/toggleEditable',
      payload: {
        result: false,
      },
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
      <Modal
        okText="確認"
        title="提示"
        visible={rosterDetail.modalVisible[modalType] === true}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        您的編輯與出現如下衝突：
      </Modal>
    </span>
  );
};

export default injectIntl(SaveModifyModal);
