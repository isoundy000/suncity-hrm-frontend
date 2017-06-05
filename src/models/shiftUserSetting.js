import { createShiftUserSetting, fetchDepartment, fetchPosition, fetchShiftUserSetting, updateShiftUserSetting } from '../services/shiftUserSetting';

import { fetchRosterShifts } from "../services/scheduleRuleDetail";
import pathToRegexp from "path-to-regexp";
import { routerRedux } from 'dva/router';

export default {
  namespace: 'shiftUserSetting',

  state: {
    meta: null,
    loading: false,
    search_params: {
      sort_column: '',
      sort_direction: '',
      page: '',
      position_id: '',
      empoid: '',
      chinese_name: '',
      english_name: '',
    },
    shifts: null,
    roster_id: null,
    positions: null,
    departments: null,
    dataTable: null,
    classSetModalStatus: false,
    holidaySetModalStatue: false
  },

  subscriptions: {

    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathToRegexp('/rosters/:id/shiftUserSetting').exec(location.pathname);
        if (match) {
          const roster_id = match[1];
          dispatch({ type: 'setRosterId', payload: { roster_id: roster_id } })
          dispatch({
            type: 'init',
          })
        }
      });
    },
  },

  effects: {
    *search({payload}, {select, call, put}) {
      console.log('payload', payload);
      const {type, searchText} = payload;
      yield put({
        type: 'updateSearchParams',
        payload: {
          type: type,
          text: searchText
        }
      })
      yield put({
        type: 'fetchShiftUserSetting'
      })
    },

    *clearSearch({payload}, {select, call, put}) {
      yield put({
        type: 'clearSearchParams'
      })
      yield put({
        type: 'fetchShiftUserSetting'
      })
    },

    *init({payload}, {select, call, put}) {
      yield put({
        type: 'fetchShiftUserSetting'
      })
      yield put({
        type: 'fetchDepartmentPosition'
      })
      yield put({
        type: 'fetchRosterShifts'
      })
    },

    *routerToRosterShift({payload}, {select, call, put}) {
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      yield put(routerRedux.push(`scheduleRuleDetail/${roster_id}`));
    },

    *fetchRosterShifts({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
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

    *createShiftUserSetting({payload}, {select, call, put}) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const params = payload.data;
      const {data, err} = yield call(createShiftUserSetting, roster_id, params, token);
      if (!err) {
        yield put({
          type: 'fetchShiftUserSetting'
        })
      }
    },

    *updateShiftUserSetting({payload}, {select, call, put}) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const params = payload.data;
      const {data, err} = yield call(updateShiftUserSetting, roster_id, params, token);
      if (!err) {
        yield put({
          type: 'fetchShiftUserSetting'
        })
      }
    },

    *fetchDepartmentPosition({payload}, {select, call, put}) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const region = yield select(state => state.region);
      const params = { region: region }
      const positions = yield call(fetchPosition, params, token);
      const departments = yield call(fetchDepartment, params, token);
      if (!positions.err && !departments.err) {
        yield put({
          type: 'fetchDepartmentPositionSuccess',
          payload: {
            positions: positions.data.data,
            departments: departments.data.data
          }
        })
      }
    },


    *fetchShiftUserSetting({ payload }, { select, call, put }) {
      yield put({
        type: 'showLoading'
      })
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const search_params = yield select(state => state.shiftUserSetting.search_params);
      const {data, err} = yield call(fetchShiftUserSetting, roster_id, search_params, token);
      if (!err) {
        yield put({
          type: 'fetchShiftUserSettingSuccess',
          payload: {
            data: data.data,
            meta: data.meta
          }
        })
      }
      yield put({
        type: 'overLoading'
      })
    },
  },

  reducers: {
    fetchDepartmentPositionSuccess(state, {payload}) {
      return { ...state, positions: payload.positions, departments: payload.departments }
    },
    fetchShiftUserSettingSuccess(state, {payload}) {
      return { ...state, dataTable: payload.data, meta: payload.meta };
    },
    showModal(state, { payload }) {
      const currentModal = payload.modalType + 'Status';
      const modalData = _.get(payload, 'modalData', null);
      if (payload.modalType === '') {

      }
      return { ...state, [currentModal]: true, modalData: modalData };
    },
    hideModal(state, { payload }) {
      const currentModal = payload.modalType + 'Status';
      return { ...state, [currentModal]: false, modalData: null };
    },
    setRosterId(state, {payload}) {
      return { ...state, roster_id: payload.roster_id }
    },
    fetchRosterShiftsSuccess(state, { payload }) {
      return { ...state, shifts: payload.data }
    },
    showLoading(state, {payload}) {
      return { ...state, loading: true }
    },
    overLoading(state, {payload}) {
      return { ...state, loading: false }
    },
    checkDataTable(state, {payload}) {
      let newDataTable = state.dataTable;
      newDataTable.map(data => data.shift_user_settings_of_roster == null ? data.DataErr = true : null);
      return { ...state, dataTable: newDataTable }
    },
    updateSearchParams(state, {payload}) {
      const {type, text} = payload;
      return { ...state, search_params: { ...state.search_params, [type]: text } }
    },
    clearSearchParams(state, {payload}) {
      return { ...state, search_params: null }
    }
  },
};
