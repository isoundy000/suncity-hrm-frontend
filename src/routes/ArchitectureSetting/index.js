/**
 * Created by meng on 16/9/14.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Icon } from 'antd';
import styles from './index.less';
import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

import TabsPanel from './TabsPanel';

function ArchitectureSetting({ region, architectureSetting, currentUser, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  return (
    <section className={styles.container}>
      <Row>
        <Col md={24}>
          <TabsPanel
            dataSource={architectureSetting}
            dispatch={dispatch}
            region={region}
            currentUser={currentUser}
          />
        </Col>
      </Row>
    </section>
  );
}

ArchitectureSetting.propTypes = {
};

const mapStateToProps = ({ region, architectureSetting, currentUser }) => ({
  region,
  architectureSetting,
  currentUser,
});

export default connect(mapStateToProps)(injectIntl(ArchitectureSetting));
