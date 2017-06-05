/**
 * Created by meng on 16/9/18.
 */

import { requestSimple as req } from 'utils/request';

export async function getEndpoint(endpoint, region, token) {
  return req({
    url: endpoint,
    method: 'GET',
    params: {
      region,
      pagination: false
    },
    token,
  });
}
