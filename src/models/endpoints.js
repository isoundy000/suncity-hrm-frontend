/**
 * Created by meng on 16/9/18.
 */

import { getEndpoint } from '../services/endpoints';

export default {
  namespace: 'endpoints',
  state: {
    getting: {},
    errors: {},
    data: {},
  },
  effects: {
    *get({ payload: endpoint }, { put, call, select }) {
      const region = yield select(state => state.region);
      const token = yield select(state => state.currentUser ? state.currentUser.token : null);
      const { data, error } = yield getEndpoint(endpoint, region, token);
      if (error) {
        yield put({
          type: 'fail',
          payload: {
            endpoint,
            error,
          },
        });
      }

      if (data) {
        yield put({
          type: 'succeed',
          payload: {
            endpoint,
            data: data.data,
          },
        });
      }

      yield put({
        type: 'end',
        payload: endpoint,
      });
    }
  },
  reducers: {
    get(state, { payload: endpoint }) {
      return {
        ...state,
        getting: {
          ...state.getting,
          [endpoint]: true,
        },
      };
    },
    succeed(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          [payload.endpoint]: payload.data,
        },
        errors: {
          ...state.errors,
          [payload.endpoint]: undefined,
        }
      };
    },
    fail(state, { payload }) {
      return {
        ...state,
        errors: {
          ...state.errors,
          [payload.endpoint]: payload.error,
        }
      };
    },
    end(state, { payload: endpoint }) {
      return {
        ...state,
        getting: {
          ...state.getting,
          [endpoint]: false,
        },
      }
    },
  }
}