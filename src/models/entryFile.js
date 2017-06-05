import React from "react";
import { routerRedux } from "dva/router";
import { message } from "antd";
import {
  fetchProfile,
  fetchAttachmentTypes,
  fetchUnFinishedList,
  sendSMSByPhoneNumber,
  downloadEntryFile,
  setSmsSent
} from "../services/entryFile";

export default {

  namespace: 'entryFile',

  state: {
    pagination: null,
    smsTemplate: null,
    attachMentTypes: [],
    profile: null,
    attachmentTypes: [],
    smsModalVisible: -1,
    tableData: [],
    tableFields: [],
    loading: false,
    fields: null,
    appendFields: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/entryFile') {
          dispatch({ type: 'fetchList', payload: {} });
        }
      });
    },
  },

  effects: {
    * downloadEntryFile({ payload }, { select, call, put }){
      yield put({ type: 'showLoading' });
      const region = yield select(state => state.region);
      yield call(downloadEntryFile, region);
      yield put({ type: 'overLoading' });
    },
    *setSmsTemplate({ payload }, { call, put, select }){
      const havedTypes = payload.havedTypes;
      const record = payload.record;
      const types = yield select(({ entryFile })=>entryFile.attachMentTypes);
      let noType = new Array();
      types.map(type=> {
        havedTypes.indexOf(type.id) != -1 ? null : noType.push(type.chinese_name)
      });
      let sms = record.chinese_name + ':\n' + '您在以下職位中:\n' + record.department + record.position + '確實下面這些文件:' + '\n' + noType.toString();
      yield put({
        type: 'setSmsTemplateSuccess',
        payload: {
          data: sms
        }
      })
    },
    *fetchProfile({ payload }, { call, put, select }){
      yield put({ type: 'clearProfile' });
      const profile = yield call(fetchProfile, payload.id);
      if (profile.data) {
        yield put({ type: 'fetchProfileSuccess', payload: { data: profile.data.data } })
      }
    },

    *fetchList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const region = yield select(state => state.region);
      const token = yield select(state => state.currentUser.token);
      const params = { region: region };
      const types = yield call(fetchAttachmentTypes, params, token)
      if (types.data) {
        yield put({
          type: 'fetchAttachMentTypesSuccess', payload: {
            data: types.data.data
          }
        });
        yield put({
          type: 'setAppendFields',
          payload: {
            data: types.data.data
          }
        });
        let pagination = {};
        if (payload.page) {
          pagination.page = payload.page;
        }

        const { data, err } = yield call(fetchUnFinishedList, { ...params, ...pagination }, token);
        if (err) {
          console.log(err);
        }
        if (data) {
          yield put({
            type: 'setPagination',
            payload: {
              data: data.meta
            }
          });
          yield put({
            type: 'setFields',
            payload: {
              data: data.data.fields
            }
          });
          let tableData = new Array();
          data.data.profiles.map((profile)=> {
            tableData.push(
              {
                ...profile,
              }
            )
          });
          yield put({ type: 'setTableData', payload: { data: tableData } });
          yield put({ type: 'overLoading' });
        }
      }
    },

    *sendSMS({ payload }, { call, put, select }) {
      const { id, patchData, record } = payload;
      const token = yield select(state => state.currentUser.token);
      const params = { to: patchData.mobile, content: patchData.sms, title: 'entryfile' };
      const { data, err } = yield call(sendSMSByPhoneNumber, params, token);
      if (data) {
        message.success('短信發送成功');
      }
      if (err) {
        console.log(err)
      }
      if (data) {
        const { err } = yield call(setSmsSent, id, token);
        if (err) {
          console.log(err)
        }
        yield put({ type: 'sendSMSSuccess', payload: { record: record } });
      }
    },

    *redirectTo({ payload }, { call, put, select }) {
      const { id } = payload;
      const smsModalVisible = yield select(state => state.entryFile.smsModalVisible);

      if (smsModalVisible < 0) {
        // yield put(routerRedux.push(`/applicant_profiles/${id}`));
        yield put(routerRedux.push(`/profile/${id}`));
      }
    },

  },

  reducers: {
    setPagination(state, { payload }){
      return { ...state, pagination: payload.data }
    },
    setSmsTemplateSuccess(state, { payload }){
      return { ...state, smsTemplate: payload.data }
    },
    fetchAttachMentTypesSuccess(state, { payload }){
      return { ...state, attachMentTypes: payload.data };
    },
    clearProfile(state, { payload }){
      return { ...state, profile: null };
    },
    fetchProfileSuccess(state, { payload }){
      return { ...state, profile: payload.data };
    },
    showLoading(state, { payload }){
      return { ...state, loading: true };
    },
    overLoading(state, { payload }){
      return { ...state, loading: false };
    },
    toggleModal(state, { payload }) {
      const { id } = payload;
      const tableDate = state.tableDate;
      return { ...state, smsModalVisible: id };
    },
    sendSMSSuccess(state, { payload }) {
      const { record } = payload;
      const index = state.tableDate.indexOf(record);
      let data = state.tableDate;
      data[index].attachment_missing_sms_sent = true;
      return { ...state, tableDate: data }
    },
    setTableData(state, { payload }){
      return { ...state, tableDate: payload.data }
    },
    setFields(state, { payload }){
      return { ...state, fields: payload.data }
    },
    setAppendFields(state, { payload }){
      return { ...state, appendFields: payload.data }
    }
  },
}
