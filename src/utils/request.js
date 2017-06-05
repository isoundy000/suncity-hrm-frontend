import _ from 'lodash';
import fetch from 'dva/fetch';
import urljoin from 'url-join';
import { jsonToQuery } from 'utils/url_helper';
import { HOST } from '../constants/APIConstants';
import download from 'downloadjs';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function requestUrl({host, url, params}) {
  const reqHost = host ? host : HOST;
  const queryString = _.isEmpty(params) ? '' : jsonToQuery(params);
  return urljoin(reqHost, url, queryString);
}

function getRequestHeaders() {
  const storageState = JSON.parse(localStorage.getItem('reduxState'));
  const region = _.get(storageState, 'region');
  const token = _.get(storageState, 'currentUser.token');

  return {
    token,
    region,
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}

export function requestSimple({url, method, headers, params, body, token, host}) {
  const reqURL = requestUrl({host, url, params});
  const requestHeaders = getRequestHeaders();
  return request(reqURL, {
    method: method,
    headers: _.pickBy({
      'Content-Type': 'application/json',
      'Token': requestHeaders.token,
      'region': requestHeaders.region,
      ...headers,
    }),
    body: JSON.stringify(body),
  });
}

export function downloadRequest({url, params, host, localFilename}) {
  const reqURL = requestUrl({url, params, host});
  const requestHeaders = getRequestHeaders();

  let filename = null;
  return fetch(reqURL, {
    method: 'GET',
    headers: _.pickBy({
      'Token': requestHeaders.token,
      'region': requestHeaders.region,
    }),
  }).then(function(resp) {
    const remoteFilename = resp.headers.get('Content-Disposition').split(';')[1].split('=')[1].replace(/"/g, '');
    filename = localFilename ? localFilename : decodeURI(remoteFilename);
    return resp.blob();
  }).then(function(blob) {
    download(blob, filename);
  });
}
