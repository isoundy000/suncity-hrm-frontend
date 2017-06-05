import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';


function ShowPermissionModal({ record, role, dispatch, ...props }) {
  const { formatMessage } = props.intl;
  const permissionId = record.id;

  const tr = role.allPermissionsTranslation;

  const chinese_name = tr.length === 0 ? '' : tr[record.resource].chinese_name[record.action];
  const english_name = tr.length === 0 ? '' : tr[record.resource].english_name[record.action];

  const modalType = 'showPermissionModal';

  const handleOnClick = () => {
    /* dispatch({
       type: 'role/startFetchPermissionDetail',
       payload: {
       id: permissionId,
       },
       });
     */
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
      type: 'role/emptyPermissionDetail',
      payload: null,
    });

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
      type: 'role/emptyPermissionDetail',
      payload: null,
    });

    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  return (
    <span>
      <Link onClick={handleOnClick}>Detail</Link>

      <Modal
        okText="確認"
        title={`${chinese_name} - 權限詳情`}
        visible={permissionId === role.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.showPermissionModal}
      >
        <div>
          <Row>
            <Col md={5} offset={3}>
              中文名：
            </Col>

            <Col md={16}>
              {chinese_name}
            </Col>
          </Row>

          <Row>
            <Col md={5} offset={3}>
              英文名：
            </Col>

            <Col md={16}>
              {english_name}
            </Col>
          </Row>

          <Row>
            <Col md={5} offset={3}>
              地區：
            </Col>

            <Col md={16}>
              {record.region}
            </Col>
          </Row>

          <Row>
            <Col md={5} offset={3}>
              Resource：
            </Col>

            <Col md={16}>
              {record.resource}
            </Col>
          </Row>

          <Row>
            <Col md={5} offset={3}>
              Action：
            </Col>

            <Col md={16}>
              {record.action}
            </Col>
          </Row>

        </div>

      </Modal>
    </span>
  );
}

export default injectIntl(ShowPermissionModal);
