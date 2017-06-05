import { requestSimple,downloadRequest } from 'utils/request';
import { HOST } from 'constants/APIConstants';

export async function downloadContractFile(id,applicantPositionId) {
  const url = `applicant_positions/${applicantPositionId}/agreement_files/${id}/download`;
  const params = {};

  return downloadRequest({ url, params, HOST});
}

export async function fetchAgreementFiles(params, token) {
  params = {region: 'macau'};
  return requestSimple({
    url: '/agreement_files/file_list',
    method: 'GET',
    params,
    token
  });
}

export async function startCreateContract(params, applicantPositionId, token) {
  // const params = {status,comment,time,cancel_reason};
  return requestSimple({
    url: `applicant_positions/${applicantPositionId}/agreement_files/generate`,
    method: 'POST',
    body: params,
    token
  });
}

export async function fetchInterviewLogs(id, token) {
  return requestSimple({
    url: 'applicant_positions/' + id + '/interviews',
    method: 'GET',
    token
  });
}
export async function fetchSignLogs(id, token) {
  return requestSimple({
    url: 'applicant_positions/' + id + '/contracts',
    method: 'GET',
    token
  });
}


export async function startSendEmail(params, token) {
  // const params = {status,comment,time,cancel_reason};
  return requestSimple({
    url: '/email/delivery',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    /* params, */
    token
  });
}

export async function sendSms(params, token) {
  return requestSimple({
    url: 'sms/delivery',
    method: 'PATCH',
    params,
    token
  });
}

export async function fetchSmsTemplates(params, token) {
  return requestSimple({
    url: 'sms/templates',
    method: 'PATCH',
    params,
    token
  });
}

export async function fetchEmailTemplates(params, token) {
  return requestSimple({
    url: 'email/templates',
    method: 'GET',
    params,
    token
  });
}

export async function createAudience(params, applicantPositionId, token) {
  return requestSimple({
    url: `applicant_positions/${applicantPositionId}/audiences`,
    method: 'POST',
    body: params,
    token,
  });
}


export async function createSign(id, params, token) {
  // const params = {status,comment,time,cancel_reason};
  return requestSimple({
    url: 'applicant_positions/' + id + '/contracts',
    method: 'POST',
    body: params,
    token
  });

}


//添加面試官       10
export async function addInterviewers(applicant_position_id, id, params, token) {
  // const params = {interviewer_emails: []};
  return requestSimple({
    url: 'applicant_positions/applicant_position_id/interviews/id/add_interviewers',
    method: 'PATCH',
    token
  });

}


//获取所有面試官的邮箱       9
export async function getAllInterViewersEmail(applicant_position_id, id, token) {
  return requestSimple({
    url: 'applicant_positions/applicant_position_id/interviews/id/interviewers',
    method: 'PATCH',
    token
  });

}

//更新一次面試               8
export async function updateInterview(application_position_id, id, params, token) {
  // const params = {time: null, result: null, score: null, evaluation: null, interviewer_emails: null, need_again: null};
  return requestSimple({
    url: 'applicant_positions/' + application_position_id + '/interviews/' + id,
    method: 'PATCH',
    params,
    token
  });
}

export async function removeInterviewers(application_position_id, id, emailParams, token) {

  return requestSimple({
    /* url: `applicant_positions/${application_position_id}/interviews/${id}/remove_interviewers`, */
    url: 'applicant_positions/' + application_position_id + '/interviews/' + id + '/remove_interviewers',
    method: 'PATCH',
    params: emailParams,
    token,
  });
}


export async function updateSign(application_position_id, id, params, token) {
  // const params = {time: null, result: null, score: null, evaluation: null, interviewer_emails: null, need_again: null};
  return requestSimple({
    url: 'applicant_positions/' + application_position_id + '/contracts/' + id,
    method: 'PATCH',
    params,
    token
  });
}


//获取求职者申请职位合约列表    5
export async function getContracts(id, token) {
  return requestSimple({
    url: 'applicant_positions/id/contracts',
    method: 'POST',
    token
  });

}


// 创建 一次面試               7
export async function createInterview(id, params, token) {
  return requestSimple({
    url: 'applicant_positions/' + id + '/interviews',
    method: 'POST',
    body: params,
    token
  });

}

//更新 求职者某次职位申请的进度       3
export async function updateSchedule(id, params, token) {
  return requestSimple({
    url: 'applicant_positions/' + id + '/update_status',
    method: 'PATCH',
    params,
    token

  })
}


//获取求职者某次职位申请的所有状态        2
export async function fetchAllApplicantPositionsStatues(token) {
  return requestSimple({
    url: '/applicant_positions/statuses',
    method: 'GET',
    token
  });
}


//查看某求职者的所有面試          6
//todo api 数据不完整，缺少能够指定面試状态的字段
export async function startFetchAllInterview(applicantPositionId, token) {

  return requestSimple({
    url: `/applicant_positions/${applicantPositionId}/interviews`,
    method: 'GET',
    token,
  });

  /* return { */
  /* "data": [ */
  /* { */
  /* "status": "finish",  //todo 表示状态的字段 */
  /* "title": "第二次面試", //todo card title */
  /* "id": 1, */
  /* "time": "2016年 9月1日 1:00 至 2:00", */
  /* "result": "结果", */
  /* "score": "评分", */
  /* "comment": "备注", */
  /* "evaluation": "评价", */
  /* "created_at": "2016-08-11T04:10:15.008Z", */
  /* "updated_at": "2016-08-11T04:10:52.143Z", */
  /* "interviewer": [{"id": 1, "chinese_name": "", "english_name": "", "email": ""}] */
  /* }, */
  /* { */
  /* "status": "finsh", */
  /* "title": "第二次面試", //todo card title */
  /* "id": 1, */
  /* "time": "2016年 9月1日 1:00 至 2:00", */
  /* "result": "结果", */
  /* "score": "评分", */
  /* "comment": "备注", */
  /* "evaluation": "评价", */
  /* "need_again": "还需面試", */
  /* "created_at": "2016-08-11T04:10:15.008Z", */
  /* "updated_at": "2016-08-11T04:10:52.143Z", */
  /* "interviewer": [{"id": 1, "chinese_name": "", "english_name": "", "email": ""}] */
  /* } */
  /* ], */
  /* "state": "success" */
  /* } */
}


//获取求职者申请面試/签约列表        4
export async function fetchInterviewOrSignList(id, token) {
  return {
    "data": [
      {
        "status": "finish",  //todo 表示状态的字段
        "title": "第二次面試", //todo card title
        "id": 1,
        "time": "2016年 9月1日 1:00 至 2:00",
        "result": "结果",
        "score": "评分",
        "comment": "备注",
        "evaluation": "评价",
        "created_at": "2016-08-11T04:10:15.008Z",
        "updated_at": "2016-08-11T04:10:52.143Z",
        "interviewer": [{"id": 1, "chinese_name": "", "english_name": "", "email": ""}]
      },
      {
        "status": "finsh",
        "title": "第二次面試", //todo card title
        "id": 1,
        "time": "2016年 9月1日 1:00 至 2:00",
        "result": "结果",
        "score": "评分",
        "comment": "备注",
        "evaluation": "评价",
        "need_again": "还需面試",
        "created_at": "2016-08-11T04:10:15.008Z",
        "updated_at": "2016-08-11T04:10:52.143Z",
        "interviewer": [{"id": 1, "chinese_name": "", "english_name": "", "email": ""}]
      }
    ],
    "state": "success"
  }
}

//获取求职者申请职位详情            1
export async function fetchApplicantPositionDetail(id, params, token) {
  return requestSimple({
    url: '/applicant_positions/' + id,
    method: 'GET',
    params,
    token
  });

}

export async function queryLogs(id, token) {
  return requestSimple({
    url: '/applicant_positions/' + id + '/application_logs',
    method: 'GET',
    token
  });

  // return {
  //   data: {
  //     "data": [
  //       {
  //         "type": "update_interview",
  //         "operator": {
  //           "chinese_name": "李姗(mock data1)",
  //           "english_name": "Lisa"
  //         },
  //         "created_at": "2016-09-03T08:27:52.951Z",
  //         "meta": {
  //           "interview": {
  //             "result": "pass",
  //             "score": 10,
  //             "evaluation": "还不错"
  //           }
  //         }
  //       },
  //       {
  //         "type": "agreed_interview",
  //         "operator": {
  //           "chinese_name": "李姗(mock data2)",
  //           "english_name": "Lisa"
  //         },
  //         "created_at": "2016-09-03T08:27:52.951Z"
  //       }
  //     ],
  //     "state": "success"
  //   }
  // }
}


export async function queryContractsById({id}, token) {
  return requestSimple({
    method: 'GET',
    /* url: `applicant_positions/${id}/contracts`, */
    url: `applicant_positions/${id}/agreement_files`,
    token,
  });
}

export async function deleteContractById({applicantPositionId, id, token}) {
  return requestSimple({
    method: 'DELETE',
    url: `applicant_positions/${applicantPositionId}/agreement_files/${id}`,
    headers: {
      'Content-Type': 'application/json',
    },
    token,
  });
}

//获取求职者档案详情
export async function getApplicantProfiles({id}, token) {
  return requestSimple({
    url: 'applicant_profiles/' + id,
    method: 'GET',
    token
  });
}


export async function startFetchSearchResult({key}) {
  return requestSimple({
    url: `profiles/autocomplete`,
    params: {
      key,
    },
    method: 'GET',
  });
}

export async function startFetchEmailList({email}) {
  return requestSimple({
    url: `profiles/emails_for_autocomplete`,
    params: {
      email,
    },
    method: 'GET',
  });
}
