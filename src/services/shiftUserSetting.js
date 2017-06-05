import { HOST } from 'constants/APIConstants';
import { requestSimple } from 'utils/request';

export async function fetchPosition(params, token) {
  return requestSimple({
    url: `/positions`,
    method: 'GET',
    params,
    token
  })
}

export async function fetchDepartment(params, token) {
  return requestSimple({
    url: `/departments`,
    method: 'GET',
    params,
    token
  })
}

// # 员工设定排班 [/rosters/{roster_id}/shift_user_settings]

export async function fetchShiftUserSetting(roster_id,search_params, token) {
  const params = search_params;
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings`,
    method: 'GET',
    params,
    token
  })
}


// ## 创建 [POST /rosters/{roster_id}/shift_user_settings]
// + Parameters
//     + user_id (int, optional) - 用户id
//     + `shift_interval[]` (Array, optional) - 本月可排班别`shift_id`
//     + `rest_interval[]` (Array, optional) - 本月可排公休, 0-Sunday,1-Monday..6-Saturday
//     + `shift_special[]` (Array, optional) - 本月可排班别特殊设定`shift_id`, {from: "2016-1-1", to: "2016-1-2", shift_ids: [1535, 1536, 1537]}
//     + `rest_special[]` (Array, optional) - 本月可排公休特殊设定`shift_id`, {:from=>"2016-1-5", :to=>"2016-1-15", :wdays=>[0, 1]}

export async function createShiftUserSetting(roster_id, params, token) {
  // params.shift_special=[{from: "2017-01-02", to: "2017-01-04", shift_ids: [61]}]
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}



//更新整条记录
///rosters/{roster_id}/shift_user_settings/{id}
export async function updateShiftUserSetting(roster_id, params, token) {
  const id = params.id;
  delete params.id;
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}


// ## 清空设定 PATCH /rosters/{roster_id}/shift_user_settings/{id}/empty_settings]

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }

// ## 复制上月设定 PATCH /rosters/{roster_id}/shift_user_settings/{id}/dup_from_last_month]

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
