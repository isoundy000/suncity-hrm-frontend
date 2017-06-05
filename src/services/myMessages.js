import request from '../utils/request';
import { requestSimple as req } from 'utils/request';

import { HOST } from '../constants/APIConstants';

export async function fetchAllMessagesByType({ type, page, perPage, token }) {
  return req({
    method: 'GET',
    url: 'messages',
    params: {
      page,
      namespace: type,
      per_page: perPage,
    },
    token,
  });
}

export async function fetchUnreadMessagesByType({ type, page, perPage, token }) {
  return req({
    method: 'GET',
    url: 'messages/unread_messages',
    params: {
      page,
      namespace: type,
      per_page: perPage,
    },
    token,
  });
}

export async function fetchCountByType({ type, token }) {
  return req({
    method: 'GET',
    url: 'messages/unread_messages_count',
    params: {
      namespace: type,
    },
    token,
  });
}

/* export async function fetchCountByType({ type, token }) {

   const url = `${HOST}/messages/unread_messages_count?namespace=${type}`;
   return request(url,{
   method: 'GET',
   headers: {
   'Content-Type': 'application/json',
   'Token': token,
   },
   });
   }
 */

export async function readMessage({ id, token }) {
  return req({
    method: 'PATCH',
    url: `messages/${id}/read`,
    headers: {
      'Content-Type': 'application/json',
    },
    token,
  });
}

export async function readAllMessages({ type, token }) {
  return req({
    method: 'PATCH',
    /* url: `messages/read_all?${type}`, */
    url: 'messages/read_all',
    params: {
      namespace: type,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    token,
  });
}
