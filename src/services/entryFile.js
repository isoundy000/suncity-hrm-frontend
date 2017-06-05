import { requestSimple as req } from "utils/request";
import { HOST } from "constants/APIConstants";
import download from "downloadjs";

export async function downloadEntryFile(region) {
  let filename = null;
  return fetch(`${HOST}/profiles/attachment_missing_export/?region=${region}`, {
    method: 'GET'
  }).then(function (resp) {
    filename = resp.headers.get('Content-Disposition').split(';')[1].split('=')[1].replace(/"/g, '');
    filename = '缺失文件列表' + decodeURI(filename);
    return resp.blob();
  }).then(function (blob) {
    download(blob, filename);
  });
}

export async function fetchProfile(id) {
  return req({
    url: '/profiles/' + id,
    method: 'GET',
  })
}

export async function fetchAttachmentTypes(params,token) {
  return req({
    url: '/profile_attachment_types',
    method: 'GET',
    params,
    token
  });
}

export async function fetchUnFinishedList(params, token) {
  return req({
    url: '/profiles/attachment_missing',
    method: 'GET',
    params,
    token
  });
}

export async function setSmsSent(id, token) {
  return req({
    url: '/profiles/' + id + '/attachment_missing_sms_sent',
    method: 'POST',
    token,
  });
}

export async function sendSMSByPhoneNumber(params, token) {
  params = { ...params, the_object: 'entryFile' }
  return req({
    url: '/sms/delivery',
    method: 'PATCH',
    params,
    token,
  });
}
