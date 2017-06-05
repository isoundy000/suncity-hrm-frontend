import React, { Component } from 'react';
import style from '../../jobApplication.less';
import InterviewOrSignContent from './InterviewOrSignContent';


const InterviewOrSignBox = ({readonly, data, onShowModal, currentUser, region})=> {
  function Box(data) {
    const vm = [];
    if (data.logType == 'interview') {
      if (data.result != undefined) {
        switch (data.result) {
          case 'refused':
            vm.push(
              <div key={1} className={style.interviewStatusRefuse}>
                <span>
                  已拒絕
                </span>
              </div>
            );
            break;
          case 'absent':
            vm.push(
              <div key={1} className={style.interviewStatusFinish}>
                <span>
                  已完成
                </span>
              </div>
            );
            break;
          case 'succeed':
            vm.push(
              <div key={2} className={style.interviewStatusFinish}>
                <span>
                  已完成
                </span>
              </div>
            );
            break;
          case 'failed':
            vm.push(
              <div key={2} className={style.interviewStatusFinish}>
                <span>
                  已完成
                </span>
              </div>
            );
            break;
          case 'cancelled':
            vm.push(
              <div key={3} className={style.interviewStatusCancel}>
                <span>
                  已取消
                </span>
              </div>
            );
            break;
          case 'needed':
            vm.push(
              <div key={2} className={style.interviewStatusHaveNot}>
                <span>
                  未面試狀態
                </span>
              </div>
            );
            break;
          case 'agreed':
            vm.push(
              <div key={2} className={style.interviewStatusAgree}>
                <span>
                  已同意
                </span>
              </div>
            );
            break;
          default:
            break;
        }
      }
    }

    if (data.logType == 'sign') {
      switch (data.status) {
        case 'modified':
          vm.push(
            <div key={1} className={style.interviewStatusHaveNot}>
              <span>
                待簽約
              </span>
            </div>
          );
          break;
        case 'cancelled':
          vm.push(
            <div key={2} className={style.interviewStatusCancel}>
              <span>
                取消簽約
              </span>
            </div>
          );
          break;
        default:
          vm.push(
            <div key={100} className={style.interviewStatusWaitSign}>
              <span>
                待簽約
              </span>
            </div>
          );
          break;
      }
    }
    vm.push(
      <InterviewOrSignContent
        key={new Date().getTime()}
        data={data}
        onShowModal={onShowModal}
        currentUser={currentUser}
        readonly={readonly}
        region={region}
      />
    );

    return (
      <div className={style.card}>
        {vm}
      </div>
    )
  }


  // function BoxSign(data) {
  //   const vm = [];
  //   if (data.logType == 'sign') {
  //     switch (data.status) {
  //       case 'modified':
  //         vm.push(
  //           <div key={1} className={style.interviewStatusHaveNot}>
  //           <span>
  //             待簽約
  //           </span>
  //           </div>
  //         );
  //         break;
  //       case 'cancelled':
  //         vm.push(
  //           <div key={2} className={style.interviewStatusCancel}>
  //           <span>
  //             取消簽約
  //           </span>
  //           </div>
  //         );
  //         break;
  //       default:
  //         vm.push(
  //           <div key={100} className={style.interviewStatusWaitSign}>
  //           <span>
  //             待簽約
  //           </span>
  //           </div>
  //         );
  //         break;
  //     }
  //   }
  //
  //   vm.push(
  //     <InterviewOrSignContent key={new Date().getTime()} data={data} onShowModal={onShowModal}/>
  //   );
  //
  //   return (
  //     <div className={style.card}>
  //       {vm}
  //     </div>
  //   )
  // }


  return (
    Box(data)
  )
};
export default InterviewOrSignBox;
