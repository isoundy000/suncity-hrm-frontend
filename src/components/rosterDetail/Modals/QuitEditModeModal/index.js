import React from 'react';
import { Link } from 'react-router';
import { Modal, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const QuitEditModeModal = ({ rosterDetail, dispatch, ...props }) => {
  const { formatMessage } = props.intl;

  const modalType = 'quitEditModeModal';

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
      type: 'rosterDetail/forceQuitEditMode',
      payload: {
        rosterId: rosterDetail.basicInfo.id,
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
        您一共進行了{rosterDetail.modifyCount}次修改，確定取消返回嗎？
      </Modal>
    </span>
  );
};

export default injectIntl(QuitEditModeModal);
