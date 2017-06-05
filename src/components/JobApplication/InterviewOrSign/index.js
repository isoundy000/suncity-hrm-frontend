import React, { Component } from 'react';
import style from '../jobApplication.less';
import InterviewOrSignBox from './InterviewOrSignBox'

function InterviewOrSign({readonly, interviewOrSignList, onShowModal, currentUser, region}) {

  var vdom = [];

  if (interviewOrSignList != undefined) {
    interviewOrSignList.map(function (item, index) {
      vdom.push(
        <div key={index}>
          <InterviewOrSignBox
            data={item}
            onShowModal={onShowModal}
            currentUser={currentUser}
            region={region}
            readonly={readonly}
          />
        </div>
      );
    });
  }

  return (
    <div className={style.interviewOrSign}>
      {vdom}
    </div>
  )
}

export default InterviewOrSign;
