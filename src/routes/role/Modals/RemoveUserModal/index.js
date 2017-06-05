import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';


function RemoveUserModal({ record, role, dispatch, ...props }) {
  const { formatMessage } = props.intl;
  const userId = record.id;
  const userName = record.chinese_name;

  const modalType = 'removeUserModal';

  const handleOnClick = () => {
    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: userId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  const handleOk = () => {

    dispatch({
      type: 'role/startRemoveDataAbout',
      payload: {
        dataId: userId,
        dataType: 'user',
      },
    });

    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });

    let body = document.getElementsByTagName('body')[0];
    body.style.cssText = "";
  };

  return (
    <span>
      <Link onClick={handleOnClick}>移除</Link>

      <Modal
        okText="確認"
        title="移除員工"
        visible={userId === role.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.removeUserModal}
      >
        <p>你確定要從該權限組移除該員工：{userName}</p>
      </Modal>
    </span>
  );
}

export default injectIntl(RemoveUserModal);
