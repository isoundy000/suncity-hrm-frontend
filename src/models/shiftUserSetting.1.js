import { addShifts, createShiftUserSetting, fetchDepartment, fetchPosition, fetchShiftUserSetting, removeShifts, updateShiftUserSetting } from '../services/shiftUserSetting';

import pathToRegexp from "path-to-regexp";

export default {
  namespace: 'shiftUserSetting',

  state: {
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
          console.log('this is idddddd', roster_id)
          dispatch({ type: 'setRosterId', payload: { roster_id: roster_id } })
          dispatch({
            type: 'fetchShiftUserSetting',
            payload: {}
          })
          dispatch({
            type: 'fetchDepartmentPosition',
            payload: {}
          })
          dispatch({
            type: 'test',
            payload: {}
          })
        }
      });
    },
  },

  effects: {

    *test({payload}, {select, call, put}) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const id = 1;
      const params = {}
      const {data, err} = yield call(updateShiftUserSetting, roster_id, id, params, token);
    },


    //修改特殊可排班别
    // *updateShiftSpecialItem({ payload }, { select, call, put }) {
    //   const token = yield select(state => _.get(state, 'currentUser.token', null));
    //   const roster_id = yield select(state => state.shiftUserSetting.roster_id);
    //   const id = payload.id;
    //   const params = {
    //     shift_special_item: payload.shift_special_item
    //   }
    //   const {data, err} = yield call(updateShiftSpecialItem, roster_id, id, params, token);
    // },


    // //添加特殊可排班别
    // *addShiftSpecial({ payload }, { select, call, put }) {
    //   const token = yield select(state => _.get(state, 'currentUser.token', null));
    //   const roster_id = yield select(state => state.shiftUserSetting.roster_id);
    //   const id = payload.id;
    //   const params = {
    //     shift_special_item: payload.shift_special_item
    //   }
    //   const {data, err} = yield call(addShiftSpecial, roster_id, id, params, token);
    // },

    // //删除特殊可排班别
    // *removeShiftSpecial({ payload }, { select, call, put }) {
    //   const token = yield select(state => _.get(state, 'currentUser.token', null));
    //   const roster_id = yield select(state => state.shiftUserSetting.roster_id);
    //   const id = payload.id;
    //   const params = {
    //     shift_special_item: payload.shift_special_item
    //   }
    //   const {data, err} = yield call(removeShiftSpecial, roster_id, id, params, token);
    // },

    //删除本月可排
    *removeShifts({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const id = payload.id;
      const params = {
        shift_ids: payload.shift_ids
      }
      const {data, err} = yield call(removeShifts, roster_id, id, params, token);
      if (err) {
        console.log(err);
      }
    },
    //添加本月可排班别
    *addShifts({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = yield select(state => state.shiftUserSetting.roster_id);
      const id = payload.id;
      const params = {
        shift_ids: payload.shift_ids
      }
      const {data, err} = yield call(addShifts, roster_id, id, params, token);
      if (!err) {
        yield put({
          type: '',
          payload: {
            data: data.data
          }
        })
      }
    },

    *fetchDepartmentPosition({payload}, {select, call, put}) {
      console.log('kaishile ')
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

    *addClass({ payload }, { select, call, put }) {
      console.log('effect', payload);
    },
    *fetchShiftUserSetting({ payload }, { select, call, put }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roster_id = 1;
      const {data, err} = yield call(fetchShiftUserSetting, roster_id, token);
      console.log('setinggggggg', data);
      if (!err) {
        yield put({
          type: 'fetchShiftUserSettingSuccess',
          payload: {
            data: data.data
          }
        })
      }
    },
  },

  reducers: {
    fetchDepartmentPositionSuccess(state, {payload}) {
      return { ...state, positions: payload.positions, departments: payload.departments }
    },
    fetchShiftUserSettingSuccess(state, {payload}) {
      return { ...state, dataTable: payload.data };
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
      return { ...state, [currentModal]: false };
    },
    setRosterId(state, {payload}) {
      return { ...state, roster_id: payload.roster_id }
    }

  },

};
