/**
 * Created by meng on 16/9/18.
 */

import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { SEARCH_CATEGORIES } from 'constants/SearchConstants';
import { checkAdvancedSearch } from 'services/advancedSearch';
import { jsonToQuery } from 'utils/url_helper';

export default {
  namespace: 'advancedSearch',

  state: {
    isModalVisible: false,
    loading: false,
    category: "",
    items: [],
    nextValue: '',
    unmatchedValues: [],
    error: null,

    searchCategories: [],
  },

  subscriptions: {

  },

  effects: {
    *submit(action, { put, call, select }) {
      const { category: searchType, items, nextValue } = yield select(state => state.advancedSearch);
      const searchItems = items.map(item => item.value);
      const searchNextValue = nextValue;
      const searchData = searchItems.concat([nextValue]).filter(item => !!item);
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      yield put({ type: 'waitSubmit' });
      const { data, err } = yield call(checkAdvancedSearch, {
        searchType,
        searchData,
        region,
        token,
      });
      if (err) {
        yield put({ type: 'hasError', payload: err });
      }
      if (data) {
        if (data.data.unmatched_values.length === 0) {
          const newSearchType = searchType.indexOf('applicant') != -1 ? searchType.replace('applicant_', '') : searchType;
          const params = {
            search_type: newSearchType,
            search_data: searchData,
            region,
            startSearch: true
          };
          yield put({ type: 'didSubmit' });
          yield put({ type: 'hideModal' });
          const routerType = searchType.indexOf('applicant') != -1 ? 'applicant_profiles' : 'profiles';
          yield put(routerRedux.push(`/${routerType}${jsonToQuery(params)}`));
        } else {
          yield put({ type: 'hasUnmatched', payload: data.data.unmatched_values });
        }
      }
    },
    *ignoreUnmatched(action, { put, call, select }) {
      const { category: searchType, items, nextValue } = yield select(state => state.advancedSearch);
      const searchData = items.map(item => item.value);
      searchData.push(nextValue);
      const region = yield select(state => state.region);
      const newSearchType = searchType.indexOf('applicant') != -1 ? searchType.replace('applicant_', '') : searchType;

      const params = {
        search_type: newSearchType,
        search_data: searchData,
        region,
        startSearch: true,
      };
      yield put({ type: 'hideModal' });
      const routerType = searchType.indexOf('applicant') != -1 ? 'applicant_profiles' : 'profiles';
      yield put(routerRedux.push(`/${routerType}${jsonToQuery(params)}`));
    },
    *setSearchCategories(action, { put, select }) {
      const advancedSearch = yield select(state => state.advancedSearch);

      if(advancedSearch.searchCategories.length !== 0){
        yield put ({ type: 'changeCategory', payload: advancedSearch.searchCategories[0].search_type});
      };
    },
  },

  reducers: {
    showModal(state) {
      return {
        ...state,
        isModalVisible: true,
      };
    },
    hideModal(state) {
      return {
        ...state,
        isModalVisible: false,
        items: [],
        nextValue: '',
        unmatchedValues: [],
        error: null,
      };
    },
    changeCategory(state, { payload: category }) {
      return {
        ...state,
        category,
        items: [],
        nextValue: '',
        unmatchedValues: [],
        error: null,
      };
    },
    changeNextValue(state, { payload: nextValue }) {
      return {
        ...state,
        nextValue,
      };
    },
    commitNextValue(state, { payload: nextValue }) {
      if (_.isEmpty(nextValue)) {
        return { ...state };
      } else {
        return {
          ...state,
          items: _.concat(state.items, {
            id: (state.items.length > 0 ? _.last(state.items).id + 1 : 0),
            value: nextValue,
          }),
          nextValue: '',
        }
      }
    },
    changeItem(state, { payload: changedItem }) {
      const items = state.items.map(
        item => (item.id === changedItem.id ? changedItem : item)
      );
      const unmatchedValues = state.unmatchedValues.filter(
        value => _.find(items, item => item.value === value)
      );
      return {
        ...state,
        items,
        unmatchedValues,
      };
    },
    deleteItem(state, { payload: deletedItem }) {
      return {
        ...state,
        items: state.items.filter(item => item.id !== deletedItem.id),
      };
    },
    waitSubmit(state) {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    didSubmit(state) {
      return {
        ...state,
        loading: false,
      };
    },
    hasUnmatched(state, { payload: unmatchedValues }) {
      return {
        ...state,
        loading: false,
        unmatchedValues,
      }
    },
    hasError(state, { payload: error }) {
      return {
        ...state,
        loading: false,
        error,
      }
    },
    setSearchCategories(state, { payload: searchCategories }) {
      return {
        ...state,
        searchCategories,
      };
    },
  }
};
