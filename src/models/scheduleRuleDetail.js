import { adoptUltimoSetting, alterRosterShifts, alterShiftGroups, createRosterShifts, createShiftGroups, deleteRosterShifts, deleteShiftGroups, featchProfiles, fetchDepartmentDetail, fetchRosterDetail, fetchRosterShifts, fetchShiftGroups, queryRosterByDate, rostering, setRouterInterval, settingEmpty } from "../services/scheduleRuleDetail";

import _ from "lodash";
import { message } from "antd";
import pathToRegexp from "path-to-regexp";
import { routerRedux } from 'dva/router';

export default {
  namespace: 'scheduleRuleDetail',

  state: {
    profiles: null,
    editModal: false,
    loading: false,
    classSetLoading: false,
    departmentDetail: null,
    rosterDetail: null,
    shiftGroupsTogether: null,
    shiftGroupsNoTogether: null,
    classModalStatus: false,
    modalData: null,
    groupModalStatuss: false,
    groupModalType: 'together',
    shiftsTable: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathToRegexp('/scheduleRuleDetail/:id').exec(location.pathname);
        if (match) {
          const id = match[1];
          dispatch({ type: 'init', payload: { roster_id: id } })
          dispatch({ type: 'setRosterId', payload: { roster_id: id } })
        }
      });
    },
  },

  effects: {
    *routerToShiftUserSetting({payload}, {select, call, put}) {
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id);
      yield put(routerRedux.push(`rosters/${roster_id}/shiftUserSetting`));
    },
    *alterRosterShifts({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id);
      const shift_id = payload.shift_id;
      const params = payload.data;
      const {data, err} = yield call(alterRosterShifts, roster_id, shift_id, params, token);
      if (!err) {
        yield put({
          type: 'fetchRosterShifts',
          payload: {
          }
        })
      }
    },
    *alterShiftGroups({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id)
      const shift_group_id = payload.shift_group_id;
      const params = payload.data;
      const {data, err} = yield call(alterShiftGroups, roster_id, shift_group_id, params, token);
      if (!err) {
        yield put({
          type: 'fetchShiftGroups',
        })
      }
    },
    *deleteShiftGroups({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id)
      const shift_group_id = payload.shift_group_id;
      const {data, err} = yield call(deleteShiftGroups, roster_id, shift_group_id, token);
      if (!err) {
        yield put({
          type: 'fetchShiftGroups',
        })
      }
    },
    *settingEmpty({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id)
      const {data, err} = yield call(settingEmpty, roster_id, token);
      if (!err) {
        yield put({
          type: 'init',
          payload: {
            data: data.data,
            roster_id: roster_id
          }
        })
      }
    },
    *adoptUltimoSetting({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id)
      const {data, err} = yield call(adoptUltimoSetting, roster_id, token);
      if (!err) {
        yield put({
          type: 'init',
          payload: {
            data: data.data,
            roster_id: roster_id
          }
        })
      }
    },
    *rostering({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.roster_id)
      const {data, err} = yield call(rostering, roster_id, token);
      if (!err) {
        message.success('自动排更，跳转到排更编辑页')
        const roster_id = yield select(state => state.scheduleRuleDetail.roster_id);
        yield put(routerRedux.push(`rosters/${roster_id}`));
      }
    },

    *fetchDepartmentDetail({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const department_id = payload.department_id;
      const {data, err} = yield call(fetchDepartmentDetail, department_id, token);
      if (!err) {
        yield put({
          type: 'fetchDepartmentDetailSuccess',
          payload: {
            data: data.data
          }
        })
      }
    },
    *init({ payload }, { select, call, put }) {
      yield put({
        type: 'showLoading'
      })
      const roster_id = payload.roster_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const rosterDetail = yield call(fetchRosterDetail, roster_id, token);
      if (!rosterDetail.err) {
        yield put({
          type: 'fetchRosterDetailSuccess',
          payload: {
            data: rosterDetail.data.data
          }
        })
        const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id)
        const department_id = rosterDetail.data.data.department_id;

        yield put({
          type: 'fetchDepartmentDetail',
          payload: {
            department_id: department_id
          }
        })

        const profiles = yield call(featchProfiles, department_id, token);
        if (!profiles.err) {
          yield put({
            type: 'fetchProfilesSuccess',
            payload: {
              data: profiles.data.data.profiles
            }
          })
        }

        const date = new Date();
        const params = {
          year: date.getFullYear(),
          month: 1,
          department_id: department_id
        }
        const {data, err} = yield call(queryRosterByDate, params, token);
        if (data) {
          if (data.data.length != 0) {
            //todo 弹窗提示沿用上月排班
          }
          if (data.data.length == 0) {
            yield put({
              type: 'fetchRosterShifts',
              payload: {
                roster_id: roster_id
              }
            })
            yield put({
              type: 'fetchShiftGroups',
              payload: {
                roster_id: roster_id
              }
            })
          }
        }
        if (err) {
          console.log(err)
        }
        yield put({
          type: 'overLoading'
        })
      }
      if (rosterDetail.err) {
        console.log(rosterDetail.err)
      }
    },

    *fetchRosterDetail({ payload }, { select, call, put }) {
      yield put({
        type: 'showLoading'
      })
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = payload.roster_id;
      const {data, err} = yield call(fetchRosterDetail, roster_id, token);
      if (!err) {
        yield put({
          type: 'fetchRosterDetailSuccess',
          payload: {
            data: data.data
          }
        })
      }
      yield put({
        type: 'overLoading'
      })


    },
    *createShiftGroups({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id);
      const params = payload.data;
      const groupModalType = yield select(state => state.scheduleRuleDetail.groupModalType);
      const is_together = groupModalType == 'together' ? true : 'false';
      params.roster_id = roster_id;
      params.is_together = is_together;
      const {data, err} = yield call(createShiftGroups, roster_id, params, token);
      if (!err) {
        yield put({
          type: 'fetchShiftGroups'
        })
      }
    },

    *fetchShiftGroups({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id)
      let is_together = 'true';
      const togetherResult = yield call(fetchShiftGroups, roster_id, is_together, token);
      is_together = 'false';
      const noTogetherResult = yield call(fetchShiftGroups, roster_id, is_together, token);
      if (!togetherResult.err && !noTogetherResult.err) {
        yield put({
          type: 'fetchShiftGroupsTogetherSuccess',
          payload: {
            data: togetherResult.data.data
          }
        })
        yield put({
          type: 'fetchShiftGroupsNoTogetherSuccess',
          payload: {
            data: noTogetherResult.data.data
          }
        })
      }
    },
    *setRouterInterval({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const {type, grade, value} = payload;
      const params = {
        grade: grade,
        value: value
      }
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id);
      const {data, err} = yield call(setRouterInterval, roster_id, type, params, token);
      if (err) {
        console.log(err);
      }
    },
    *addClass({ payload }, { select, call, put }) {
      console.log('effect', payload);
    },

    *fetchRosterShifts({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id);
      const { data, err } = yield call(fetchRosterShifts, roster_id, token);
      if (data.state == "success") {
        yield put({
          type: 'fetchRosterShiftsSuccess',
          payload: {
            data: data.data
          }
        })
      }
    },

    *deleteShift({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id);
      const { shift_id } = payload;
      const { data, err } = yield call(deleteRosterShifts, roster_id, shift_id, token);
      if (!err) {
        yield put({
          type: 'fetchRosterShifts',
          payload: {}
        })
      }
    },

    *createRosterShifts({ payload }, { select, call, put }) {
      const params = payload.data;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.scheduleRuleDetail.rosterDetail.id);
      const { data, err } = yield call(createRosterShifts, roster_id, params, token)
      if (!err) {
        message.success('添加成功');
        yield put({ type: 'fetchRosterShifts' })
      }
    },
  },

  reducers: {
    fetchRosterDetailSuccess(state, {payload}) {
      return { ...state, rosterDetail: payload.data }
    },
    changeGroupModalType(state, {payload}) {
      if (state.groupModalType == 'together') {
        return { ...state, groupModalType: 'no_together' }
      }
      if (state.groupModalType == 'no_together') {
        return { ...state, groupModalType: 'together' }
      }
    },
    fetchShiftGroupsNoTogetherSuccess(state, {payload}) {
      return { ...state, shiftGroupsNoTogether: payload.data }
    },
    fetchShiftGroupsTogetherSuccess(state, {payload}) {
      return { ...state, shiftGroupsTogether: payload.data }
    },
    fetchRosterShiftsSuccess(state, { payload }) {
      return { ...state, shiftsTable: payload.data }
    },

    showModal(state, { payload }) {
      const currentModal = payload.modalType + 'Status';
      const modalData = _.get(payload, 'modalData', null);
      if (payload.modal === 'groupModal') {
        let type = payload.groupModalType;
        return { ...state, [currentModal]: true, groupModalType: type, editModal: payload.editModal };
      }
      return { ...state, [currentModal]: true, modalData: modalData, editModal: payload.editModal };
    },
    hideModal(state, { payload }) {
      const currentModal = payload.modalType + 'Status';
      return { ...state, [currentModal]: false };
    },
    fetchDepartmentDetailSuccess(state, {payload}) {
      return { ...state, departmentDetail: payload.data }
    },
    showLoading(state, {payload}) {
      return { ...state, loading: true }
    },
    overLoading(state, {payload}) {
      return { ...state, loading: false }
    },
    classSetLoadingStart(state, {payload}) {
      return { ...state, classSetLoading: true }
    },
    classSetLoadingEnd(state, {payload}) {
      return { ...state, classSetLoading: false }
    },
    setRosterId(state, {payload}) {
      return { ...state, roster_id: payload.roster_id }
    },
    fetchProfilesSuccess(state, {payload}) {
      return { ...state, profiles: payload.data }
    }
  },
};
