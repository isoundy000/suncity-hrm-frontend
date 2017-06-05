import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './index.less';
import { Button, Row, Col, Rate } from 'antd';
import classNames from 'classnames/bind';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import ChooseNeeded from './CardContent/ChooseNeeded';
import ChooseAgreed from './CardContent/ChooseAgreed';
import ChooseRefused from './CardContent/ChooseRefused';
import InterviewNeeded from './CardContent/InterviewNeeded';
import InterviewAgreed from './CardContent/InterviewAgreed';
import InterviewRefused from './CardContent/InterviewRefused';
import InterviewCompleted from './CardContent/InterviewCompleted';
import InterviewCanceled from './CardContent/InterviewCanceled';

import { HOST } from '../../../constants/APIConstants';

function TagCard({ content, cardData, ...props }) {
  console.log('card', cardData);

  const findNth = (interview) => {
    let nth = '';
    switch (interview.mark) {
      case '第一次面試':
        nth = 'first';
        break;
      case '第二次面試':
        nth = 'second';
        break;
      case '第三次面試':
        nth = 'third';
        break;
      default:
        break;
    }
    return nth;
  };


  const { formatMessage } = props.intl;

  const chooseNeededText = formatMessage(messages['app.my_recruit.tag_card.choose_needed']);
  const chooseAgreedText = formatMessage(messages['app.my_recruit.tag_card.choose_agreed']);
  const chooseRefusedText = formatMessage(messages['app.my_recruit.tag_card.choose_refused']);
  const interviewNeededText = formatMessage(messages['app.my_recruit.tag_card.interview_needed']);
  const interviewAgreedText = formatMessage(messages['app.my_recruit.tag_card.interview_agreed']);
  const interviewRefusedText = formatMessage(messages['app.my_recruit.tag_card.interview_refused']);
  const interviewCompletedText = formatMessage(messages['app.my_recruit.tag_card.interview_completed']);
  const interviewCanceledText = formatMessage(messages['app.my_recruit.tag_card.interview_canceled']);

  const applyDepartmentText = formatMessage(messages['app.my_recruit.tag_card.apply_department']);
  const applyPositionText = formatMessage(messages['app.my_recruit.tag_card.apply_position']);
  const applicantNoText = formatMessage(messages['app.my_recruit.tag_card.applicant_no']);
  const sexText = formatMessage(messages['app.my_recruit.tag_card.sex']);


  /* console.log(cardData); */
  /* const chineseName = cardData.applicant_profile.chinese_name; */
  /* const applicantNo = cardData.applicant_profile.applicant_no; */

  const chineseName = cardData.applicant_profile ? cardData.applicant_profile.chinese_name : '';
  const applicantNo = cardData.applicant_profile ? cardData.applicant_profile.applicant_no : '';

  const personalInformation = cardData.applicant_profile.data.personal_information.field_values;

  const gender = personalInformation.gender === 'male' ? '男' : '女';
  const photo = personalInformation.photo;

  const gravatar = (photo === undefined || photo === '') ?
                   (<Link to={`/applicant_profiles/${cardData.applicant_profile.id}?readonly=true&profileOnly=true`}><img alt="" /></Link>) :
                   (<Link to={`/applicant_profiles/${cardData.applicant_profile.id}?readonly=true&profileOnly=true`}><img alt="gravatar" src={`${HOST}${photo}`} /></Link>);

  /* const interview = cardData.interview; */
  /* const { time, score, comment } = interview; */

  /* const applicantPosition = interview.applicant_position; */

  const applicantPosition = content === 'audiences' ? cardData.applicant_position : cardData.interview.applicant_position;

  const historyResult = props.db.interviewsList[applicantPosition.id];
  const interviewHistory = historyResult === undefined ? [] : historyResult;

  const deptId = applicantPosition.department_id;
  const positionId = applicantPosition.position_id;
  const { departments, positions } = props.db.lists;
  let departmentName = '';
  let positionName = '';


  if (departments && departments.length > 0) {
    const department = departments.find(dept => dept.id === deptId);
    if (department) {
      departmentName = department.chinese_name;
    }
  }

  if (positions && positions.length > 0) {
    const position = positions.find(position => position.id === positionId);
    if (position) {
      positionName = position.chinese_name.split(' ')[0];
    }
  }

  let tagTitle = '';
  let cardContent = '';

  switch (cardData.status) {
    case 'choose_needed':
      tagTitle = chooseNeededText;
      cardContent = (
        <ChooseNeeded
          content={content}
          cardData={cardData}
          interviewHistory={interviewHistory}
          {...props}
        />
      );
      break;
    case 'agreed':
      tagTitle = chooseAgreedText;
      cardContent = (
        <ChooseAgreed
          content={content}
          cardData={cardData}
          interviewHistory={interviewHistory}
          {...props}
        />
      );
      break;
    case 'rejected':
      tagTitle = chooseRefusedText;
      cardContent = (
        <ChooseRefused
          content={content}
          cardData={cardData}
          interviewHistory={interviewHistory}
          {...props}
        />
      );
      break;
    case 'interview_needed':
      const interviewResult = cardData.interview.result;

      if (interviewResult === 'needed') {
        tagTitle = interviewNeededText;
        cardContent = (
          <InterviewNeeded
            cardData={cardData}
            content={content}
            interviewHistory={interviewHistory}
            departmentName={departmentName}
            positionName={positionName}
            nth={findNth(cardData.interview)}
            {...props}
          />
        );
      } else if (interviewResult === 'cancelled') {
        tagTitle = interviewCanceledText;
        cardContent = (
          <InterviewCanceled
            cardData={cardData}
            content={content}
            interviewHistory={interviewHistory}
            departmentName={departmentName}
            positionName={positionName}
            {...props}
          />
        );
      } else {
        tagTitle = interviewCompletedText;
        cardContent = (
          <InterviewCompleted
            cardData={cardData}
            content={content}
            interviewHistory={interviewHistory}
            departmentName={departmentName}
            positionName={positionName}
            nth={findNth(cardData.interview)}
            {...props}
          />
        );
      }

      break;
    case 'interview_agreed':
      tagTitle = interviewAgreedText;
      cardContent = (
        <InterviewAgreed
          cardData={cardData}
          content={content}
          interviewHistory={interviewHistory}
          departmentName={departmentName}
          positionName={positionName}
          nth={findNth(cardData.interview)}
          {...props}
        />
      );
      break;
    case 'interview_refused':
      tagTitle = interviewRefusedText;
      cardContent = (
        <InterviewRefused
          cardData={cardData}
          content={content}
          interviewHistory={interviewHistory}
          departmentName={departmentName}
          positionName={positionName}
          nth={findNth(cardData.interview)}
          {...props}
        />
      );
      break;

    case 'interview_completed':
      tagTitle = interviewCompletedText;
      cardContent = (
        <InterviewCompleted
          cardData={cardData}
          content={content}
          interviewHistory={interviewHistory}
          departmentName={departmentName}
          positionName={positionName}
          nth={findNth(cardData.interview)}
          {...props}
        />
      );
      break;


    case 'interview_cancelled': // 'interview_canceled'
      tagTitle = interviewCanceledText;
      cardContent = (
        <InterviewCanceled
          cardData={cardData}
          content={content}
          interviewHistory={interviewHistory}
          departmentName={departmentName}
          positionName={positionName}
          {...props}
        />
      );
      break;

    default:
      break;
  }

  const cx = classNames.bind(styles);

  const interviewResult = cardData.interview ? cardData.interview.result : false;

  const tagButton = cx({
    tag: true,
    tagYellow: cardData.status === 'choose_needed' || (cardData.status === 'interview_needed' && interviewResult === 'needed'),
    tagGreen: cardData.status === 'agreed' || cardData.status === 'interview_agreed',
    tagRed: cardData.status === 'rejected' || cardData.status === 'interview_refused',
    tagBlue: cardData.status === 'interview_completed' || (cardData.status === 'interview_needed' &&
                                                           interviewResult !== 'needed' &&
                                                           interviewResult !== 'cancelled'),
    tagGrey: cardData.status === 'interview_cancelled' || (cardData.status === 'interview_needed' && interviewResult === 'cancelled'), // 'interview_canceled'
  });

  const card = cx({
    card: true,
    lightColor:
    cardData.status === 'agreed' ||
    cardData.status === 'rejected' ||
    cardData.status === 'interview_refused' ||
    cardData.status === 'interview_completed' ||
    cardData.status === 'interview_cancelled', // 'interview_canceled'
  });

  return (
    <div className={styles.wholeCard}>
      <div className={tagButton}>
        <div>{tagTitle}</div>
      </div>
      <div className={card}>
        <div className={styles.cardHeader}>
          <div className={styles.textInfo}>
            <div className={styles.name}>
              {chineseName}
            </div>
            <div className={styles.personalInfo}>
              <span>{applyDepartmentText}：</span><span className={styles.info}>{departmentName}</span>
              <span>{applyPositionText}：</span><span className={styles.info}>{positionName}</span>
              <span>{applicantNoText}：</span><span className={styles.info}>{applicantNo}</span>
              <span>{sexText}：</span><span className={styles.info}>{gender}</span>
            </div>
          </div>
          <div className={styles.gravatar}>
            {gravatar}
          </div>
        </div>

        {cardContent}

      </div>
    </div>
  );
}

TagCard.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
};

export default injectIntl(TagCard);
