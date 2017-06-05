import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';


function RemovePermissionModal({ record, role, dispatch, ...props }) {
  const { formatMessage } = props.intl;
  const permissionId = record.id;

  const translations = role.allPermissionsTranslation;
  const resource = record.resource;
  const action = record.action;
  /* const permissionName = translations.length === 0 ? '' : translations[resource].chinese_name[action];*/

  const tmpTransResource = translations.length === 0 ? undefined : translations[resource];

  const permissionName = tmpTransResource && tmpTransResource.chinese_name && tmpTransResource.chinese_name[action] ? tmpTransResource.chinese_name[action] : '';

  const modalType = 'removePermissionModal';

  const handleOnClick = () => {
    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: permissionId,
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
        dataId: permissionId,
        dataType: 'permission',
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
        title="移除權限"
        visible={permissionId === role.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.removePermissionModal}
      >
        <p>你確定要移除該權限：{permissionName}</p>
      </Modal>
    </span>
  );
}

export default injectIntl(RemovePermissionModal);
