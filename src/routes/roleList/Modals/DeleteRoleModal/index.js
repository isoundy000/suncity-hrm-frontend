import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';


function DeleteRoleModal({ roleId, roleName, roleList, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const modalType = 'deleteRoleModal';

  const handleOnClick = () => {
    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: roleId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  const handleOk = () => {

    dispatch({
      type: 'roleList/startDeleteRole',
      payload: {
        id: roleId,
      },
    });

    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  return (
    <span>
      <Link onClick={handleOnClick}>刪除</Link>

      <Modal
        okText="確認"
        title="刪除權限組"
        visible={roleId === roleList.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>你確定要刪除權限組：{roleName}</p>
      </Modal>
    </span>
  );
}

export default injectIntl(DeleteRoleModal);
