import React from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';

import { Row, Col, Button, Icon } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

import TabsPanel from './TabsPanel';


function Role({ role, currentUser, region, dispatch, ...props }) {
  const { formatMessage } = props.intl;
  return (
    <section className={styles.container}>
      <Row>
        <Col md={6}>
          <div className={styles.backBtn}>
            <Link to='/roles'>
              <Button>{'< 返回'}</Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <TabsPanel
            role={role}
            currentUser={currentUser}
            region={region}
            dispatch={dispatch}
            {...props}
          />
        </Col>
      </Row>
    </section>
  )
}

const mapStateToProps = ({ role, currentUser, region }) => ({
  role,
  currentUser,
  region,
});

export default connect(mapStateToProps)(injectIntl(Role));
