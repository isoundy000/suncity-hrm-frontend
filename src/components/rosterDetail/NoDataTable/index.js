import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const NoDataTable = ({ rosterDetail, ...props }) => {
  const { formatMessage } = props.intl;
  console.log('NODATATABLE');
  const { year, month } = rosterDetail.basicInfo.id ?
                          rosterDetail.basicInfo : { year: 'yyyy', month: 'mm'};

  return (
    <div className={styles.noDataTable}>
      <Row>
        <Col md={24}>
          暫無{`${year}年${month}月`}排班信息，點擊按鈕添加排班信息
          <Link to={`/scheduleRuleDetail/${rosterDetail.basicInfo.id}`}>
            <Button type="primary">自動排班</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default injectIntl(NoDataTable);
