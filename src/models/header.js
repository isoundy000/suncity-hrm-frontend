/**
 * Created by meng on 16/9/16.
 */

import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { SEARCH_CATEGORIES } from '../constants/SearchConstants';
import { jsonToQuery } from '../utils/url_helper';

export default {
  namespace: 'header',

  state: {
    searchType: '',
    searchText: '',

    searchCategories: [],
    currentUserCan: {},
    showSearchBox: false,
  },

  subscriptions: {

  },

  effects: {
    *searchCommit(action, { put, call, select }) {
      let {
        searchType: search_type,
        searchText: search_data,
      } = yield select(state => state.header);
      let search_place = [];
      if(search_type.startsWith('applicant_')) {
        search_type = search_type.slice(10);
        search_place.push('applicant_');
      }
      search_place.push('profiles');
      const profiles = search_place.join('');
      const region = yield select(state => state.region);

      const params = {
        search_type,
        search_data,
        region,
        startSearch: true
      };
      yield put(routerRedux.push(`/${profiles}${jsonToQuery(params)}`));
    },
    *searchCategoriesChanged(action, { put, select }) {
      const region = yield select(state => state.region);
      const currentUser = yield select(state => state.currentUser);
      const {currentUserCan} = yield select(state => state.header);
      
      let change = false;
      let currentUserCanTem = {};
      let searchCategoriesTem = [];

      for (let prop in currentUserCan) {
        if (!currentUser.can.hasOwnProperty(prop)) {
          change = true;
          continue ;
        };
        currentUserCanTem[prop] = currentUserCan[prop];
      };
      for (let prop in currentUser.can) {
        if (!currentUserCan.hasOwnProperty(prop)) {
          change = true;
          currentUserCanTem[prop] = currentUser.can[prop];
        }
      };

      yield put ({ type: "setCurrentUserCan", payload: currentUserCanTem });
      if(change){
        if((region === 'macau' &&
            currentUser.can.manageProfileInMACAU === true)
        || (region === 'manila'  &&
            currentUser.can.manageProfileInMANILA === true)){
              SEARCH_CATEGORIES.map((item)=>{
                if(item.search_source === 'profiles'){
                  searchCategoriesTem.push(item);
                };
              });
        };
        if((region === 'macau' &&
            currentUser.can.createApplicantProfileInMACAU === true)
        || (region === 'manila'  &&
            currentUser.can.createApplicantProfileInMANILA === true)){
              SEARCH_CATEGORIES.map((item)=>{
                if(item.search_source === 'applicantProfiles'){
                  searchCategoriesTem.push(item);
                };
              });
        };

        if(searchCategoriesTem.length === 0){
          const hide = false;
          yield put ({ type: "setSearchBoxShow", payload: hide });
        }else{
          const show = true;
          yield put ({ type: "setSearchBoxShow", payload: show });
        }
        yield put ({ type: "setSearchCategories", payload: searchCategoriesTem });
        yield put ({ type: "advancedSearch/setSearchCategories", payload: searchCategoriesTem });
        if(searchCategoriesTem.length !== 0){
          yield put ({ type: 'searchTypeSelected', payload:searchCategoriesTem[0].search_type });
        };
      };
    },
  },

  reducers: {
    searchTypeSelected(state, { payload: searchType }) {
      return {
        ...state,
        searchType,
      };
    },
    searchTextChanged(state, { payload: searchText }) {
      return {
        ...state,
        searchText,
      };
    },
    setSearchCategories(state, { payload: searchCategories }) {
      return {
        ...state,
        searchCategories,
      };
    },
    setSearchBoxShow(state, { payload: showSearchBox }) {
      return {
        ...state,
        showSearchBox,
      };
    },
    setCurrentUserCan(state, { payload: currentUserCan }) {
      
      return {
        ...state,
        currentUserCan,
      };
    },
  }
};
