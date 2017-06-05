import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Tag } from 'antd';
import styles from './index.less';

import color from '../../../../styles/base.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

// From styles/base.less for tagColor;
//
// @themeGreen:  #8bca5a;
// @themeRed:  #ff8965;

const ListItem = ({ roster, ...props }) => {
  const rosterState = roster.state;
  const department = roster.department;
  const xxx = 'xxx';

  return (
    <div className={styles.listItem}>
      <Row>
        <Col md={23}>
          <Row className={styles.header}>
            <Col md={5}>
              {department.chinese_name}排班時間表
            </Col>

            <Col md={2}>
              {`${roster.year} - ${roster.month}`}
            </Col>

            <Col md={2}>
              <Tag color={rosterState === 'rostered' ? '#8bca5a' : '#ff8965'}>
                {rosterState === 'rostered' ? '已排' : '未排'}
              </Tag>
            </Col>
          </Row>

          <Row className={styles.basicInfo}>
            <Col md={4}>
              員工 {roster.department_employees_count} 人
            </Col>

            <Col md={4}>
              排班 {roster.roster_items_count} 人次
            </Col>

            <Col md={4}>
              公休 {roster.office_leave_count} 人次
            </Col>

            <Col md={4}>
              大假 {xxx} 人次
            </Col>

            <Col md={4}>
              生日假 {xxx} 人次
            </Col>

            <Col md={4}>
              其他假 {xxx} 人次
            </Col>
          </Row>
        </Col>

        <Col md={1} className={styles.goToDetail}>
          <Link to={`/rosters/${roster.id}`}>
            {'〉'}
          </Link>
        </Col>

      </Row>
    </div>
  );
};

export default injectIntl(ListItem);
