import request from '../utils/request';
import { requestSimple as req } from 'utils/request';

import { HOST } from '../constants/APIConstants';

export async function fetchRole({ id, token }) {
  return req({
    method: 'GET',
    url: `/roles/${id}`,
    token,
  });
}

export async function updateRole({ id, patchData, token, region }) {
  return req({
    url: `/roles/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
    region,
  });
}

export async function fetchRoleDataBy({ id, dataType, token }) {
  return req({
    method: 'GET',
    url: `/roles/${id}/${dataType}`,
    token,
  });
}

export async function fetchAllPermissions({ token, region }) {
  return req({
    method: 'GET',
    url: '/policies',
    token,
    region,
  });
}

export async function fetchAllPermissionsTranslation({ token, region }) {
  return req({
    method: 'GET',
    url: '/policies',
    params: {
      with_translations: 1,
    },
    token,
    region,
  });
}

export async function fetchPermissionDetail({ id, token }) {
  return req({
    method: 'GET',
    url: `/permissions/${id}`,
    token,
  });
}

export async function addDataAbout({ id, dataType, postData, token }) {
  return req({
    url: `/roles/${id}/add_${dataType}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}


export async function addPermission({ id, postData, token }) {
  console.log('addPermission', id, postData);
  return req({
    url: `/roles/${id}/add_permission`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function addUser({ id, postData, token }) {
  console.log('addPermission', id, postData);
  return req({
    url: `/roles/${id}/add_user`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function removeDataAbout({ id, dataType, postData, token }) {
  console.log('remove', id, postData);
  return req({
    url: `/roles/${id}/remove_${dataType}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function removePermission({ id, postData, token }) {
  console.log('remove', id, postData);
  return req({
    url: `/roles/${id}/remove_permission`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function removeUser({ id, postData, token }) {
  console.log('remove', id, postData);
  return req({
    url: `/roles/${id}/remove_user`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
  });
}

export async function fetchEmails({ email }) {
  console.log('startFetchEmails');
  console.log(email);

  return req({
    url: 'profiles/emails_for_autocomplete',
    params: {
      email,
    },
    method: 'GET',
  });
}
