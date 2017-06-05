import React, { Component } from "react";
import { Spin, Button, Rate } from "antd";
import style from "../jobApplication.less";
import { injectIntl } from "react-intl";
import { getLocaleText } from "../../../locales/messages";
import dateFormat from "dateformat";
import classNames from "classnames";
import _ from "lodash";

function JobOptions({
  intl,
  applicantProfiles,
  allApplicantPositionDetailStatuses,
  onChangeOptions,
  optionsSelect,
  onShowModal,
  optionLoading,
  ApplicantPositionDetail,
  allInterviews,
  currentUser,
  region,
  readonly,
}) {

  var vm = [
    <li onClick={()=>onChangeOptions(1)} key={0} className={style.firstChoice}>第一選擇</li>,
    <li onClick={()=>onChangeOptions(2)} key={1} className={style.secondChoice}>第二選擇</li>,
    <li onClick={()=>onChangeOptions(3)} key={2} className={style.thirdChoice}>第三選擇</li>
  ];

  const salary_request = applicantProfiles.sections[1].field_values.salary_request;
  const availble_on = applicantProfiles.sections[1].field_values.available_on;

  const key = ApplicantPositionDetail.status;
  var a = allApplicantPositionDetailStatuses.find(field =>field.key === key);
  const status = getLocaleText(a, intl.locale);
  const date = new Date(applicantProfiles.created_at);

  const waitConfirm = { chinese_name: '待定', english_name: 'waitConfirm' };
  let department = getLocaleText(_.get(ApplicantPositionDetail, 'department', waitConfirm));
  let position = getLocaleText(_.get(ApplicantPositionDetail,'position', waitConfirm));

  switch (optionsSelect) {
    case 1:
      vm[0] = <li key={4} className={style.firstChoiceActive}>第一選擇</li>;
      break;
    case 2:
      vm[1] = <li key={5} className={style.secondChoiceActive}>第二選擇</li>;
      break;
    case 3:
      vm[2] = <li key={6} className={style.thirdChoiceActive}>第三選擇</li>;
      break;
    default:
      break;
  }

  const scoreInterviews = allInterviews.filter(interview => {
    return (interview.result === 'succeed' || interview.result === 'failed');
  });

  const totalRate = scoreInterviews.reduce((result, item) => {
    result = item.created_at === item.updated_at ? result : result + item.score;
    return result;
  }, 0);

  const interviewsCount = scoreInterviews.length;

  const averageRate = interviewsCount === 0 ? 0 : Math.round(totalRate / interviewsCount);


  return (
    <div>
      {/*todo api 发生了变化。*/}
      {/*<Spin spinning={optionLoading}>*/}
      <Spin spinning={false}>
        <div>
          <div className={style.options}>
            <ul>
              {vm}
            </ul>
          </div>
          <div className={style.currentOption}>
            <div className={style.leftList}>
              <ul>
                <li className={style.applyDepartment}>應徵部門:
                  <span>{department}</span>
                </li>
                <li className={style.applyJob}>應徵職位:
                  <span>{position}</span>
                </li>
                <li className={style.applyTime}>投遞時間:
                  <span>{dateFormat(date, 'yyyy/mm/dd')}</span>
                </li>
              </ul>
            </div>
            <div className={style.rightTop}>
              {status}
            </div>
            <div className={style.Rate}>
              <Rate disabled={true}
                allowHalf
                value={averageRate / 2}/>
            </div>

            <div className={classNames({ 'shouldNotShow': readonly})}
              >

            <div className={style.rightBottom}>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.manageApplicationLogInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.manageApplicationLogInMANILA !== true)) })}
              >
                <Button className={style.btnSchedule,classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                                                     currentUser.can.manage_progressApplicationLogInMACAU !== true)
                                                                                 || (region === 'manila' &&
                                                                                     currentUser.can.manage_progressApplicationLogInMANILA !== true)) })}
                         onClick={()=>onShowModal('scheduleModal')}>
                         進度
                </Button>
              </span>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.manageInterviewInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.manageInterviewInMANILA !== true)) })}
              >
                <Button className={style.btnInterview} onClick={()=>onShowModal('appointInterviewModal')}>面試</Button>
              </span>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.manageContractInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.manageContractInMANILA !== true)) })}
              >
                <Button className={style.btnSign} onClick={()=>onShowModal('appointSignModal')}>簽約</Button>
              </span>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.sendSmsInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.sendSmsInMANILA !== true)) })}
              >
                <Button className={style.btnSms} onClick={()=>onShowModal('smsModal')}>SMS</Button>
              </span>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.sendEmailObjectInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.sendEmailObjectInMANILA !== true)) })}
              >
                <Button className={style.btnEmail} onClick={()=>onShowModal('emailModal')}>E-mail</Button>
              </span>

              <span
                className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                           currentUser.can.manageAgreementFileInMACAU !== true)
                                                       || (region === 'manila' &&
                                                           currentUser.can.manageAgreementFileInMANILA !== true)) })}
              >
                <Button className={style.btnContract} onClick={()=>onShowModal('contractModal')}>合約</Button>
              </span>
            </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default injectIntl(JobOptions);
