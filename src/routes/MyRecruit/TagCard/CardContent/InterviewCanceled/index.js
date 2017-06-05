import React, { PropTypes } from 'react';
import styles from '../../index.less';
import { Button, Row, Col, Rate } from 'antd';

import mianshiguan from '../../assets/mianshiguan.png';
import shijian from '../../assets/shijian.png';
import quxiaoyuanyin from '../../assets/quxiaoyuanyin.png';

import ViewButton from '../../../ViewButton';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

import {formatTime} from '../../../../../helpers/myRecruit';

function InterviewCanceled({ content, cardData, interviewHistory, ...props }) {
  const { formatMessage } = props.intl;

  const interviewTimeText = formatMessage(messages['app.my_recruit.card_content.interview_time']);
  const interviewersText = formatMessage(messages['app.my_recruit.card_content.interviewers']);
  const cancelReasonText = formatMessage(messages['app.my_recruit.card_content.cancel_reason']);

  const currentInterview = interviewHistory.filter(interview => interview.id === cardData.interview_id);

  return (
    <div>
      <div className={styles.cardBody}>
        {
          currentInterview.map((interview, index) => {
            const interviewers = interview.interviewer_users
                                          .map(user => user.chinese_name).join(', ');

            return (
              <div className={styles.interviewInfo} key={`interview-${index}`}>
                <div className={styles.title}>面試信息</div>
                <Row type="flex">
                  <Col span={3}>
                    <div className={styles.item}>
                      <span className={styles.icons}><img alt="" src={shijian} /></span>
                      <span>
                        {interviewTimeText}
                      </span>
                    </div>
                  </Col>
                  <Col span={21}>
                    <span className={styles.result}>
                      {formatTime(interview.time)}
                    </span>
                  </Col>
                </Row>

                <Row type="flex">
                  <Col span={3}>
                    <div className={styles.item}>
                      <span className={styles.icons}><img alt="" src={mianshiguan} /></span>
                      <span>
                        {interviewersText}
                      </span>
                    </div>
                  </Col>
                  <Col span={21}>
                    <span className={styles.result}>
                      {interviewers}
                    </span>
                  </Col>
                </Row>

                <Row type="flex">
                  <Col span={3}>
                    <div className={styles.item}>
                      <span className={styles.icons}><img alt="" src={quxiaoyuanyin} /></span>
                      <span>
                        {cancelReasonText}
                      </span>
                    </div>
                  </Col>
                  <Col span={21}>
                    <span className={styles.result}>
                      <p>
                        {cardData.interview.cancel_reason}
                      </p>
                    </span>
                  </Col>
                </Row>
              </div>
            );
          })
        }
      </div>

      <div className={styles.cardFooter}>
        <ViewButton
          cardDataId={cardData.id}
          applicantProfileId={cardData.applicant_profile.id}
        />
      </div>
    </div>
  );
}


InterviewCanceled.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
  interviewHistory: React.PropTypes.array.isRequired,
};

export default injectIntl(InterviewCanceled);
