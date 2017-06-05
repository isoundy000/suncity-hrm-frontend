import request from '../utils/request';
import { requestSimple as req } from 'utils/request';

import { HOST } from '../constants/APIConstants';

/* export async function fetchListByType({ type, token }) {
   return req({
   url: `/${type}/mine`,
   method: 'GET',
   token,
   });
   }
 */

export async function fetchListByType({ type, token }) {
  const url = `${HOST}/${type}/mine`;

  return request(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
  });
}


export async function fetchInterviewers({ token }) {
  const url = `${HOST}/interviewers`;

  return request(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
  });
}


export async function fetchInterviewsById({ applicantPositionId, token }) {
  return req({
    url: `/applicant_positions/${applicantPositionId}/interviews`,
    method: 'GET',
    token,
  });
}

export async function fetchRelated({ type, region }) {
  return req({
    url: `/${type}?region=${region}&with_disabled=true`,
    method: 'GET',
  });
}

export async function startFetchApplicantPositionDetail({ applicantPositionId, token }) {
  return req({
    url: `/applicant_positions/${applicantPositionId}`,
    method: 'GET',
    token
  });
}

export async function updateOneInterview({ applicantPositionId, id, patchData, token }) {
  return req({
    url: `/applicant_positions/${applicantPositionId}/interviews/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
  });
}

/* export async function updateOneInterview({ applicantPositionId, id, patchData, token }) {
   const url = `${HOST}/applicant_positions/${applicantPositionId}/interviews/${id}`;

   return request(url, {
   method: 'PATCH',
   headers: {
   'Content-Type': 'application/json',
   },
   body: JSON.stringify(patchData),
   token,
   });
   }
 */

export async function updateStatusById({ id, patchData, token }) {
  return req({
    /* url: `/applicant_positions/${applicantPositionId}/update_status`, */
    url: `/interviewers/${id}/update_status`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
  });
}

export async function startUpdateInterviewerStatusById({ id, patchData, token }) {
  return req({
    /* url: `/applicant_positions/${applicantPositionId}/update_status`, */
    url: `/interviewers/${id}/update_status`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
  });
}

export async function startUpdateAudienceStatusById({ applicantPositionId, id, patchData, token }) {
  return req({
    /* url: `/applicant_positions/${applicantPositionId}/update_status`, */
    url: `/applicant_positions/${applicantPositionId}/audiences/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
  });
}



/* export async function updateStatusById({ applicantPositionId, patchData, token }) {
   const url = `${HOST}/applicant_positions/${applicantPositionId}/update_status`;

   return request(url, {
   method: 'PATCH',
   headers: {
   'Content-Type': 'application/json',
   },
   body: JSON.stringify(patchData),
   token,
   });
   } */


export async function startFetchEmailTemplates(params, token) {
  return req({
    url: 'email/templates',
    method: 'GET',
    params,
    token
  });
}

export async function startSendEmail(params, token) {
  // const params = {status,comment,time,cancel_reason};
  console.log('email', params);
  return req({
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

export async function updateSchedule({ applicantPositionId, params, token, region }) {
  return req({
    url: `applicant_positions/${applicantPositionId}/update_status`,
    method: 'PATCH',
    params,
    token,
    region,
  })
}
