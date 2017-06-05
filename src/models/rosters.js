import _ from 'lodash';

import {
  fetchRosters,
  createRoster,
  fetchAllDepartments,
  fetchAvailableDepartments,
} from '../services/rosters';

const PAGE_SIZE = 10;

const getNewLoading = (loading) => {
  console.log(loading);
  const originalAll = loading['all'];
  let newLoading = {};
  for (let key of Object.keys(loading)) {
    const rst = loading[key];
    if (loading[key] !== originalAll && loading[key] !== loading['all']) {
      newLoading = { ...newLoading, ['all']: rst, [key]: rst };
    } else {
      newLoading = { ...newLoading, [key]: rst };
    }
  }

  return newLoading;
};

export default {
  namespace: 'rosters',

  state: {
    loading: {
      all: true,
      rosters: true,
      departments: true
    },

    modalLoading: false,

    modalStatus: false,

    form: {
      newRosterDate: null,
      /* indeterminate: false, */
      /* checkBoxAll: false, */
      /* checkedList: [], */
      availableDepartments: [],

      freezeList: [
        { label: 'Apple', value: 'Apple' }
      ],
    },

    dateFilter: {
      defaultValue: null,
      value: null,
      prevDisabled: true,
      nextDisabled: false,
    },

    departmentFilterDisabled: false,
    departmentFilter: null,
    /* defaultDepartment: null, */

    rosterList: [],
    rostersCount: 0,
    allDepartments: [],

    currentPage: 1,
  },

  subscriptions: {
    rostersSubscriber({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/rosters') {
          dispatch({ type: 'preSetting', payload: null });
          dispatch({ type: 'startFetchRosters', payload: { departmentId: null, date: null, page: 1 }})
          dispatch({ type: 'startFetchAllDepartments', payload: null })
        }
      });
    }
  },

  effects: {
    *startFetchRosters({ payload }, { call, put, select }) {
      yield put({ type: 'loading', payload: { type: 'all', result: true }});

      const { departmentId, date, page } = payload;
      const currentUser = yield select(state => _.get(state, 'currentUser', null));
      const region = yield select(state => state.region);

      const tmpParams = Object.assign({}, {}, {
        region,
        page,
      });

      let trueDepartmentId = -1;

      if (currentUser.can['rosterList']) { // for diffferent roles
        trueDepartmentId = currentUser['department_id'];
        console.log(trueDepartmentId);
        yield put({
          type: 'disabledDepartmentSelect',
          payload: {
            departmentId: trueDepartmentId,
          },
        });
      } else {
        trueDepartmentId = departmentId ? departmentId : yield select(state => state.rosters.departmentFilter);
      }

      const trueDate = date ? date : yield select(state => state.rosters.dateFilter.value);

      console.log('trueDate', trueDate);

      const paramsWithDept = trueDepartmentId && trueDepartmentId !== 'all' ? Object.assign({}, tmpParams, { department_id: trueDepartmentId }) : tmpParams;

      // '0_0' means 'all'
      const params = trueDate && trueDate !== '0_0' ? Object.assign({}, paramsWithDept, {
        year: trueDate.split('_')[0],
        month: trueDate.split('_')[1],
      }) : paramsWithDept;

      const { data, err } = yield call(fetchRosters, { params });
      if ( !err ) {
        console.log('rosters', data);
        yield put({
          type: 'fetchRostersSuccess',
          payload: {
            rosters: data.data,
            meta: data.meta
          },
        });
      }
    },

    *startFetchAllDepartments({ payload }, { call, put, select }) {
      const region = yield select(state => state.region);
      const params = Object.assign({}, {}, {
        region,
      })

      const { data, err } = yield call(fetchAllDepartments, { params });
      if ( !err ) {
        console.log( data );
      }

      yield put({ type: 'fetchAllDepartmentsSuccess', payload: { region, allDepartments: data.data }});
    },

    *startFetchAvailableDepartments({ payload }, { call, put, select }) {
      yield put({ type: 'loadingAvailableDepartments', payload: { result: true }});
      const { date } = payload;

      const [year, month] = date.split('_');

      const region = yield select(state => state.region);
      const params = Object.assign({}, {}, {
        region,
        year,
        month,
      })

      const { data, err } = yield call(fetchAvailableDepartments, { params });

      if ( !err ) {
        console.log( data );
      }

      yield put({ type: 'fetchAvailableDepartmentsSuccess', payload: { date, availableDepartments: data.data }});
    },

    *startAddNewRosters({ payload }, { call, put, select }) {
      const { departments, date } = payload;
      const [ year, month ] = date.split('_');

      const region = yield select(state => state.region);

      const postData = Object.assign({}, {}, {
        region,
        year,
        month,
        department_ids: departments,
      });

      const { data, err } = yield call(createRoster, { postData });

      if (!err) {
        console.log('newRosters ?', data);
        yield put({ type: 'startFetchRosters', payload: { page: 1 }});
        /* yield put({ */
        /* type: 'addNewRostersSuccess', */
        /* payload: { newRosters: []}, */
        /* }) */
      }
    },
  },

  reducers: {
    loading(state, { payload }) {
      const { type, result } = payload;
      const loading = state.loading;
      const tmpLoading = type === 'all' ?
                         {
                           all: result,
                           rosters: result,
                           departments: result,
                         } :
                         Object.assign({}, loading, {
                           [type]: result,
                         });

      console.log(tmpLoading);
      const newLoading = getNewLoading(tmpLoading);

      return { ...state, loading: newLoading };
    },

    loadingAvailableDepartments(state, { payload }) {
      const { result } = payload;
      return { ...state, modalLoading: result };
    },

    toggleModal(state, { payload }) {
      const { status } = payload;
      return { ...state, modalStatus: status };
    },

    fetchRostersSuccess(state, { payload }) {
      const { rosters, meta } = payload;

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['rosters']: false };
      const newLoading = getNewLoading(tmpLoading);

      return { ...state,
               rosterList: rosters,
               rostersCount: meta.total_count,
               loading: newLoading,
      };
    },

    fetchAllDepartmentsSuccess(state, { payload }) {
      const { region, allDepartments } = payload;

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['departments']: false };
      const newLoading = getNewLoading(tmpLoading);

      return { ...state, allDepartments, loading: newLoading };
    },

    fetchAvailableDepartmentsSuccess(state, { payload }) {
      const { date, availableDepartments } = payload;
      return { ...state,
               form: { ...state.form,
                       availableDepartments,
                       newRosterDate: date,
               },
               modalLoading: false,
      };
    },

    currentDepartmentChange(state, { payload }) {
      const { departmentId } = payload;
      return { ...state,
               departmentFilter: departmentId,
               currentPage: 1,
      };
    },

    filterDateChange(state, { payload }) {
      const { newDate } = payload;
      return { ...state,
               dateFilter: { ...state.dateFilter,
                             value: newDate,
               },
               currentPage: 1,
      };
    },

    disabledButton(state, { payload }) {
      const { prev, next } = payload;
      return { ...state,
               dateFilter: { ...state.dateFilter,
                             prevDisabled: prev,
                             nextDisabled: next,
               },
      };
    },

    disabledDepartmentSelect(state, { payload }) {
      const { departmentId } = payload;
      return { ...state,
               departmentFilterDisabled: true,
               departmentFilter: departmentId,
      };
    },

    /* filterPrevOrNextDate(state, { payload }) {
       const { newDate } = payload;

       return { ...state,
       dateFilter: { ...state.dateFilter,
       value: newDate,
       },
       };
       },
     */
    filterRostersByDate(state, { payload }) {
      const { newDate } = payload;

      const departmentFilter = state.departmentFilter;
      const rosterList = state.rosterList;
      const filterRosterList = rosterList.filter(roster => roster.date === newDate);

      return { ...state, rosterList: filterRosterList };
    },

    filterRostersByDepartment(state, { payload }) {
      const { department } = payload;

      const departmentFilter = state.departmentFilter;
      const dateFilter = state.dateFilter.value;
      const rosterList = state.rosterList;
      const filterRosterList = rosterList.filter(roster => roster.department === department);

      return { ...state, rosterList: filterRosterList, departmentFilter: department };
    },

    changeNewRosterTime(state, { payload }) {
      const { date } = payload;
      return { ...state, form: { ...state.form, newRosterDate: date } };
    },

    setDateToNull(state, { payload }) {
      return { ...state, form: { ...state.form, newRosterDate: null } };
    },

    addNewRostersSuccess(state, { payload }) {
      const { newRosters } = payload;
      const departmentFilter = state.departmentFilter;
      const dateFilter = state.dateFilter.value;

      const filteredData = tmpData.filter(roster => (roster.department === departmentFilter &&
                                                     roster.date === dateFilter));

      return { ...state, rosterList: [ ...state.rosterList, filteredData ] };
    },

    /* checkAllDepartment(state, { payload }) {
       const { checkResult } = payload;
       const optionsList = state.form.optionsList;

       return { ...state,
       form: { ...state.form,
       indeterminate: false,
       checkBoxAll: checkResult,
       checkedList: checkResult ? optionsList : [],
       } };
       },

       checkDepartment(state, { payload }) {
       const { checkList } = payload;
       const optionsList = state.form.optionsList;
       return { ...state,
       form: { ...state.form,
       indeterminate: !!checkList.length && (checkList.length < optionsList.length),
       checkBoxAll: checkList.length === optionsList.length,
       checkedList: checkList,
       } };
       },
     */

    pageChange(state, { payload }) {
      const { page } = payload;
      return { ...state, currentPage: page };
    },

    hasError(state, { payload }) {
      const { error } = payload;
      return { ...state, error };
    },
  },
}
