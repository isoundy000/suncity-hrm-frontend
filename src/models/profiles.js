import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import * as Helpers from 'helpers/profiles';
import { fetchProfiles, exportProfilesRequest, queryUserIdCardNumberRequest } from 'services/profiles';

const defaultOption = Helpers.defaultOption;
let lastFetchTime = 0;

const defaultState = {
  //searchinput state
  search_type: 'empoid',
  search_data: null,
  region: 'macau',
  startSearch: false,
  page: 1,
  //end searchinput state

  //filter block state
  selectedDepartment: defaultOption,
  departmentsList: [],

  selectedPosition: defaultOption,
  positionsList: [],

  selectedLocation: defaultOption,
  selectedSubLocation: defaultOption,
  locationsList: [],
  subLocations: [],

  selectedCompany: defaultOption,
  selectedGrade: defaultOption,
  selectedStatus: defaultOption,
  selectedEmploymentStatus: defaultOption,
  queryUserIdCardNumber: '',
  queryUserIdCardNumberLoading: false,
  queryUserIdCardNumberMessage: null,
  queryUserIdCardNumberAction: null,
  queryUserIdCardNumberActionId: null,
  //end filter block state

  //profiles state
  selectedTableFields:[],
  tableFields: [],
  tableData: [],
  totalNum: 0,
  //end profiles state

  //activity indicator state
  loadingProfiles: false,
  filterSearchStart: false,
  //end activity indicator state

  //modal view state
  editingViewColumns: false,
  editingExportingColumns: false,
  showCreateProfileModal: false,
  exporting: false,
  //end modal view state
};
export default {
  namespace: 'profiles',
  state: defaultState,
  subscriptions: {
    setup({ dispatch, history }) {
      //Load Locations Departments And Positions
      history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/profiles').exec(pathname);
        if (match) {
          dispatch({
            type: 'clearState'
          });

          dispatch({
            type: 'fetchLocations'
          });

          dispatch({
            type: 'fetchDepartments'
          });

          dispatch({
            type: 'fetchPositions'
          });

          if(query.startSearch) {
            let params = query;
            if (params['search_data[]']) {
              params.search_data = params['search_data[]']
              params['search_data[]'] = null;
            }
            dispatch({
              type: 'startFilter',
              payload: params
            });
          }
        }
      });
    }
  },

  effects: {
    ...Helpers.createFetchEffects(['departments', 'locations', 'positions']),
    ...Helpers.groupSelectChangeEffect(['departments', 'locations', 'positions']),
    *queryUserIdCardNumberNext(_, { call, put, select }) {
      const queryUserIdCardNumberAction = yield select(state => state.profiles.queryUserIdCardNumberAction);
      const queryUserIdCardNumberActionId = yield select(state => state.profiles.queryUserIdCardNumberActionId);
      switch (queryUserIdCardNumberAction) {
        case 'createProfile':
          if(queryUserIdCardNumberActionId) {
            yield put(routerRedux.push({
              pathname: '/profiles/create',
              query: {
                applicantProfileTemplateId: queryUserIdCardNumberActionId
              }
            }));
          }else {
            yield put(routerRedux.push('/profiles/create'));
          }
          break;
        case 'editProfile': {
          yield put(routerRedux.push('/profile/' + queryUserIdCardNumberActionId));
        }
      }
      yield put({type: 'clearQueryUserIdState'});
    },
    *queryUserIdCardNumber({ payload: idCardNumber }, { call, put, select }) {
      yield put({
        type: 'setQueryUserIdCardNumberLoading',
        payload: true
      });
      const queryUserIdCardNumberResponse = yield queryUserIdCardNumberRequest(idCardNumber);
      yield put({
        type: 'setQueryUserIdCardNumberLoading',
        payload: false
      });
      const action = queryUserIdCardNumberResponse.data.data.action;
      switch (action) {
        case 'create_profile':
          const applicantProfileTemplateId = queryUserIdCardNumberResponse.data.data.applicant_profile_template_id;
          if(applicantProfileTemplateId) {
            yield put({
              type: 'setQueryUserIdCardNumberMessage',
              payload: '找到求職者檔案，將跳轉至新建員工檔案頁面。'
            });
            yield put({
              type: 'setQueryUserIdCardNumberActionId',
              payload: applicantProfileTemplateId,
            });
          }else {
            yield put({
              type: 'setQueryUserIdCardNumberMessage',
              payload: '未找到求職者檔案，將跳轉至新建員工檔案頁面。'
            });
          }

          yield put({
            type: 'setQueryUserIdCardNumberAction',
            payload: 'createProfile'
          });
          break;
        case 'edit_profile':
          const profileId = queryUserIdCardNumberResponse.data.data.profile_id;
          yield put({
            type: 'setQueryUserIdCardNumberMessage',
            payload: '已存在員工檔案，將跳轉至編輯頁面。'
          });
          yield put({
            type: 'setQueryUserIdCardNumberAction',
            payload: 'editProfile'
          });
          yield put({
            type: 'setQueryUserIdCardNumberActionId',
            payload: profileId,
          });
          break;
        default:
          return;
      }
    },
    *startFilter( { payload: params } , { call, put, select }) {
      const now = Date.now();
      const timeDuration = now - lastFetchTime;

      if (timeDuration < 100) {
        return;
      }else {
        lastFetchTime = now;
      }

      const queryParams = yield Helpers.getFilterParams(select);
      console.log(queryParams);
      const region = yield select(state => state.region);
      if (_.get(params, 'exportExcel')) {
        yield put({type: 'toggleExporting'});
        yield put({type: 'hideExportModal'});
        yield exportProfilesRequest({
          region,
          ...queryParams,
          select_columns: params.select_columns
        });
        yield put({type: 'toggleExporting'});
      } else {
        const { search_type, search_data, startSearch } = yield select(state => { return state.profiles });
        const newparams = { page: 1, search_type, search_data, region, startSearch, ...params };

        yield put({
          type: 'onStartFilter',
          payload: newparams
        });

        const profilesResponse = yield call(fetchProfiles, {
          region,
          ...queryParams,
          ...newparams
        });

        const fileds = Helpers.fieldsToColumns(profilesResponse.data.data.fields);

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
          type: 'endFilter'
        });
      }

    },

    *showProfile({ payload: profileId }, { call, put, select }) {
      yield put(routerRedux.push('/profile/' + profileId));
    },
  },

  reducers: {
    ...Helpers.createReducers(['departments', 'locations', 'positions']),
    selectGrade: Helpers.createSelectItemReducer('Grade'),
    selectCompany: Helpers.createSelectItemReducer('Company'),
    selectStatus: Helpers.createSelectItemReducer('Status'),
    selectEmploymentStatus: Helpers.createSelectItemReducer('EmploymentStatus'),
    selectSubLocation: Helpers.createSelectItemReducer('SubLocation'),


    clearState(state) {
      return defaultState;
    },
    showExportModal(state) {
      return {
        ...state,
        editingExportingColumns: true,
      }
    },
    showCreateProfileModal(state) {
      return {
        ...state,
        showCreateProfileModal: true,
      }
    },
    hideCreateProfileModal(state) {
      return {
        ...state,
        showCreateProfileModal: false,
      }
    },
    toggleExporting(state) {
      return {
        ...state,
        exporting: !state.exporting
      }
    },

    hideExportModal(state) {
      return {
        ...state,
        editingExportingColumns: false,
      }
    },

    onStartFilter(state, { payload: params }) {
      return {
        ...state,
        loadingProfiles: true,
        filterSearchStart: true,
        ...params,
      };
    },

    endFilter(state){
      return {
        ...state,
        loadingProfiles: false
      }
    },

    setTableData(state, { payload: tableData }) {
      return {
        ...state,
        tableData
      };
    },

    setTableColumns(state, { payload: tableColumns }) {
      return {
        ...state,
        tableColumns
      };
    },

    setTableFields(state, { payload: tableFields }) {
      return {
        ...state,
        tableFields
      };
    },

    setSelectedTableFields(state, { payload: selectedTableFields }) {
      return {
        ...state,
        selectedTableFields
      };
    },

    setTotalNum(state, { payload: totalNum }) {
      return {
        ...state,
        totalNum
      }
    },

    setQueryUserIdCardNumber(state, { payload: queryUserIdCardNumber }) {
      return {
        ...state,
        queryUserIdCardNumber
      }
    },
    setQueryUserIdCardNumberMessage(state, { payload: queryUserIdCardNumberMessage }) {
      return {
        ...state,
        queryUserIdCardNumberMessage
      }
    },
    setQueryUserIdCardNumberLoading(state, { payload: queryUserIdCardNumberLoading }) {
      return {
        ...state,
        queryUserIdCardNumberLoading
      }
    },
    setQueryUserIdCardNumberAction(state, { payload: queryUserIdCardNumberAction }) {
      return {
        ...state,
        queryUserIdCardNumberAction
      };
    },
    setQueryUserIdCardNumberActionId(state, { payload: queryUserIdCardNumberActionId }) {
      console.log(queryUserIdCardNumberActionId);
      return {
        ...state,
        queryUserIdCardNumberActionId
      }
    },
    clearQueryUserIdState(state) {
      return {
        ...state,
        queryUserIdCardNumber: '',
        queryUserIdCardNumberMessage: null,
        queryUserIdCardNumberAction: null,
        queryUserIdCardNumberActionId: null,
      }
    },
    toggleChangeColumnModal(state) {
      return {
        ...state,
        editingViewColumns: !state.editingViewColumns
      }
    },

    setSubLocations(state, { payload }) {
      const { subLocations } = payload;
      return { ...state, subLocations };
    },
  }
};
