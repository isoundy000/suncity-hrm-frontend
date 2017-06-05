import request from '../utils/request';
import { requestSimple as req } from 'utils/request';

import { HOST } from '../constants/APIConstants';

export async function fetchCurrentUserPermissions({ id, token, region }) {
  return req({
    method: 'GET',
    url: `/users/${id}/permissions`,
    region,
    token,
  });
}
