/**
 * Created by meng on 16/9/19.
 */

import { requestSimple as req } from 'utils/request';

export async function checkAdvancedSearch({ searchType, searchData, region, token }) {
  const routerType = searchType.indexOf('applicant') != -1 ? 'applicant_profiles' : 'profiles';
  searchType = searchType.indexOf('applicant') != -1 ? searchType.replace('applicant_', '') : searchType;
  return req({
    url: `/${routerType}/advance_search_params_check`,
    method: 'GET',
    params: {
      search_type: searchType,
      search_data: searchData,
      region,
    },
    token,
  });
}
