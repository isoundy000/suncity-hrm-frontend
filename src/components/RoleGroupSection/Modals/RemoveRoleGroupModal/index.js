import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

import DELETE_ICON from '../../assets/shanchu.png';


function RemoveRoleGroupModal({ roleId, roleName, dispatch, modalVisible, ...props }) {
  const { formatMessage } = props.intl;

  const modalType = 'removeRoleGroupModal';

  const handleOnClick = () => {
    dispatch({
      type: 'profileDetail/toggleModal',
      payload: {
        id: roleId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'profileDetail/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  const handleOk = () => {

    dispatch({
      type: 'profileDetail/startRemoveRoleGroup',
      payload: {
        roleId: roleId,
      },
    });

    dispatch({
      type: 'profileDetail/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  return (
    <span>
      <Link onClick={handleOnClick} className={styles.actionLink}>
        <img alt="delete" src={DELETE_ICON} />
      </Link>


      <Modal
        okText= "確認"
        title="移除用戶組"
        visible={roleId === modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.removeRoleGroupModal}
      >
        <p>你確定要移除用戶組：{roleName}</p>
      </Modal>
    </span>
  );
}

export default injectIntl(RemoveRoleGroupModal);
