import request from '../utils/request';
import { requestSimple as req } from '../utils/request';

import { HOST } from '../constants/APIConstants';


// params: region/department_id(option)
export async function fetchRosters({ params }) {
  return req({
    method: 'GET',
    url: 'rosters',
    params,
  });
}

// params: year/month/department_ids/region
export async function createRoster({ postData }) {
  return req({
    method: 'POST',
    url: 'rosters',
    headers: {
      'Content-Type': 'application/json',
    },
    body: postData,
  });
}

// params: region/year/month
export async function fetchAvailableDepartments({ params }) {
  return req({
    method: 'GET',
    url: 'rosters/available_departments',
    params,
  });
}


// params: region
export async function fetchAllDepartments({ params }) {
  return req({
    method: 'GET',
    url: 'departments',
    params,
  });
}
