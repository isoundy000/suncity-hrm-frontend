import React, { PropTypes } from 'react';
/* import { connect } from 'dva'; */
import { Link } from 'react-router';
import { } from 'antd';
import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import { formatTime } from '../../../helpers/myRecruit';

function MessageContent({ record, content, currentPage, dispatch, ...props }) {
  const messageContent = record.content;

  const action = messageContent.action !== undefined ? messageContent.action : null;
  const object = messageContent.object !== undefined ? messageContent.object : null;
  const actor = messageContent.actor !== undefined ? messageContent.actor : null;

  const handleMarkRead = () => {
    dispatch({
      type: 'myMessages/markRead',
      payload: {
        type: content,
        id: record.id,
        currentPage,
      },
    });
  }


  const dealWithApplicantPositionCreated = ({str}) => {
    const meta = object.meta;

    const applicantProfile = meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;

    const position = meta.position.chinese_name;
    const department = meta.department.chinese_name;
    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      求職者<Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>提交了
  {position && department !== undefined ? `[${department}${position}]` : '[待定]'}
  的職位申請
    </span>);
  }

  const dealWithApplicant = ({ result, task }) => {
    const tail = task === true ? '，請處理後續流程' : '';

    const applicantProfile = object.meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;
    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      求職者<Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>{result}{tail}
    </span>);
  }

  const dealWithPositionChangeRequest = (result) => { // TODO
    const department = actor.chinese_name;
    const url = `/applicant_profiles`;

    return (<span>
      您提交的<Link to={url} onClick={handleMarkRead}>【部門職位變更申請】</Link>[{department}]{result}
    </span>);
  }

  const dealWithCountChangeRequest = (result) => { // TODO
    const department = actor.chinese_name;
    const url = `/applicant_profiles`;

    return (<span>
      您提交的<Link to={url} onClick={handleMarkRead}>【部門全職/兼職人數變更申請】</Link>[{department}]{result}
    </span>);
  }


  /* task */

  const dealWithAudienceCreated = () => {
    const applicantProfile = object.meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;
    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      收到了求職者
      <Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>
      的
      <Link to='/recruit/myrecruit' onClick={handleMarkRead}> 【接見邀請】 </Link>
      ，請處理後續流程
    </span>);
  }

  const dealWithInterviewCreated = () => {
    const meta = object.meta;

    const applicantProfile = meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;

    const interviewTime = formatTime(meta.interview.time);
    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      需在 {interviewTime} 參加求職者
      <Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>
      的
      <Link to='/recruit/myrecruit?tab=interviewers' onClick={handleMarkRead}> 【面試】 </Link>
      ，請處理後續流程
    </span>);
  }

  const dealWithAudience = (result) => {
    const applicantProfile = object.meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;

    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      面試官{result}接見求職者
      <Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>
      ，請處理後續流程
    </span>);
  }

  const dealWithInterviewerInterview = (result) => {
    const applicantProfile = object.meta.applicant_profile;
    const username = applicantProfile.chinese_name;
    const id = applicantProfile.id;

    const url = `/applicant_profiles/${id}?editable=false`;

    return (<span>
      面試官{result}了求職者
      <Link to={url} onClick={handleMarkRead}> 【{username}】 </Link>
      的面試，請處理後續流程
    </span>);
  }

  const dealWithChangeRequestTask = (where) => { // TODO
    return (<span>
      收到
      <Link to='/applicant_profiles' onClick={handleMarkRead}> 【{where}】 </Link>
      申請，請處理後續流程
    </span>);
  }


  let formatContent;

  switch (action) {
    case 'applicant_position_created': {
      formatContent = dealWithApplicantPositionCreated('hello');
      break;
    }

    case 'applicant_profile_updated': {
      formatContent = dealWithApplicant({ result: '面試信息已更新', task: false });
      break;
    }

    case 'applicant_already_entry': {
      formatContent = dealWithApplicant({ result: '已入職', task: true });
      break;
    }

    case 'interview_cancelled': {
      formatContent = dealWithApplicant({ result: '面試已取消', task: false });
      break;
    }

    case 'agree_position_change_request': { // TODO
      formatContent = dealWithPositionChangeRequest('已同意申請');
      break;
    }

    case 'refuse_position_change_request': { // TODO
      formatContent = dealWithPositionChangeRequest('已拒絕申請');
      break;
    }

    case 'position_change_request_success': { // TODO
      formatContent = dealWithPositionChangeRequest('申請成功');
      break;
    }

    case 'agree_count_change_request': { // TODO
      formatContent = dealWithCountChangeRequest('已同意申請');
      break;
    }

    case 'refuse_count_change_request': { // TODO
      formatContent = dealWithCountChangeRequest('已拒絕申請');
      break;
    }

    case 'count_change_request_success': { // TODO
      formatContent = dealWithCountChangeRequest('申請成功');
      break;
    }

    case 'audience_created': {
      formatContent = dealWithAudienceCreated();
      break;
    }

    case 'interview_created': {
      formatContent = dealWithInterviewCreated();
      break;
    }

    case 'audience_agreed': {
      formatContent = dealWithAudience('同意');
      break;
    }

    case 'audience_rejected': {
      formatContent = dealWithAudience('拒絕');
      break;
    }

    case 'interviewer_interview_agreed': {
      formatContent = dealWithInterviewerInterview('同意');
      break;
    }

    case 'interviewer_interview_refused': {
      formatContent = dealWithInterviewerInterview('拒絕');
      break;
    }

    case 'interviewer_interview_completed': {
      formatContent = dealWithApplicant({ result: '面試已完成', task: true });
      break;
    }

    case 'interview_updated': {
      const interview = object.meta.interview;
      if (interview.result === 'succeed' ||
        interview.result === 'failed' ||
        interview.result === 'absent') {
        formatContent = dealWithApplicant({ result: '結果已修改', task: true });
      } else {
        formatContent = dealWithApplicant({ result: '面試信息已更新', task: false });
      }
      break;
    }

    case 'applicant_join': {
      formatContent = dealWithApplicant({ result: '已入職', task: true });
      break;
    }

    case 'count_change': {
      formatContent = dealWithChangeRequestTask('部門全職/兼職人數變更');
      break;
    }

    case 'position_change': {
      formatContent = dealWithChangeRequestTask('部門職位變更');
      break;
    }

    default:
      break;
  }

  return (
    <div>
      {formatContent}
      {/* {record.content} */}
    </div>
  );
}

MessageContent.propTypes = {
  record: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

/* const mapStateToProps = ({ myRecruit }) => ({
 myRecruit,
 });
 */
/* export default connect(mapStateToProps)(injectIntl(MessageContent)); */

export default injectIntl(MessageContent);
