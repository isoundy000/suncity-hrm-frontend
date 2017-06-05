import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { Set } from 'immutable';
import { fetchProfilesRequest, fetchProfilesStatisticsRequest, exportProfilesRequest } from 'services/applicantProfiles';
import { fieldsToColumns } from 'helpers/profiles';

const getFilterParams = function*(select) {
  const profilesState = yield select(state => state.applicantProfiles);

  const queryColumns = profilesState.tableFields.map((column) => {
    return column.key;
  }).filter((key) => {
    return !Set(['photo', 'apply_position', 'apply_department', 'apply_source', 'apply_date', 'apply_status']).has(key);
  });

  if(profilesState.advanceSearch) {
    return {
      advance_search: true,
      select_columns: queryColumns,
      ...profilesState.advanceSearch
    };
  }
  const selectedDepartmentId = _.get(profilesState, 'selectedDepartment.id');
  const selectedPositionId = _.get(profilesState, 'selectedPosition.id');
  const selectedSource = _.get(profilesState, 'selectedSource.id');
  const selectedStatus = _.get(profilesState, 'selectedApplyState.key');

  const queryCreatedAt = _.get(profilesState, 'queryCreatedAt');

  const search_type = _.get(profilesState, 'search_type');
  const search_data = _.get(profilesState, 'search_data');

  return {
    select_columns: queryColumns,
    department_id: selectedDepartmentId,
    position_id: selectedPositionId,
    source: selectedSource,
    applicant_position_status: selectedStatus,
    created_at: queryCreatedAt,
    search_type: search_type,
    search_data: search_data,
  };
}

export default {
  namespace: 'applicantProfiles',
  state: {
    tableFields: [],
    tableData: [],

    totalNum: null,
    loadingProfiles: false,
    filterSearchStart: false,

    editingViewColumns: false,
    statistics: null,

    selectedDepartment: null,
    selectedPosition: null,
    selectedSource: null,
    selectedApplyDate: null,
    selectedApplyState: null,
    queryCreatedAt: null,
    advanceSearch: false,

    showSearchModal: false,
    exporting: false,
    editingExportingColumns: false,

    photoWidth: 0,
    photoHeight: 0,

    // search
    search_type: null,
    search_data: null,
    region: 'macau',
    startSearch: false,
    page: 1,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query}) => {
        const match = pathToRegexp('/applicant_profiles').exec(pathname);
        if (match) {
          dispatch({type: 'clearFilterParams'});
          dispatch({type: 'fetchProfilesStatistics'});

          if(query.startSearch) {
            let params = query;
            if (params['search_data[]']) {
              params.search_data = params['search_data[]']
              params['search_data[]'] = null;
            }
            dispatch({
              type: 'setFilterParams',
              payload: params
            });
          }

          dispatch({type: 'fetchProfiles'});
        }
      });
    }
  },

  effects: {
    *addingNewApplicantProfile(action, { call, put, select }) {
      yield put(routerRedux.push('/applicant_profiles/new'));
    },
    *clearAdvanceSearchThenFetchProfiles(action, { call, put, select }) {
      yield put({
        type: 'setAdvanceSearch',
        payload: null,
      });
      yield put({
        type: 'fetchProfiles'
      });
    },
    *fetchProfiles({ payload: params }, { call, put, select }) {
      const region = yield select(state => state.region);
      const queryParams = yield getFilterParams(select);

      if (_.get(params, 'exportExcel')) {
        yield put({type: 'toggleExporting'});
        yield put({type: 'toggleEditingExportingColumns'});
        yield exportProfilesRequest({
          region,
          ...queryParams,
          select_columns: params.select_columns,
        });
        yield put({type: 'toggleExporting'});
      }else {
        yield put({
          type: 'onFetchProfiles',
          payload: params? params.page : 1
        });
        const profilesResponse = yield fetchProfilesRequest({
          region,
          ...queryParams,
          ...params,
        });

        const fileds = fieldsToColumns(profilesResponse.data.data.fields);

        yield put({
          type: 'setTableFields',
          payload: fileds
        });

        yield put({
          type: 'setTableData',
          payload: profilesResponse.data.data.profiles
        });

        yield put({
          type: 'setTotalNum',
          payload: profilesResponse.data.meta.total_count
        });

        yield put({
          type: 'endLoadingProfiles'
        });
      }

    },
    *fetchProfilesStatistics(action, { call, put, select }) {
      const response = yield fetchProfilesStatisticsRequest();
      yield put({
        type: 'setStatistics',
        payload: response.data.data
      });
    },
    *showProfile({ payload: profileId }, { call, put, select }) {
      yield put(routerRedux.push('/applicant_profiles/' + profileId));
    },
  },

  reducers: {
    setFilterParams(state, { payload:params }) {
      return {
        ...state,
        ...params
      }
    },
    clearFilterParams(state) {
      return {
        ...state,
        selectedDepartment: null,
        selectedPosition: null,
        selectedSource: null,
        selectedApplyDate: null,
        selectedApplyState: null,
        queryCreatedAt: null,
        advanceSearch: false,
        search_data: null,
        search_type: null
      }
    },
    onFetchProfiles(state, { payload: page }) {
      return {
        ...state,
        loadingProfiles: true,
        filterSearchStart: true,
        page
      };
    },
    setTableData(state, { payload: tableData }) {
      return {
        ...state,
        tableData
      };
    },

    setTotalNum(state, { payload: totalNum }) {
      return {
        ...state,
        totalNum
      }
    },

    setTableFields(state, { payload: tableFields }) {
      return {
        ...state,
        tableFields
      };
    },

    setStatistics(state, { payload: statistics}) {
      return {
        ...state,
        statistics
      }
    },

    setQueryCreatedAt(state, { payload: queryCreatedAt}) {
      return {
        ...state,
        queryCreatedAt
      }
    },

    endLoadingProfiles(state) {
      return {
        ...state,
        loadingProfiles: false
      };
    },

    toggleChangeColumnModal(state) {
      return {
        ...state,
        editingViewColumns: !state.editingViewColumns
      }
    },

    changeFilterDepartment(state, { payload: selectedDepartment }) {
      return {
        ...state,
        selectedDepartment
      };
    },

    changeFilterPosition(state, { payload: selectedPosition }) {
      return {
        ...state,
        selectedPosition
      }
    },

    changeFilterSource(state, { payload: selectedSource }) {
      return {
        ...state,
        selectedSource
      }
    },
    toggleShowSearchModal(state) {
      return {
        ...state,
        showSearchModal: !state.showSearchModal
      }
    },

    toggleExporting(state) {
      return {
        ...state,
        exporting: !state.exporting
      }
    },
    toggleEditingExportingColumns(state) {
      return {
        ...state,
        editingExportingColumns: !state.editingExportingColumns
      }
    },

    setAdvanceSearch(state, { payload: advanceSearch }) {
      return {
        ...state,
        advanceSearch: advanceSearch
      }
    },
    changeFilterState(state, { payload: selectedApplyState }) {
      return {
        ...state,
        selectedApplyState
      }
    },

    changeImgSize(state, { payload }) {
      const { width, height } = payload;
      return {
        ...state,
        photoWidth: width,
        photoHeight: height,
      }
    },
  }
}
