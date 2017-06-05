import request from '../utils/request';
import { requestSimple as req } from 'utils/request';

import { HOST } from '../constants/APIConstants';

export async function fetchRoles({ token }) {
  return req({
    method: 'GET',
    /* url: 'roles/mine', */
    url: 'roles',
    token,
  });
}

export async function createRole({ postData, token }) {
  return req({
    url: '/roles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function updateRole({ id, patchData, token }) {
  return req({
    url: `/roles/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
  });
}

export async function deleteRole({ id, token }) {
  return req({
    url: `/roles/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    token,
  });
}
