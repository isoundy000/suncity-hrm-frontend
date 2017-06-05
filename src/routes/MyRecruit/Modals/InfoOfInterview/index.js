import React, { PropTypes } from 'react';
import styles from './index.less';

import { Row, Col } from 'antd';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

import {formatTime} from '../../../../helpers/myRecruit';

function InfoOfInterview({ cardData, ...props }) {
  const { formatMessage } = props.intl;

  const interviewInfoText = formatMessage(messages['app.my_recruit.card_content.interview_info']);
  const interviewTimeText = formatMessage(messages['app.my_recruit.card_content.interview_time']);
  const interviewersText = formatMessage(messages['app.my_recruit.card_content.interviewers']);
  const interviewRoundText = formatMessage(messages['app.my_recruit.card_content.interview_round']);
  const remarkText = formatMessage(messages['app.my_recruit.card_content.remark']);


  const interviews = props.interviews;
  const currentInterview = interviews.filter(interview => interview.id === cardData.interview.id)[0];

  const interviewers = currentInterview.interviewer_users
                                       .map(user => user.chinese_name).join(', ');

  return (
    <div className={styles.interview}>
      <div className={styles.title}>
        {interviewInfoText}
      </div>

      <div className={styles.infos}>

        <Row>
          <Col span={4}>{interviewRoundText}</Col>
          <Col span={20}>{currentInterview.mark}</Col>
        </Row>

        <Row>
          <Col span={4}>{interviewTimeText}</Col>
          <Col span={20}>{formatTime(currentInterview.time)}</Col>
        </Row>

        <Row>
          <Col span={4}>{interviewersText}</Col>
          <Col span={7}>{interviewers}</Col>
        </Row>

        <Row>
          <Col span={4}>{remarkText}</Col>
          <Col span={7}>{currentInterview.comment}</Col>
        </Row>

      </div>
    </div>
  );
}

InfoOfInterview.propTypes = {
};

export default injectIntl(InfoOfInterview);
