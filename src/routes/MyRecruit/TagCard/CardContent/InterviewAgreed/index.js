import React, { PropTypes } from 'react';
import styles from '../../index.less';
import { Button, Row, Col, Rate } from 'antd';

import mianshiguan from '../../assets/mianshiguan.png';
import shijian from '../../assets/shijian.png';
import beizhu from '../../assets/beizhu.png';

import ViewButton from '../../../ViewButton';
import CompleteModal from '../../../Modals/CompleteModal';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

import {formatTime} from '../../../../../helpers/myRecruit';

function InterviewNeeded({ content, cardData, interviewHistory, nth, ...props }) {
  const { formatMessage } = props.intl;

  const agreeRemarkText = formatMessage(messages['app.my_recruit.card_content.interview_agree_remark']);
  const remarkText = formatMessage(messages['app.global.remark']);
  const interviewTimeText = formatMessage(messages['app.my_recruit.card_content.interview_time']);
  const interviewersText = formatMessage(messages['app.my_recruit.card_content.interviewers']);

  const currentInterview = interviewHistory.filter(interview => interview.id === cardData.interview_id)[0];
  const interviewers = currentInterview.interviewer_users
                                       .map(user => user.chinese_name).join(', ');

  return (
    <div>
      <div className={styles.cardBody}>
        <div className={styles.interviewInfo}>
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
                {formatTime(currentInterview.time)}
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
                <span className={styles.icons}><img alt="" src={beizhu} /></span>
                <span>
                  {remarkText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                <p>
                  {cardData.interview.comment}
                </p>
              </span>
            </Col>
          </Row>

          <Row type="flex">
            <Col span={3}>
              <div className={styles.item}>
                <span className={styles.icons}><img alt="" src={beizhu} /></span>
                <span>
                  {agreeRemarkText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                <p>
                  {cardData.comment}
                </p>
              </span>
            </Col>
          </Row>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <ViewButton
          cardDataId={cardData.id}
          applicantProfileId={cardData.applicant_profile.id}
        />

        <CompleteModal
          content={content}
          cardData={cardData}
          profile={cardData.applicant_profile}
          interviews={interviewHistory}
          departmentName={props.departmentName}
          positionName={props.positionName}
          nth={nth}
          {...props}
        />

      </div>
    </div>
  );
}


InterviewNeeded.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
  interviewHistory: React.PropTypes.array.isRequired,
};

export default injectIntl(InterviewNeeded);
