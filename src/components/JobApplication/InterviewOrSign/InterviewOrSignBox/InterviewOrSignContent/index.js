import React, { Component } from 'react';
import { Button, Rate} from 'antd';
import style from '../../../jobApplication.less';
import classNames from 'classnames';

const InterviewOrSignContent = ({readonly, data, onShowModal, currentUser, region})=> {
  var time = null;
  if (data.time != null) {
    time = data.time.substring(0, 10) + "\u00a0\u00a0" + data.time.substring(10);
  }

  function ButtonList(data) {
    var vm = [];
    if (data.logType == 'interview') {
      vm.push(
        <span
          className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                     currentUser.can.cancelInterviewInMACAU !== true)
                                                 || (region === 'manila' &&
                                                     currentUser.can.cancelInterviewInMANILA !== true)) })}
        >
          <Button key={1} className={style.cancel}
            onClick={()=>onShowModal('confirmCancelInterviewModal', data)}>取消</Button>
        </span>
      );
      vm.push(

        <span
          className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                     currentUser.can.updateInterviewInMACAU !== true)
                                                 || (region === 'manila' &&
                                                     currentUser.can.updateInterviewInMANILA !== true)) })}
        >
          <Button key={2} className={style.alter} onClick={()=>onShowModal('alterInterviewModal', data)}>修改</Button>
        </span>
      );
      vm.push(
        <span
          className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                     currentUser.can.completeInterviewInMACAU !== true)
                                                 || (region === 'manila' &&
                                                     currentUser.can.completeInterviewInMANILA !== true)) })}
        >
          <Button key={3} className={style.finsh} onClick={()=>onShowModal('finishInterviewModal', data)}>完成面試</Button>
        </span>
      );
      if (data.result == 'succeed' || data.result == 'failed' || data.result == 'absent') {
        vm = [];
        vm.push(

          <span
            className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                       currentUser.can.updateInterviewInMACAU !== true)
                                                   || (region === 'manila' &&
                                                       currentUser.can.updateInterviewInMANILA !== true)) })}
          >
            <Button key={4} className={style.alter}
              onClick={()=>onShowModal('alterInterviewResultModal', data)}>修改</Button>
          </span>
        )
      }
      if (data.result == 'cancelled') {
        vm = [];
      }
      if (data.result == 'needed') {

      }
      if (data.result == 'agreed') {

      }
    }

    if (data.logType == 'sign') {
      vm.push(

        <span
          className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                     currentUser.can.cancelContractInMACAU !== true)
                                                 || (region === 'manila' &&
                                                     currentUser.can.cancelContractInMANILA !== true)) })}
        >
          <Button key={6} className={style.cancel} onClick={()=>onShowModal('confirmCancelSignModal', data)}>取消</Button>
        </span>
      );
      vm.push(

        <span
          className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                     currentUser.can.updateContractInMACAU !== true)
                                                 || (region === 'manila' &&
                                                     currentUser.can.updateContractInMANILA !== true)) })}
        >
          <Button key={7} className={style.alter} onClick={()=>onShowModal('alterSignModal', data)}>修改</Button>
        </span>
      );
      if (data.status == 'cancelled') {
        vm = [];
      }
    }


    return (
      <div className={style.buttonList}>
        {vm}
      </div>
    )
  }

  function Content(data) {
    var vm = [];
    if (data.logType == 'interview') {
      if (data.result == 'agreed') {
        vm.push(
          <li key="1" className={style.interviewTime}>
            面試時間：{time}
          </li>
        );
        vm.push(
          <li key="6" className={style.interviewPeople}>
            面試官：
            {data.interviewer_users.map(item=>item.chinese_name) + ' '}
          </li>
        );
        vm.push(
          <li key="4" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
      }

      if (data.result == 'needed') {
        vm.push(
          <li key="1" className={style.interviewTime}>
            面試時間：{time}
          </li>
        );
        vm.push(
          <li key="6" className={style.interviewPeople}>
            面試官：
            {data.interviewer_users.map(item=>item.chinese_name) + ' '}
          </li>
        );
        vm.push(
          <li key="4" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
      }

      if (data.result == 'cancelled') {
        vm = [];
        vm.push(
          <li key="1" className={style.interviewTime}>
            面試時間：{time}
          </li>
        );
        vm.push(
          <li key="6" className={style.interviewPeople}>
            面試官：
            {data.interviewer_users.map(item=>item.chinese_name) + ' '}
          </li>
        );
        vm.push(
          <li key="4" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
        vm.push(
          <li key="2" className={style.interviewResult}>
            取消原因: {data.cancel_reason}
          </li>
        );
      }


      if (data.result == 'refused') {
        vm.push(
          <li key="1" className={style.interviewTime}>
            面試時間：{time}
          </li>
        );
        vm.push(
          <li key="6" className={style.interviewPeople}>
            面試官：
            {data.interviewer_users.map(item=>item.chinese_name) + ' '}
          </li>
        );
        vm.push(
          <li key="4" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
      }

      //absent   cancelled  failed  needed
      if (data.result == 'succeed' || data.result == 'failed'|| data.result == 'absent') {
        vm.push(
          <li key="1" className={style.interviewTime}>
            面試時間：{time}
          </li>
        );
        vm.push(
          <li key="6" className={style.interviewPeople}>
            面試官：
            {data.interviewer_users.map(item=>item.chinese_name) + ' '}
          </li>
        );
        vm.push(
          <li key="4" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
        vm.push(
          <li key="2" className={style.interviewResult}>
            面試結果: {data.result == 'succeed' ? '通過面試' : data.result=='absent'? '未出席面試':'暫不考慮'}
          </li>
        );
        vm.push(
          <li key="3" className={style.interviewRate}>
            面試評分：<Rate allowHalf={true} disabled value={data.score / 2}/>
          </li>
        );
        vm.push(
          <li key="5" className={style.interviewEvaluation}>
            面試評價：{data.evaluation}
          </li>
        );
      }
    }

    if (data.logType == 'sign') {
      vm.push(
        <li key="11" className={style.interviewTime}>
          签约時間：{time}
        </li>
      );
      vm.push(
        <li key="4" className={style.interviewRemark}>
          備註：{data.comment}
        </li>
      );
      vm.push(
        <li key="2" className={style.interviewResult}>
          取消原因: {data.cancel_reason}
        </li>
      );
      if (data.status != 'cancelled') {
        vm = [];
        vm.push(
          <li key="21" className={style.interviewTime}>
            签约時間：{time}
          </li>
        );
        vm.push(
          <li key="14" className={style.interviewRemark}>
            備註：{data.comment}
          </li>
        );
      }

    }

    return (
      <ul>
        {vm}
      </ul>
    )
  }

  function Badge(data) {
    let vm = [];
    if (data.result == 'succeed' || data.result == 'failed' || data.result == 'absent') {
      if (data.need_again == 1) {
        vm.push(
          <div className={style.badgeYes}>
            <span>需要后续面試</span>
          </div>
        )
      }
      if (data.need_again == 0) {
        vm.push(
          <div className={style.badgeNo}>
            <span>不需要后续面試</span>
          </div>
        )
      }
      return (
        <div>
          {vm}
        </div>
      )
    }
  }

  return (
    <div className={style.cardContent}>
      {Badge(data)}
      {readonly === true ? null: ButtonList(data)}
      <span className={style.title}>
        {data.mark == undefined || data.mark == null ? null : data.mark}
        {data.logType == 'interview' ? null : data.status == 'cancelled' ? '取消签约' : '签约' }
      </span>
      {Content(data)}
    </div>
  );
};

export default InterviewOrSignContent;
