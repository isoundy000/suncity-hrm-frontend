import React, { PropTypes } from 'react';
import styles from '../../index.less';
import { Button, Row, Col, Rate } from 'antd';

import mianshiguan from '../../assets/mianshiguan.png';
import mianshijieguo from '../../assets/mianshijieguo.png';
import pingfen from '../../assets/pingfen.png';
import pingjia from '../../assets/pingjia.png';
import shijian from '../../assets/shijian.png';

import ViewButton from '../../../ViewButton';
import AgreeInterviewForScreeningModal from '../../../Modals/AgreeInterviewForScreeningModal';
import RefuseInterviewForScreeningModal from '../../../Modals/RefuseInterviewForScreeningModal';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

import {formatTime} from '../../../../../helpers/myRecruit';

function ChooseNeeded({ content, cardData, interviewHistory, ...props }) {
  const { formatMessage } = props.intl;

  const interviewTimeText = formatMessage(messages['app.my_recruit.card_content.interview_time']);
  const interviewersText = formatMessage(messages['app.my_recruit.card_content.interviewers']);
  const interviewResultText = formatMessage(messages['app.my_recruit.card_content.interview_result']);
  const interviewScoreText = formatMessage(messages['app.my_recruit.card_content.interview_score']);
  const interviewEvaluationText = formatMessage(messages['app.my_recruit.card_content.interview_evaluation']);

  /* const firstInterview = cardData.first_interview !== undefined ?  interviewHistory.filter(interview => interview.id === cardData.first_interview.id) : interviewHistory; */

  /* console.log(firstInterview); */



  /* const currentInterview = interviewHistory[interviewHistory.length - 1]; */
  /* const historyWithoutCurrent = [...interviewHistory.slice(0, (interviewHistory.length - 1))]; */

  const historyWithoutNeededAndCancelled = interviewHistory.filter(interview => (interview.result !== 'needed' &&
                                                                                 interview.result !== 'agreed' &&
                                                                                 interview.result !== 'refused' &&
                                                                                 interview.result !== 'cancelled'));

  return (
    <div>
    <div className={styles.cardBody}>
    {
      historyWithoutNeededAndCancelled.map((interview, index) => {
        const interviewers = interview.interviewer_users
                                      .map(user => user.chinese_name).join(', ');

        let interviewResult = '';
        switch (interview.result) {
          case 'succeed':
            interviewResult = '面試成功';
            break;
          case 'failed':
            interviewResult = '面試失敗';
            break;
          case 'absent':
            interviewResult = '未出席面試';
            break;
          default: break;
        }

        return (
          <div className={styles.interviewInfo} key={`interview-${index}`}>
            <div className={styles.title}>{`${interview.mark}情況`}</div>
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
                  <Rate allowHalf disabled value={interview.score / 2} />
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
                    {interview.evaluation}
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

      <AgreeInterviewForScreeningModal
        cardData={cardData}
        content={content}
        interviews={interviewHistory}
        {...props}
      />

      <RefuseInterviewForScreeningModal
        cardData={cardData}
        content={content}
        interviews={interviewHistory}
        {...props}
      />
    </div>
    </div>
  );
}


ChooseNeeded.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
  interviewHistory: React.PropTypes.array.isRequired,
};

export default injectIntl(ChooseNeeded);
