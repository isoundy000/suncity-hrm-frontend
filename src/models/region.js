import { REGION } from '../constants/GlobalConstants';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

export default {

  namespace: 'region',
  state: REGION.MACAU,

  subscriptions: {
  },

  effects: {
    *toggleRegion({ payload }, { put, select }) {
      const currentPath = yield select(state =>
        state.routing.locationBeforeTransitions.pathname
      );

      const currentUser = yield select(state => state.currentUser);

      console.log('all state', currentPath, currentUser);

      yield put({
        type: 'toggleRegionSucceed',
        payload: null,
      });

      /* if (currentUser.canVisit(currentPath)) {
         yield put(routerRedux.push(`${currentPath}`));
         }
       */
      yield put(routerRedux.push('/'));
    }
  },

  reducers: {
    toggleRegionSucceed(state) {
      if(state == REGION.MACAU) {
        return REGION.MANILA;
      }else{
        return REGION.MACAU;
      }
    }
  }
}
