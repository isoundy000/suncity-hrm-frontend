import React, { Component } from "react";
import style from "../../jobApplication.less";
import dateFormat from "dateformat";
import { injectIntl } from "react-intl";
import { getLocaleText } from "../../../../locales/messages";

const LogTitle = ({smsTemplates, agreement_files, intl, data, allStatus})=> {
  function Content(data, allStatus) {

    if (data.behavior == "audience_updated") {

      if (data.info.changes.status != null) {
        if (data.info.changes.status[1] == 'agreed') {
          return (
            <div>
              <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name} 同意接見
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
              </li>
            </div>
          )
        }
        if (data.info.changes.status[1] == 'rejected') {
          return (
            <div>
              <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name} 拒絕了接見
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
              </li>
            </div>
          )
        }
      }
    }
    if (data.behavior == "interviewer_updated") {
      if (data.info.changes.hasOwnProperty('status')) {
        if (data.info.changes.status[1] == 'interview_agreed') {
          return (
            <div>
              <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name} 同意了面試
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
              </li>
            </div>
          )
        }
        if (data.info.changes.status[1] == 'interview_refused') {
          return (
            <div>
              <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name} 拒絕了面試
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
              </li>
            </div>
          )
        }
      }

    }
    if (data.behavior == "sms_sent") {


      let mark = null;
      let markTemplate = null;
      let markToUser = null;

      if (data.info.sms.mark != null) {
        mark = data.info.sms.mark;
        mark.indexOf('to_applicant') != -1 ? markToUser = '求職者' : markToUser = '介紹人';
        if (smsTemplates != null) {
          for (let key in smsTemplates) {
            if (mark.indexOf(key) != -1) {
              window.aa = smsTemplates;
              markTemplate = smsTemplates[key].title;
            }
          }
        }
      }

      return (
        <div>
          <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name}
              給 {markToUser}
              發送了 {markTemplate} SMS
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == "email_sent") {
      return (
        <div>
          <li className={style.dotBlue}>
            <span
              className={style.log}>{data.user.chinese_name} 給 {data.info.email_object.to}
              發送了一封
              {data.info.email_object.mark == 'audience' ? ' 接見 ' : null}
              {data.info.email_object.mark == '通知接見' ? ' 通知接見 ' : null}
              {data.info.email_object.mark == '通知面試' ? ' 通知面試 ' : null}
              {data.info.email_object.mark == 'audience_agreed_to_hr' ? ' 同意接見 ' : data.info.email_object.mark == 'audience_refused_to_hr' ? ' 拒絕接見 ' : null
              }
              郵件
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == "agreement_file_removed") {
      let file_name = null;
      for (let item in agreement_files) {
        item == data.info.agreement_file.file_key ? file_name = agreement_files[item] : null;
      }
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}刪除了合約 {file_name}
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }

    if (data.behavior == "agreement_file_created") {
      let file_name = null;
      for (let item in agreement_files) {
        item == data.info.agreement_file.file_key ? file_name = agreement_files[item] : null;
      }
      if (agreement_files != null) {
        return (
          <div>
            <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}創建了合約 {file_name}
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
            </li>
          </div>
        )
      }
    }
    if (data.behavior == "agreement_file_deleted") {
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}刪除了合約{data.info.agreement_file.id}
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == "contract_created") {
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}預約了簽約
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == "contract_updated") {
      if (data.info.changes.hasOwnProperty('status')) {
        if (data.info.changes.status[1] == 'cancelled') {
          return (
            <div>
              <li className={style.dotBlue}>
                <span className={style.log}>{data.user.chinese_name}取消了簽約
                  <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
                </span>
              </li>
            </div>
          )
        }
      }
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}修改了簽約
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == "interview_created") {
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}預約了{data.info.interview.mark}
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }

    if (data.behavior == "interview_updated") {
      if (data.info.changes.hasOwnProperty('result')) {
        if (data.info.changes.result[1] == 'cancelled') {
          return (
            <div>
              <li className={style.dotBlue}>
                <span className={style.log}>{data.user.chinese_name}取消了{data.info.interview.mark}
                  <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
                </span>
              </li>
            </div>
          )
        }
        if (data.info.changes.result[0] == 'needed') {
          if (data.info.changes.result[1] == 'succeed' || data.info.changes.result[1] == 'failed') {
            return (
              <div>
                <li className={style.dotYellow}>
                <span className={style.log}>{data.user.chinese_name} 完成了 {data.info.interview.mark}
                  <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
                </span>
                </li>
              </div>
            )
          }
        }

        // if (data.info.changes.result[1] == 'absent') {
        //   return (
        //     <div>
        //       <li className={style.dotBlue}>
        //         <span className={style.log}> 未出席 {data.info.interview.mark}
        //           <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
        //         </span>
        //       </li>
        //     </div>
        //   )
        // }

        return (
          <div>
            <li className={style.dotBlue}>
              <span className={style.log}>{data.user.chinese_name} 修改了 {data.info.interview.mark} 面試結果
                <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
              </span>
            </li>
          </div>
        )
      }
      return (
        <div>
          <li className={style.dotBlue}>
            <span className={style.log}>{data.user.chinese_name}修改了{data.info.interview.mark} 面試結果
              <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
            </span>
          </li>
        </div>
      )
    }
    if (data.behavior == 'applicant_position_updated') {
      const status = data.info.changes.status;
      const comment = data.info.changes.comment;
      // 兩次點開進度彈窗並進行同一個選擇，下次返回的 changes 中沒有 status（显示标题为 修改了进度備註內容）
      if(comment){
        return (
          <div>
            <li className={style.dotYellow}>
              <span className={style.log}>{data.user.chinese_name} 更新了求職進度的備註內容
                <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
              </span>
            </li>
          </div>
        )
      }

      // 兩次點開進度彈窗並進行同一個選擇，下次返回的 changes 中沒有 status（因爲不應重複出現在 log 中）
      if (status !== undefined) {
        const statusArray = status[1].split('_');
        const arrayLength = statusArray.length;
        const trueStatus = (statusArray[arrayLength - 2] === 'interview' &&
        statusArray[arrayLength - 1] === 'failed') ? `${statusArray.slice(0, arrayLength - 1).join('_')}_rejected` : status[1];

        const statusText = getLocaleText(allStatus.find(value => value.key === trueStatus), intl.locale);
        return (
          <div>
            <li className={style.dotYellow}>
              <span className={style.log}>{data.user.chinese_name} 更新了求職狀態為 {statusText}
                <span className={style.logTime}>{dateFormat(data.created_at, 'yyyy/mm/dd HH:MM')}</span>
              </span>
            </li>
          </div>
        )
      }
    }
  }

  return (
    <div>
      {
        Content(data, allStatus)
      }
    </div>
  );
};

export default injectIntl(LogTitle);
