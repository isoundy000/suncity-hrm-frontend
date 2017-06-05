import { HOST } from 'constants/APIConstants';
import { requestSimple } from 'utils/request';

//获取组成员
export async function featchProfiles(department_id, token) {
  return requestSimple({
    url: `departments/${department_id}/profiles`,
    method: 'GET',
    token
  })
}

// 触发排班： post "/rosters/#{roster.id}/rostering"
export async function rostering(roster_id, token) {
  return requestSimple({
    url: `rosters/${roster_id}/rostering`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    token
  })
}

// 沿用上月设置(请求完成之后需重新获取roster)： post "/rosters/#{roster.id}/adopt_ultimo_settings"
export async function adoptUltimoSetting(roster_id, token) {
  return requestSimple({
    url: `rosters/${roster_id}/adopt_ultimo_settings`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    token
  })
}



// 清空排班设置： post "/rosters/#{roster.id}/setting_emptys"
export async function settingEmpty(roster_id, token) {
  return requestSimple({
    url: `rosters/${roster_id}/setting_emptys`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    token
  })
}


// 获取部门详情，名称
export async function fetchDepartmentDetail(department_id, token) {
  return requestSimple({
    url: `/departments/9`,
    method: 'GET',
    token
  })
}

//查询排班表
// rosters?year=year&month=month&department_id=department_id
export async function queryRosterByDate(params, token) {
  const {year, month, department_id} = params;
  return requestSimple({
    url: `/rosters?year=${year}&month=${month}&department_id=${department_id}`,
    method: 'GET',
    token
  })
}

// 获取排班表详情
// roster_id 排班表ID
export async function fetchRosterDetail(roster_id, token) {
  return requestSimple({
    url: `rosters/${roster_id}`,
    method: 'GET',
    token
  })
}

// === 设定排班表的排班相隔时间
// 示例：
// patch "/rosters/#{roster_id}/interval_settings/#{type}", params: {
//   grade: '1',
//   value: '2'
// }
// 参数：
// roster_id 排班表ID
// type 可选 
//   shift_interval 排班相隔時間設定
//   rest_day_amount_per_week 每週公休班數設定
//   rest_day_interval 公休間隔時間設定
//   in_between_rest_day_shift_type_amount 公休間班別類型設定
//   grade 职级
//   value 值

export async function setRouterInterval(roster_id, type, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/interval_settings/${type}`,
    method: 'PATCH',
    params,
    token
  })
}

// === 排班班别设定
// 班别列表：
// get "/rosters/#{roster_id}/shifts"
export async function fetchRosterShifts(roster_id) {
  return requestSimple({
    url: `rosters/${roster_id}/shifts`,
    method: 'GET'
  })
}

// 创建班别：
// post "/rosters/#{roster_id}/shifts"
// 参数
// chinese_name: 中文名称
// english_name: 英文名称
// start_time: 开始时间
// end_time: 结束时间
// min_workers_number: 最少员工数
// min_3_leval_workers_number: 最少3級員工數
// min_4_leval_workers_number: 最少4級員工數
export async function createRosterShifts(roster_id, params, token) {
  return requestSimple({
    url: `rosters/${roster_id}/shifts`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}

// 修改班别：
// patch "/rosters/#{roster_id}/shifts/#{shift_id}"
// 参数同创建班别
export async function alterRosterShifts(roster_id, shift_id, params, token) {
  return requestSimple({
    url: `/rosters/${roster_id}/shifts/${shift_id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,

    token
  })
}


// 删除班别：
// delete "/rosters/#{roster_id}/shifts/#{shift_id}"
export async function deleteRosterShifts(roster_id, shift_id, token) {
  return requestSimple({
    url: `/rosters/${roster_id}/shifts/${shift_id}`,
    token,
    method: 'DELETE'
  })
}

// === 更组设定
// 更组列表：
// get "/rosters/#{roster_id}/shift_groups"

// ### 列表 [GET /rosters/{roster_id}/shift_groups{?is_together}]
// `is_together`为`true`表示同更，默认为同更。
// + Response 200 (application/json)
//         {
//             data: [
//                     {
//                         "id": 45,
//                         "chinese_name": nil,
//                         "english_name": nil,
//                         "comment": nil,
//                         "member_user_ids": nil,
//                         "created_at": "2016-12-27T06:45:21.550Z",
//                         "updated_at": "2016-12-27T06:45:21.550Z",
//                         "roster_id": 14,
//                         "is_together": false,
//                         "member_users": []
//                     }
//             ],
//             "state": "success"
//         }
export async function fetchShiftGroups(roster_id, is_together, token) {
  const params = { is_together: is_together }
  console.log('papapapa', params);
  return requestSimple({
    //todo is_together params err
    // url: `/rosters/${roster_id}/shift_groups?is_together=${is_together}`,
    url: `/rosters/${roster_id}/shift_groups`,
    method: 'GET',
    params,
    token
  })
}

// 创建更组：
// post "/rosters/#{roster_id}/shift_groups"
// 参数
// chinese_name: 中文名称
// english_name: 英文名称
// comment: 备注
// member_user_ids: 员工ID数组



// 修改更组：
// patch "/rosters/#{roster_id}/shift_groups/#{shift_group_id}"
// 参数同创建更组
export async function alterShiftGroups(roster_id, shift_group_id, params, token) {
  return requestSimple({
    url: `/rosters/${roster_id}/shift_groups/${shift_group_id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    token
  })
}

// 删除更组：
// delete "/rosters/#{roster_id}/shift_groups/#{shift_group_id}"
export async function deleteShiftGroups(roster_id, shift_group_id) {
  return requestSimple({
    url: `/rosters/${roster_id}/shift_groups/${shift_group_id}`,
    method: 'DELETE'
  })
}


// ### 创建 [POST /rosters/{roster_id}/shift_groups]

// + Attributes
//     ＋ chinese_name (string, optional) -  中文名
//     ＋ english_name (string, optional) - 英文名
//     ＋ comment (string, optional) - 备注
//     ＋ member_user_ids (string, optional) - 改组用户user id
//     ＋ roster_id (string, optional) - roster id
//     ＋ is_together (string, optional) - 同更组／不同更组标记

export async function createShiftGroups(roster_id, params, token) {
  console.log('params', params);
  return requestSimple({
    url: `/rosters/${roster_id}/shift_groups`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: params,
    method: 'POST'
  })
}


// ### 详细信息 [GET /rosters/{roster_id}/shift_groups/{id}]

// + Response 200 (application/json)

//         {
//           "data": {
//                       "id": 45,
//                       "chinese_name": nil,
//                       "english_name": nil,
//                       "comment": nil,
//                       "member_user_ids": nil,
//                       "created_at": "2016-12-27T06:45:21.550Z",
//                       "updated_at": "2016-12-27T06:45:21.550Z",
//                       "roster_id": 14,
//                       "is_together": false,
//                       "member_users": []
//                     },
//           "state": "success"
//         }


// ### 修改 [PATCH /rosters/{roster_id}/shift_groups/{id}]
// + Attributes
//     + chinese_name (string, optional) - 中文分类名
//     + english_name (string, optional) - 英文分类名
//     + description (string, optional) - 备注

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }


// ### 添加人员 [PATCH /rosters/{roster_id}/shift_groups/{id}/add_users]

// + Attributes
//     + `member_user_ids[]` (array, optional) - 人员id数组

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }


// ### 删除人员 [PATCH /rosters/{roster_id}/shift_groups/{id}/remove_users]

// + Attributes
//     + `member_user_ids[]` (array, optional) - 人员id数组

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }




// ### 删除 [DELETE  /rosters/{roster_id}/shift_groups/{id}]

// + Response 200 (application/json)

//         {
//           "data": [],
//           "state": "success"
//         }
