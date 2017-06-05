import { requestSimple, downloadRequest } from 'utils/request';

export async function fetchProfilesRequest(params) {
  return requestSimple({
    url: '/applicant_profiles',
    method: 'GET',
    params,
  });
}

export async function exportProfilesRequest(params) {
  return downloadRequest({
    url: 'applicant_profiles/export_xlsx',
    params
  });
}

export async function fetchProfilesStatisticsRequest() {
  return requestSimple({
    url: '/applicant_positions/summary',
    method: 'GEt'
  });
}
