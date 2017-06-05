import React, { PropTypes } from 'react';
import styles from '../../index.less';
import { Button, Row, Col, Rate } from 'antd';

import classNames from 'classnames/bind';

import mianshiguan from '../../assets/mianshiguan.png';
import shijian from '../../assets/shijian.png';
import pingjia from '../../assets/pingjia.png';
import beizhu from '../../assets/beizhu.png';
import mianshijieguo from '../../assets/mianshijieguo.png';
import pingfen from '../../assets/pingfen.png';

import ViewButton from '../../../ViewButton';
import ModifyModal from '../../../Modals/ModifyModal';
/* import CancelInterviewModal from '../../../Modals/CancelInterviewModal'; */

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

import {formatTime} from '../../../../../helpers/myRecruit';

function InterviewCompleted({ content, cardData, interviewHistory, nth, ...props }) {
  const { formatMessage } = props.intl;

  const interviewTimeText = formatMessage(messages['app.my_recruit.card_content.interview_time']);
  const interviewersText = formatMessage(messages['app.my_recruit.card_content.interviewers']);
  const interviewResultText = formatMessage(messages['app.my_recruit.card_content.interview_result']);
  const interviewScoreText = formatMessage(messages['app.my_recruit.card_content.interview_score']);
  const interviewEvaluationText = formatMessage(messages['app.my_recruit.card_content.interview_evaluation']);
  const remarkText = formatMessage(messages['app.my_recruit.card_content.remark']);

  const currentInterview = interviewHistory.filter(interview => interview.id === cardData.interview_id)[0];
  const interviewers = currentInterview.interviewer_users
                                       .map(user => user.chinese_name).join(', ');

  let interviewResult = '';
  if (currentInterview.result === 'succeed') {
    interviewResult = '面試成功';
  } else if (currentInterview.result === 'failed') {
    interviewResult = '面試失敗';
  } else if (currentInterview.result === 'absent') {
    interviewResult = '未出席面試';
  }

  const cx = classNames.bind(styles);

  let againTag;

  const ifAgainTag = cx({
    againTag: true,
    needAgainTag: currentInterview.need_again === 1,
    doesntNeedAgainTag: currentInterview.need_again !== 1,
  });

  if (currentInterview.need_again === 1) {
    againTag = (<div className={ifAgainTag}>需要後續面試</div>);
  } else {
    againTag = (<div className={ifAgainTag}>不需要後續面試</div>);
  }

  return (
    <div>
      <div className={styles.cardBody}>

        {againTag}

        <div className={styles.interviewInfo}>
          <div className={styles.title}>面試信息</div>
          <Row>
            <Col span={3}>
              <div className={styles.item}>
                <span className={styles.icons}><img alt="" src={shijian} /></span>
                <span>
                  {interviewTimeText}
                </span>
              </div>
            </Col>
            <Col span={18}>
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
                <span className={styles.icons}><img alt="" src={mianshijieguo} /></span>
                <span>
                  {interviewResultText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                {interviewResult}
              </span>
            </Col>
          </Row>

          <Row type="flex">
            <Col span={3}>
              <div className={styles.item}>
                <span className={styles.icons}><img alt="" src={pingfen} /></span>
                <span>
                  {interviewScoreText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                <Rate allowHalf disabled value={currentInterview.score / 2} />
              </span>
            </Col>
          </Row>

          <Row type="flex">
            <Col span={3}>

              <div className={styles.item}>
                <span className={styles.icons}><img alt="" src={pingjia} /></span>
                <span>
                  {interviewEvaluationText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                <p>
                  {currentInterview.evaluation}
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

        <ModifyModal
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


InterviewCompleted.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
  interviewHistory: React.PropTypes.array.isRequired,
};

export default injectIntl(InterviewCompleted);
