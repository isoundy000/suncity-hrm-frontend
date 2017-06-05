import React from 'react';
import { Row, Col, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import CreateRoleModal from '../Modals/CreateRoleModal';


function TitleBar({ ...props }) {
  const { formatMessage } = props.intl;

  return (
    <Row className={styles.titleBar}>
      <Col md={12} offset={6}>
        <div className={styles.title}>
          權限組列表
        </div>
      </Col>

      <Col md={6}>
        <div className={styles.createBtn}>
          <CreateRoleModal {...props} />
        </div>
      </Col>

    </Row>
  )
}

export default injectIntl(TitleBar);
