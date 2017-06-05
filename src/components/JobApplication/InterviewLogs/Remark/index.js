/**
 * Created by Jason on 2016/10/4.
 */
import React, { Component } from "react";
import { Rate } from "antd";
import style from "../../jobApplication.less";

const Remark = ({data})=> {

  function Content(data) {
    var vdom = [];

    if (data.behavior == "audience_updated") {

      if (data.info.changes.status != null) {
        if (data.info.changes.status[1] != undefined) {
          vdom.push(
            <span key={1}>
          備注： {data.info.changes.comment != null ? data.info.changes.comment[1] : null}
        </span>
          );
        }
      }

    }

    if (data.behavior == "interviewer_updated") {
      if (data.info.changes.hasOwnProperty('status')) {
        vdom.push(
          <span key={2}>
          備注： {data.info.changes.comment != null ? data.info.changes.comment[1] : null}
        </span>
        );
      }
    }

    if (data.behavior == "sms_sent") {
      vdom.push(
        <span key={4}>
          SMS 内容：
          {data.info.sms.content}
          < br />
        </span>
      );
    }
    if (data.behavior == "email_sent") {
      if (data.info.email_object.body.indexOf('詳情請點擊')) {
        let index = data.info.email_object.body.indexOf('詳情請點擊');
        let str = data.info.email_object.body.substr(index);
        data.info.email_object.body = data.info.email_object.body.replace(str, ' ');
        data.info.email_object.body = data.info.email_object.body.replace('\n\n', ' ');
      }
      let str = data.info.email_object.body;
      vdom.push(
        <span key={5}>
          E-mail内容：
          {str.split("\n").map(function (item) {
            return (
              <span key={Math.random()}>
                {item}
                <br/>
              </span>
            )
          })}
        </span>
      );
    }
    if (data.behavior == "contract_created") {
      vdom.push(
        <span key={6}>
          簽約時間：
          {data.info.contract.time !=null? data.info.contract.time.substring(0,10)+"\u00a0\u00a0"+data.info.contract.time.substring(10) : null}
          < br />
          備注：
          {data.info.contract.comment}
        </span>
      );
    }
    if (data.behavior == "contract_updated") {
      if (data.info.changes.hasOwnProperty('status')) {
        if (data.info.changes.status[1] == 'cancelled') {
          vdom.push(
            <span key={7}>
              取消原因：
              {data.info.changes.cancel_reason[1]}
              < br />
            </span>
          );
        }
      }else {
      vdom.push(
        <span key={8}>
          簽約時間：
          {data.info.contract.time != null? data.info.contract.time.substring(0,10)+"\u00a0\u00a0"+data.info.contract.time.substring(10) : null}
          < br />
          備注：
          {data.info.contract.comment}
        </span>
      );
      }
    }


    if (data.behavior == "interview_created") {
      vdom.push(
        <span key={9}>
          面試時間：
          {data.info.interview.time != null?data.info.interview.time.substring(0,10)+"\u00a0\u00a0"+data.info.interview.time.substring(10):null}
          < br />
          面試官：
          {data.info.interviewer_users === undefined ? data.user.chinese_name : data.info.interviewer_users.map(user => user[1]).join(', ')}
          < br />
          備注：
          {data.info.interview.comment}
        </span>
      );
    }
    if (data.behavior == "interview_updated") {
      vdom.push(
        <span key={10}>
              面試結果：
              通過面試
              <br/>
              面試評分：
              <Rate disabled allowHalf={true} value={data.info.interview.score / 2}/>
              <br/>
              面試評價：
          {data.info.interview.evaluation}
          <br/>
          {data.info.interview.need_again == '0' ? '不需要後續面試' : '需要後續面試'}
            </span>
      );
      if (data.info.changes.hasOwnProperty('result')) {
        if (data.info.changes.result[1] == 'cancelled') {
          vdom = [];
          vdom.push(
            <span key={11}>
              取消原因：
              {data.info.interview.cancel_reason}
            </span>
          );
        }
        if (data.info.changes.result[1] == 'absent') {
          vdom = [];
          vdom.push(
            <span key={12}>
              面試結果：
              未出席面試
              <br/>
              面試評分：
              <Rate disabled allowHalf={true} value={data.info.interview.score / 2}/>
              <br/>
              面試評價：
              {data.info.interview.evaluation}
              <br/>
              {data.info.interview.need_again == '0' ? '不需要後續面試' : '需要後續面試'}
            </span>
          );
        }
        if (data.info.changes.result[1] == 'succeed') {
          vdom = [];
          vdom.push(
            <span key={13}>
              面試結果：
              通過面試
              <br/>
              面試評分：
              <Rate disabled allowHalf={true} value={data.info.interview.score / 2}/>
              <br/>
              面試評價：
              {data.info.interview.evaluation}
              <br/>
              {data.info.interview.need_again == '0' ? '不需要後續面試' : '需要後續面試'}
            </span>
          );
        }
        if (data.info.changes.result[1] == 'failed') {
          vdom = [];
          vdom.push(
            <span key={14}>
              面試結果：
              暫不考慮
              <br/>
              面試評分：
              <Rate disabled allowHalf={true} value={data.info.interview.score / 2}/>
              <br/>
              面試評價：
              {data.info.interview.evaluation}
              <br/>
              {data.info.interview.need_again == '0' ? '不需要後續面試' : '需要後續面試'}
            </span>
          );
        }
      }

    }

    if (data.behavior == 'applicant_position_updated') {
      const status = data.info.changes.status;
      if (data.info.changes.hasOwnProperty('comment')) {

        if (data.info.changes.comment[1] != undefined) {
          vdom.push(
            <span key={15}>
              備注：{data.info.changes.comment[1]}
            </span>
          );
        }

      }

    }

    return (
      <div className={style.remark}>
        {vdom}
      </div>
    );
  }

  return (
    <div>
      {
        Content(data)
      }
    </div>
  );
}
;

export default Remark;
