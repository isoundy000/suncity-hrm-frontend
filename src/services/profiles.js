import { requestSimple, downloadRequest } from 'utils/request';

export async function fetchLocations(params) {
  return requestSimple({
    url: '/locations',
    method: 'GET',
    params,
  });
}

export async function fetchDepartments(params) {
  return requestSimple({
    url: '/departments',
    method: 'GET',
    params,
  });
}

export async function fetchPositions(params) {
  return requestSimple({
    url: '/positions',
    method: 'GET',
    params,
  });
}

export async function fetchProfiles(params) {
  console.log('!!!', params);
  return requestSimple({
    url: '/profiles',
    method: 'GET',
    params,
  });
}

export async function loadProfileTemplate(region) {
  return requestSimple({
    url: '/profiles/template',
    method: 'GET',
    params: { region },
  });
}

export async function loadApplicantProfileTemplate(region) {
  return requestSimple({
    url: '/applicant_profiles/template',
    method: 'GET',
    params: { region },
  });
}

export async function createProfile(data, id_number, region) {
  const postData = {
    ...data,
    user_id_card_number: id_number,
    region,
  };
  console.log('!!!---------!!!', postData);

  return requestSimple({
    url: '/profiles',
    method: 'POST',
    body: postData,
  });
}

export async function createApplicantProfile(data, region, token) {
  const postData = {
    ...data,
    region,
  };

  return requestSimple({
    url: '/applicant_profiles',
    method: 'POST',
    body: postData,
    token,
  });
}

export async function loadProfile(id) {
  return requestSimple({
    url: `/profiles/${id}`,
    method: 'GET',
  });
}

export async function loadProfileRoleGroup(id) {
  return requestSimple({
    url: `/users/${id}/roles`,
    method: 'GET',
  });
}

export async function loadAllRoleGroup(id) {
  return requestSimple({
    url: '/roles',
    method: 'GET',
  });
}

export async function addRoleGroup({ id, postData, token, region }) {
  return requestSimple({
    url: `/users/${id}/add_role`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    token,
    region,
  });
}

export async function removeRoleGroup({ id, postData, token, region }) {
  return requestSimple({
    url: `users/${id}/remove_role`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: postData,
    region,
    token,
  });
}

export async function loadApplicantProfile(id) {
  return requestSimple({
    url: `/applicant_profiles/${id}`,
    method: 'GET',
  });
}

export async function editProfile(id, params) {
  return requestSimple({
    url: `/profiles/${id}`,
    method: 'PATCH',
    body: params
  });
}

export async function editApplicantProfile(id, params, token) {
  return requestSimple({
    url: `/applicant_profiles/${id}`,
    method: 'PATCH',
    body: params,
    token
  });
}

function templateUrl(type) {
  if(type == 'profile') {
    return '/select_column_templates';
  }else{
    return '/applicant_select_column_templates'
  }
}

export async function getAllFields(region, type='profile') {
  return requestSimple({
    url: templateUrl(type) + '/all_selectable_columns',
    method: 'GET',
    params: {
      region: region
    }
  })
}

export async function getAllSelectableColumns(region, type='profile') {
  return requestSimple({
    url: templateUrl(type) + '/all_selectable_columns',
    method: 'GET',
    params: {
      region: region
    }
  });
}

export async function getAllSelectColumnTemplates(region, type='profile') {
  return requestSimple({
    url: templateUrl(type),
    method: 'GET',
    params: {
      region: region
    }
  })
}

export async function createSelectColumnTemplates(region, select_column_keys, name, isDefault=false, type='profile') {
  return requestSimple({
    url: templateUrl(type),
    method: 'POST',
    body: {
      region,
      select_column_keys,
      name,
      default: isDefault,
    }
  });
}

export async function getSelectColumnTemplateById(id, type='profile') {
  return requestSimple({
    url: templateUrl(type) + '/' + id,
    method: 'GET'
  });
}

export async function editSelectColumnTemplateById(id, params, type='profile') {
  return requestSimple({
    url: templateUrl(type) + '/' + id,
    method: 'PATCH',
    body: params
  });
}

export async function deleteSelectColumnTemplateById(id, type='profile') {
  return requestSimple({
    url: templateUrl(type) + '/' + id,
    method: 'DELETE',
  });
}

export async function fetchSameIdCardNumberProfilesRequest(id) {
  return requestSimple({
    url: `/applicant_profiles/${id}/same_id_card_number_profiles`,
    method: 'GET'
  });
}

export async function exportProfilesRequest(params) {
  return downloadRequest({
    url: 'profiles/export_xlsx',
    params
  });
}

export async function queryUserIdCardNumberRequest(idCardNumber) {
  return requestSimple({
    url: '/profiles/query_applicant_profile_id_card_number',
    params: {
      id_card_number: idCardNumber
    },
    method: 'GET',
  });
}
