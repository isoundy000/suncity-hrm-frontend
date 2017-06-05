import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../services/roleList';

export default {
  namespace: 'roleList',

  state: {
    modalVisible: {
      deleteRoleModal: -1,
      createRoleModal: -1,
      updateRoleModal: -1,
    },

    roles: [],
    loading: false,
    error: null,
  },

  subscriptions: {
    roleListSubscriber({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/login') {
          dispatch({ type: 'emptyList', payload: null });
        }

        if (location.pathname === '/roles') {
          dispatch({ type: 'startFetchRoles', payload: null });
        }
      });
    },
  },

  effects: {
    *startFetchRoles({ payload }, { call, put, select }) {

      yield put({ type: 'loading', payload: { ans: true }});

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchRoles, {
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        console.log(data.data);
        yield put({ type: 'fetchRolesSuccess', payload: { rolesData: data.data } });
      }
    },

    *startPxRole({ payload }, { call, put, select }) {
      const { id, pData, pType } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      /* const completedPData = Object.assign({}, pData, {
         region,
         });
       */
      if (pType === 'POST') {
        const { data, err } = yield call(createRole, {
          postData: pData,
          token,
        });

        if (err) {
          yield put({ type: 'hasError', payload: { error: err } });
        }

        if (data) {
          console.log(data);
          console.log('createRoleSuccess');

          yield put({
            type: 'createRoleSuccess',
            payload: {
              id,
              newRole: data.data,
            } });
        }

      } else if ( pType === 'PATCH') {
        const { data, err } = yield call(updateRole, {
          id,
          patchData: pData,
          token,
        });

        if (err) {
          yield put({ type: 'hasError', payload: { error: err } });
        }

        if (data) {
          yield put({
            type: 'updateRoleSuccess',
            payload: {
              id,
              patchData: pData,
            } });
        }
      }



    },

    *startCreateRole({ payload }, { call, put, select }) {
      const { postData } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      /* const completedPostData = Object.assign({}, postData, {
         region,
         });
       */
      const { data, err } = yield call(createRole, {
        postData: postData,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        console.log('createRoleSuccess');
      }
    },

    *startUpdateRole({ payload }, { call, put, select }) {
      const { id, patchData } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      /* const completedPatchData = Object.assign({}, patchData, {
         region,
         });
       */
      const { data, err } = yield call(updateRole, {
        id,
        patchData: patchData,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {

        yield put({
          type: 'updateRoleSuccess',
          payload: {
            id,
            patchData: patchData,
          } });
      }
    },

    *startDeleteRole({ payload }, { put, call, select }) {
      const { id } = payload;
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(deleteRole, { id, token, region });

      if (!err) {
        yield put({ type: 'startFetchRoles' });
      }
    },

    *redirectToRoles({ payload }, { put }) {
      yield put(routerRedux.push('/roles'));
    },
  },

  reducers: {
    loading(state, { payload }) {
      const { ans } = payload;
      return { ...state, loading: ans };
    },

    toggleModal(state, { payload }) {
      const { id, type } = payload;
      return { ...state, modalVisible: { ...state.modalVisible, [type]: id } };
    },

    emptyList(state, { payload }) {
      return { ...state, roles: []};
    },

    fetchRolesSuccess(state, { payload }) {
      const { rolesData } = payload;
      return { ...state,
               roles: rolesData,
               loading: false,
      };
    },

    createRoleSuccess(state, { payload }) {
      const { newRole } = payload;
      return { ... state, roles: [ ...state.roles, newRole ] };
    },

    updateRoleSuccess(state, { payload }) {
      const { id, patchData } = payload;
      const oldRoles = state.roles;

      const newRoles = oldRoles.map(role => {
        if (role.id === id) {
          return { ...role, ...patchData };
        }
        return role;
      })

      return { ... state, roles: newRoles };
    },

    deleteRoleSuccess(state, { payload }) {
      const { id } = payload;
      const oldRoles = state.roles;

      const newRoles = oldRoles.filter(role => {
        return role.id !== id;
      })

      return { ... state, roles: newRoles };
    },

    hasError(state, { payload }) {
      const { error } = payload;
      return { ...state, error };
    },
  },
}
