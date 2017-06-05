import { routerRedux } from 'dva/router';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import {
  fetchCurrentUserPermissions,
} from '../services/currentUser';

export default {
  namespace: 'currentUser',
  state: null,

  subscriptions: {
    currentUserPermissionsSubscriber({ dispatch, history }) {
      return history.listen(location => {
        const match = pathToRegexp('/*').exec(location.pathname);

        if (match && location.pathname !== '/login') {
          dispatch({ type: 'startSetCurrentUserPermissions', payload: { currentUser: null } });
        }
      });
    },
  },

  effects: {
    *removeCurrentUser(_, { put }) {
      yield put(routerRedux.push('/login'));
    },

    *startSetCurrentUserPermissions({ payload }, { call, put, select }) {
      const currentUser = payload.currentUser !== null ?
                          payload.currentUser : yield select(state => _.get(state, 'currentUser', null));

      if (currentUser) {
        const region = yield select(state => state.region);

        const { data, err } = yield call(fetchCurrentUserPermissions, {
          id: currentUser.id,
          token: currentUser.token,
          region,
        })

        if (data) {
          yield put({ type: 'setCurrentUserPermissionsSuccess', payload: { permissions: data.data}});
          yield put({ type: 'header/searchCategoriesChanged', payload: null });
        }
      }
    },
  },

  reducers: {
    setCurrentUser(state, { payload }){
      return payload.can === undefined ? { ...payload, can: {} } : { ...payload };
    },

    removeCurrentUser(){
      return null;
    },

    setCurrentUserPermissionsSuccess(state, { payload }){
      const { permissions } = payload;
      const currentUser = state;
      console.log('currentUser', currentUser);

      const can = permissions.reduce((list, item) => {
        const region = item.region.toUpperCase();
        list[`${item.action}${item.resource}In${region}`] = true;
        return list;
      }, {});

      return { ...state, permissions, can };
    },
  }
};
