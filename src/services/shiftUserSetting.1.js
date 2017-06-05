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

// ## 列表 [GET /rosters/{roster_id}/shift_user_settings]

// + Response 200 (application/json)

//         {
//           "data": [
//             {
//               "id": 1,
//               "user_id": 1,
//               "roster_id": 1,
//               "shift_interval": nil,
//               "shift_special": [],
//               "rest_interval": nil,
//               "rest_special": [],
//               "created_at": "2016-12-30T06:03:00.428Z",
//               "updated_at": "2016-12-30T06:03:00.428Z",
//               "user"=>{}
//             },
//             {
//               "id": 2,
//               "user_id": 2,
//               "roster_id": 1,
//               "shift_interval": nil,
//               "shift_special": [],
//               "rest_interval": nil,
//               "rest_special": [],
//               "created_at": "2016-12-30T06:03:00.428Z",
//               "updated_at": "2016-12-30T06:03:00.428Z",
//               "user"=>{}
//             }
//           ],
//           "state": "success"
//         }

export async function fetchShiftUserSetting(roster_id, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings`,
    method: 'GET',
    token
  })
}


// // ## 创建 [POST /rosters/{roster_id}/shift_user_settings]

// // + Parameters
// //     + user_id (int, optional) - 用户id
// //     + `shift_interval[]` (Array, optional) - 本月可排班别`shift_id`
// //     + `rest_interval[]` (Array, optional) - 本月可排公休, 0-Sunday,1-Monday..6-Saturday
// //     + `shift_special[]` (Array, optional) - 本月可排班别特殊设定`shift_id`, {from: "2016-1-1", to: "2016-1-2", shift_ids: [1535, 1536, 1537]}
// //     + `rest_special[]` (Array, optional) - 本月可排公休特殊设定`shift_id`, {:from=>"2016-1-5", :to=>"2016-1-15", :wdays=>[0, 1]}
// export async function createShiftUserSetting(roster_id, params, token) {
//   return requestSimple({
//     url: `rosters/${roster_id}/shift_user_settings`,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: params,
//     token
//   })
// }

//更新整条记录
///rosters/{roster_id}/shift_user_settings/{id}
export async function updateShiftUserSetting(roster_id, user_id, params, token) {
  roster_id = 1;
  user_id = 26;
  params = {
    shift_interval: [57, 58],
    shift_special: [
      { from: "2016-1-1", to: "2016-1-2", shift_ids: [57] },
      { from: "2016-1-3", to: "2016-1-5", shift_ids: [58] },
    ],
  }
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${user_id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}




// ## 添加本月可排班别`shift_id` [PATCH /rosters/{roster_id}/shift_user_settings/{id}/add_shifts]

// + Parameters
//     + `shift_ids[]` (Array, optional) - 班别`shift_id`

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
// }
export async function addShifts(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/add_shifts`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}



// ## 删除本月可排班别`shift_id` [PATCH /rosters/{roster_id}/shift_user_settings/{id}/remove_shifts]

// + Parameters
//     + `shift_ids[]` (Array, optional) - 班别`shift_id`

export async function removeShifts(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/remove_shifts`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}


// ## 添加特殊可排班别 [PATCH /rosters/{roster_id}/shift_user_settings/{id}/add_shift_special]
// + Parameters
//     + shift_special_item (Hash, optional) - 设定信息{from: '2016-1-1', to: '2016-1-2', shift_ids: [1,2]}

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }

export async function addShiftSpecial(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/add_shift_special`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}

// ## 删除特殊可排班别 [PATCH /rosters/{roster_id}/shift_user_settings/{id}/remove_shift_special]

// + Parameters
//     + shift_special_item_key (String, optional) - 设定信息的key值

export async function removeShiftSpecial(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/remove_shift_special`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}


// ## 更新特殊排班记录 [PATCH /rosters/{roster_id}/shift_user_settings/{id}/update_shift_special_item]

// + Parameters
//     + shift_special_item_key (String, required) - 设定信息的key值
//     + shift_special_item (Hash, required) - 设定信息{from: '2016-1-1', to: '2016-1-2', shift_ids: [1,2]}

export async function updateShiftSpecialItem(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/update_shift_special_item`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}



// ## 添加可排公休 PATCH /rosters/{roster_id}/shift_user_settings/{id}/add_rests]

// + Parameters
//     + `wday[]` (Array, required) - 可排公休, 0-Sunday,1-Monday..6-Saturday

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
export async function addRests(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/add_rests`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}

// ## 删除可排公休 PATCH /rosters/{roster_id}/shift_user_settings/{id}/remove_rests]

// + Parameters
//     + `wday[]` (Array, required) - 可排公休, 0-Sunday,1-Monday..6-Saturday

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
export async function removeRests(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/remove_rests`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}



// ## 添加特殊公休 PATCH /rosters/{roster_id}/shift_user_settings/{id}/add_rest_special]

// + Parameters
//     + rest_special_item (Hash, required) - 特殊公休记录, {from: '2016-1-1', to: '2016-1-14', wday: [1,3]} 

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
export async function addRestSpecial(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/addRestSpecial`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}



// ## 删除特殊公休 PATCH /rosters/{roster_id}/shift_user_settings/{id}/remove_rest_special]

// + Parameters
//     + rest_special_item_key (String, required) - 特殊公休记录key

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
export async function removeRestSpecial(roster_id, id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shift_user_settings/${id}/remove_rest_special`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}

// ## 更新特殊公休记录 PATCH /rosters/{roster_id}/shift_user_settings/{id}/update_rest_special_item]

// + Parameters
//     + rest_special_item_key (String, required) - 特殊公休记录key
//     + rest_special_item (Hash, required) - 特殊公休记录, {from: '2016-1-1', to: '2016-1-14', wday: [1,3]} 

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }


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
