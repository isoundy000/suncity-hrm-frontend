import request from '../utils/request';
import { requestSimple as req } from '../utils/request';

import { HOST } from '../constants/APIConstants';

export async function fetchRoster({ id, params }) {
  return req({
    method: 'GET',
    url: `rosters/${id}`,
    params,
  });
}

export async function fetchRosterTable({ rosterId, params }) {
  return req({
    method: 'GET',
    url: `rosters/${rosterId}/items`,
    params,
  });
}

export async function fetchDepartmentRosters({ departmentId }) {
  return req({
    method: 'GET',
    url: `departments/${departmentId}/rosters`,
  });
}

export async function fetchDepartment({ departmentId }) {
  return req({
    method: 'GET',
    url: `departments/${departmentId}`,
  });
}

export async function fetchPositions({ params }) {
  return req({
    method: 'GET',
    url: 'positions',
    params,
  });
}


export async function fetchShifts({ rosterId, params }) {
  return req({
    method: 'GET',
    url: `rosters/${rosterId}/shifts`,
    params,
  });
}

export async function updateItems({ rosterId, postData }) {
  console.log('postData', postData);
  return req({
    method: 'POST',
    url: `rosters/${rosterId}/batch_item_updates`,
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
  });
}
