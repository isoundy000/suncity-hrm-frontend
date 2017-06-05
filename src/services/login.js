import request from 'utils/request';
import { HOST } from 'constants/APIConstants';

export async function login(identity, password) {
  return request(`${HOST}/json_web_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identity,
      password
    })
  });
}
