import { requestSimple, downloadRequest } from 'utils/request';
import { HOST } from 'constants/APIConstants';
import _ from 'lodash';
import fetch from 'dva/fetch';

async function fetchApplicantProfileCategories() {
  const { data, err } = await requestSimple({
    url: 'applicant_attachment_types',
    method: 'GET'
  });

  if(data) {
    return data.data;
  }
}

async function fetchProfileCategories() {
  const { data, err } = await requestSimple({
    url: 'profile_attachment_types',
    method: 'GET'
  });

  if(data) {
    return data.data;
  }
}

async function fetchApplicantProfileFiles(id) {
  if(!id) {
    return [];
  }

  const { data, err } = await requestSimple({
    url: `applicant_profiles/${id}/applicant_attachments`,
    method: 'GET'
  });

  if(data) {
    return data.data;
  }
}

async function fetchProfileFiles(id) {
  if(!id) {
    return [];
  }

  const { data, err } = await requestSimple({
    url: `/profiles/${id}/profile_attachments`,
    method: 'GET'
  });

  if(data) {
    return data.data;
  }
}

async function createApplicantProfileCategory(category) {
  return requestSimple({
    url: '/applicant_attachment_types',
    method: 'POST',
    body: category
  });
}

async function createProfileCategory(category, token) {
  console.log('token', token);
  return requestSimple({
    url: '/profile_attachment_types',
    method: 'POST',
    body: category,
    token,
  });
}

async function updateApplicantProfileCategory(id, attributes) {
  return requestSimple({
    url: `/applicant_attachment_types/${id}`,
    method: 'PATCH',
    body: attributes
  });
}

async function updateProfileCategory(id, attributes) {
  return requestSimple({
    url: `/profile_attachment_types/${id}`,
    method: 'PATCH',
    body: attributes
  });
}

async function deleteApplicantProfileCategory(id) {
  return requestSimple({
    url: `/applicant_attachment_types/${id}`,
    method: 'DELETE',
  });
}

async function deleteProfileCategory(id) {
  return requestSimple({
    url: `/profile_attachment_types/${id}`,
    method: 'DELETE',
  });
}

async function createApplicantProfileFile(applicantProfileId, file) {
  return requestSimple({
    url: `/applicant_profiles/${applicantProfileId}/applicant_attachments`,
    method: 'POST',
    body: {
      applicant_attachment_type_id: file.categoryId,
      file_name: file.fileName,
      description: file.comment,
      attachment_id: file.uploadedFileId
    }
  });
}

async function createProfileFile(profileId, file) {
  return requestSimple({
    url: `/profiles/${profileId}/profile_attachments`,
    method: 'POST',
    body: {
      profile_attachment_type_id: file.categoryId,
      file_name: file.fileName,
      description: file.comment,
      attachment_id: file.uploadedFileId
    }
  });
}

async function updateApplicantPrfofileFile(applicantProfileId, fileId, attributes) {
  return requestSimple({
    url: `/applicant_profiles/${applicantProfileId}/applicant_attachments/${fileId}`,
    method: 'PATCH',
    body: _.pickBy({
      applicant_attachment_type_id: attributes.categoryId,
      description: attributes.comment,
    })
  });
}

async function updatePrfofileFile(profileId, fileId, attributes) {
  return requestSimple({
    url: `/profiles/${profileId}/profile_attachments/${fileId}`,
    method: 'PATCH',
    body: _.pickBy({
      profile_attachment_type_id: attributes.categoryId,
      description: attributes.comment,
    })
  });
}

async function deleteApplicantProfileFile(applicantProfileId, fileId) {
  return requestSimple({
    url: `/applicant_profiles/${applicantProfileId}/applicant_attachments/${fileId}`,
    method: 'DELETE'
  });
}

async function deleteProfileFile(profileId, fileId) {
  return requestSimple({
    url: `/profiles/${profileId}/profile_attachments/${fileId}`,
    method: 'DELETE',
  });
}

function ApplicantProfileAttachmentPreviewUrl(applicantProfileId, fileId) {
  return `${HOST}/applicant_profiles/${applicantProfileId}/applicant_attachments/${fileId}/preview`;
}

function ProfileAttachmentPreviewUrl(ProfileId, fileId) {
  return `${HOST}/profiles/${profileId}/profile_attachments/${fileId}/preview`
}

async function downloadApplicantProfileFile(applicantProfileId, fileId, filename) {
  return downloadRequest({
    url: `/applicant_profiles/${applicantProfileId}/applicant_attachments/${fileId}/download`,
    localFilename: filename,
  });
}

async function downloadProfileFile(profileId, fileId, filename) {
  return downloadRequest({
    url: `/profiles/${profileId}/profile_attachments/${fileId}/download`,
    localFilename: filename,
  });
}

export async function fetchCategories(endpointType) {
  if(endpointType.type == 'applicantProfile') {
    return fetchApplicantProfileCategories();
  } else if (endpointType.type == 'profile') {
    return fetchProfileCategories();
  }
}

export async function fetchFiles(endpointType) {
  if(endpointType.type == 'applicantProfile') {
    return fetchApplicantProfileFiles(endpointType.id);
  } else if (endpointType.type == 'profile') {
    return fetchProfileFiles(endpointType.id);
  }
}

export async function createNewCategory(endpointType, category, token) {
  if(endpointType.type == 'applicantProfile') {
    return createApplicantProfileCategory(category);
  }else if (endpointType.type == 'profile') {
    return createProfileCategory(category, token);
  }
}

export async function updateCategory(endpointType, id, attributes) {
  if(endpointType.type == 'applicantProfile') {
    return updateApplicantProfileCategory(id, attributes);
  }else if (endpointType.type == 'profile') {
    return updateProfileCategory(id, attributes);
  }
}

export async function deleteCategory(endpointType, id) {
  if(endpointType.type == 'applicantProfile') {
    return deleteApplicantProfileCategory(id);
  }else if (endpointType.type == 'profile') {
    return deleteProfileCategory(id);
  }
}

export async function createFile(endpointType, file) {
  if(endpointType.type == 'applicantProfile') {
    return createApplicantProfileFile(endpointType.id, file);
  } else if(endpointType.type == 'profile') {
    return createProfileFile(endpointType.id, file);
  }
}

export async function updateFile(endpointType, id, attributes) {
  if(endpointType.type == 'applicantProfile') {
    return updateApplicantPrfofileFile(endpointType.id, id, attributes);
  }else if(endpointType.type == 'profile') {
    return updatePrfofileFile(endpointType.id, id, attributes);
  }
}

export async function deleteFile(endpointType, id) {
  if(endpointType.type == 'applicantProfile') {
    return deleteApplicantProfileFile(endpointType.id, id);
  }else if(endpointType.type == 'profile') {
    return deleteProfileFile(endpointType.id, id);
  }
}

export async function downloadFile(endpointType, id, filename) {
  if(endpointType.type == 'applicantProfile') {
    return downloadApplicantProfileFile(endpointType.id, id, filename);
  }else if(endpointType.type == 'profile') {
    return downloadProfileFile(endpointType.id, id, filename);
  }
}

export async function fetchCategoriesAndFiles(endpointType) {
  const files = await fetchFiles(endpointType);
  const categories = await fetchCategories(endpointType);

  return {
    files,
    categories,
  };
}

export function fetchFileHeaders(fileUrl) {
  return fetch(fileUrl, {
    method: 'HEAD',
  });
}

export function previewFileUrl(endpointType, id) {
  return `${HOST}/attachments/${id}/preview`;
}
