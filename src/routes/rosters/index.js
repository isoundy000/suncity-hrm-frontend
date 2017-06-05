import React from 'react';
import { connect } from 'dva';
import { Row, Col, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

import ToolBar from '../../components/rosters/ToolBar';
import RosterList from '../../components/rosters/RosterList';

const Rosters = ({ rosters, dispatch, currentUser, ...props }) => {
  const { formatMessage } = props.intl;
  const tmpDate = new Date();
  const date = Object.assign({}, {}, {
    year: tmpDate.getFullYear(),
    month: tmpDate.getMonth() + 1,
  });

  return (
    <Spin spinning={rosters.loading && rosters.loading.all}>
      <section className={styles.container}>
        <Row>
          <Col md={24}>
            <div className={styles.title}>
              排班時間表
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <ToolBar
              rosters={rosters}
              dispatch={dispatch}
              date={date}
              currentUser={currentUser}
            />
          </Col>
        </Row>

        <Row>
          <Col md={24}>
            <RosterList
              rosters={rosters}
              dispatch={dispatch}
              currentUser={currentUser}
            />
          </Col>
        </Row>

      </section>

    </Spin>
  )
}

const mapStateToProps = ({ currentUser, rosters }) => ({
  currentUser,
  rosters,
});

export default connect(mapStateToProps)(injectIntl(Rosters));
