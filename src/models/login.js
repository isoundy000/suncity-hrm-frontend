import { routerRedux } from 'dva/router';
import { login as loginRequest } from '../services/login';

export default {
  namespace: 'login',
  state: {
    onLogin: false
  },
  effects: {
    *login( { payload }, { put, call } ) {

      //Send Login Request
      const { data, err } = yield loginRequest(payload.identity, payload.password);

      //Login Failed
      if(err) {
        const error = yield call(() => err.response.json());

        yield put({
          type: 'loginFailed',
          payload: {
            error: error.data
          }
        });
      }

      //Login Success
      if(data) {
        console.log('login Success', data);
        yield put({
          type: 'currentUser/setCurrentUser',
          payload: data.data
        });

        yield put({
          type: 'currentUser/startSetCurrentUserPermissions',
          payload: {
            currentUser: data.data
          },
        });

        yield put(routerRedux.push('/'));
      }

      //Login Finished
      yield put({
        type: 'endLogin'
      });
    }
  },
  reducers: {
    login(state) {
      return {...state, onLogin: true}
    },
    endLogin(state) {
      return {...state, onLogin: false}
    },

    loginFailed(state, { payload }) {
      return {
        ...state,
        error: payload.error
      }
    }
  }
}
