import { requestSimple } from 'utils/request';

export async function fetchJobs(params) {
  return requestSimple({
    url: '/jobs',
    method: 'GET',
    params,
  });
}

export async function fetchJobsStatistics(region) {
  return requestSimple({
    url: '/jobs/statistics',
    method: 'GET',
    params: {
      region
    }
  });
}

export async function editJobRequest(id, params) {
  return requestSimple({
    url: '/jobs/' + id,
    method: 'PATCH',
    body: params,
  });
}
