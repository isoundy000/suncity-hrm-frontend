import React from 'react';
import { connect } from 'dva';

import { Row, Col, Button, Icon } from 'antd';

import styles from './index.less';

import TitleBar from './TitleBar';
import RoleTable from './RoleTable';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';


function RoleList({ roleList, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  return (
    <section className={styles.container}>
      <Row>
        <Col md={24}>
          <TitleBar
            roleList={roleList}
            dispatch={dispatch}
            {...props}
          />
        </Col>
      </Row>

      <Row>
        <Col md={24}>
          <RoleTable
            roleList={roleList}
            dispatch={dispatch}
            {...props}
          />
        </Col>
      </Row>
    </section>
  )
}

const mapStateToProps = ({ roleList }) => ({
  roleList,
});

export default connect(mapStateToProps)(injectIntl(RoleList));
