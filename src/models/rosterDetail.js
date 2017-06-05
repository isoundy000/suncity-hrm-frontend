import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import {
  fetchRoster,
  fetchRosterTable,
  fetchDepartmentRosters,
  fetchDepartment,
  fetchPositions,
  fetchShifts,
  updateItems,
} from '../services/rosterDetail';

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
  namespace: 'rosterDetail',

  state: {
    loading: {
      all: false,
      department: false,
      departmentROsters: false,
      table: false,
      positions: false,
      shifts: false,
    },

    editable: false,

    dateFilter: {
      defaultValue: null,
      value: null,
      prevDisabled: false,
      nextDisabled: false,
    },

    originalDetailData: [], //for clearAllModify in editable mode

    detailData: [],

    departmentRosters: [],

    basicInfo: {},
    department: {},

    positions: [],
    shifts: [],

    columnFields: [],

    employeeCount: 0,
    rostersCount: 0,
    holidayCount: 0,

    dataTable: {
      filteredInfo: {},
      sortedInfo: {},

      searchText: {
        empoid: '',
        name: '',
      },

      filterDropdownVisible: {
        empoid: false,
        name: false,
      },

      filtersForPosition: [],
    },

    // editable

    modifyCount: 0,

    modalVisible: {
      saveModifyModal: false,
      clearAllModifyModal: false,
      quitEditModeModal: false,
    },

    totalPages: 1,
    currentPage: 1,
    loadedPages: [],

    initialState: null,
  },

  subscriptions: {
    rosterDetailSubscriber({ dispatch, history }) {
      return history.listen(location => {
        const match = pathToRegexp('/rosters/:id+').exec(location.pathname);
        const matchEdit = pathToRegexp('/rosters/:id/edit').exec(location.pathname);

        console.log(match);

        if (match) {

          dispatch({ type: 'saveInitialState', payload: null });
          dispatch({ type: 'resetState', payload: null });
          dispatch({ type: 'startFetchRoster', payload: { id: match[1].split('/')[0] }})

          if (matchEdit) {
            console.log('Hello roster Edit');
            dispatch({ type: 'toggleEditable', payload: { result: true }});
          }
        }
      });
    }
  },

  effects: {

    *startFetchRoster({ payload }, { call, put, select }) {

      yield put({ type: 'loading', payload: { type: 'all', result: true }});
      const { id } = payload;

      const region = yield select(state => state.region);
      const params = Object.assign({}, {}, { region });

      const { data, err } = yield call(fetchRoster, { id, params });
      if (!err) {
        const roster = data.data;
        yield put({ type: 'fetchRosterSuccess', payload: { roster }});
        yield put( { type: 'startFetchDepartment', payload: { departmentId: roster['department_id'] }})
        yield put( { type: 'startFetchDepartmentRosters', payload: { departmentId: roster['department_id'], rosterId: roster.id }})
        console.log('roster', roster);
        if (roster.state === 'rostered') {
          yield put({ type: 'startFetchRosterTable', payload: { rosterId: roster.id, page: 1 }});
          yield put({ type: 'startFetchPositions', payload: null });
          yield put({ type: 'startFetchShifts', payload: { rosterId: roster.id } });
        } else {
          yield put({ type: 'loading', payload: { type: 'table', result: false }});
          yield put({ type: 'loading', payload: { type: 'positions', result: false }});
          yield put({ type: 'loading', payload: { type: 'shifts', result: false }});
        }
      }
      const token = yield select(state => _.get(state, 'currentUser.token', null));
    },

    *startFetchRosterTable({ payload }, { call, put, select }) {
      const { rosterId, page } = payload;


      const loadedPages = yield select(state => state.rosterDetail.loadedPages);
      console.log('loadedPages', loadedPages);

      const isLoaded = loadedPages.findIndex(loadedPage => loadedPage === page);
      if (isLoaded < 0) { // not loaded
        console.log('should load !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const region = yield select(state => state.region);
        const params = Object.assign({}, {}, { region, page });

        const { data, err } = yield call(fetchRosterTable, { rosterId, params });

        if (!err) {
          console.log('rosterTable', data);
          yield put({ type: 'fetchRosterTableSuccess', payload: { page, rosterItem: data.data, meta: data.meta }});
        }
      }
    },

    *startFetchPositions({ payload }, { call, put, select }) {
      const region = yield select(state => state.region);
      const params = Object.assign({}, {}, { region });

      const { data, err } = yield call(fetchPositions, { params });

      if (!err) {
        console.log(data.data);
        yield put({ type: 'fetchPositionsSuccess', payload: { positions: data.data }});
      }
    },

    *startFetchShifts({ payload }, { call, put, select }) {
      const { rosterId } = payload;
      const region = yield select(state => state.region);
      const params = Object.assign({}, {}, { region });

      const { data, err } = yield call(fetchShifts, { rosterId, params });

      if (!err) {
        console.log(data.data);
        yield put({ type: 'fetchShiftsSuccess', payload: { shifts: data.data }});
      }
    },

    *startFetchDepartment({ payload }, { call, put, select }) {
      const { departmentId } = payload;

      const { data, err } = yield call(fetchDepartment, { departmentId });

      if (!err) {
        console.log(data.data);
        yield put({ type: 'fetchDepartmentSuccess', payload: { department: data.data }});
      }
    },

    *startFetchDepartmentRosters({ payload }, { call, put, select }) {
      const { departmentId, rosterId } = payload;

      const { data, err } = yield call(fetchDepartmentRosters, { departmentId });

      if (!err) {
        console.log(data.data);
        yield put({ type: 'fetchDepartmentRostersSuccess', payload: { departmentRosters: data.data, rosterId }});
      }
    },

    *filterDateChange({ payload }, { call, put, select }) {
      const { newDate } = payload;
      console.log( newDate );

      const departmentRosters = yield select(state => state.rosterDetail.departmentRosters);
      const [ year, month ] = newDate.split('_');
      const newRoster = departmentRosters.filter(roster => (
        roster.year === year && roster.month === month
      ))[0];

      yield put(routerRedux.push(`/rosters/${newRoster.id}`));
    },

    *startSaveModify({ payload }, { call, put, select }) {
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));


      if ( true ) {
        yield put({
          type: 'toggleModal',
          payload: {
            result: true,
            type: 'saveModifyModal',
          }});
      }
    },

    *sureToSaveModify({ payload }, { call, put, select }) {
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const basicInfo = yield select(state => state.rosterDetail.basicInfo);
      const detailData = yield select(state => state.rosterDetail.detailData);

      const needUpdate = detailData.filter(row => row.changeColumns && row.changeColumns.length > 0);

      const tmpItems = needUpdate.map(row => {
        const columns = row.changeColumns;
        return columns.map(itemTitle => {
          const item = row[itemTitle];
          return Object.assign({}, {}, {
            id: item.id,
            shift_id: parseInt(item['shift_id']),
            leave_type: item['leave_type'],
          });
        });
      });

      const items = tmpItems.reduce((result, item) => {
        return [ ...result, ...item ];
      }, []);

      const params = Object.assign({}, {}, {
        items,
      });

      console.log('sureToSaveModify', detailData, needUpdate, tmpItems, items, params);

      const { data, err } = yield call(updateItems, { rosterId: basicInfo.id, postData: params })

      if ( true ) {
        yield put({
          type: 'saveModifySuccess',
          payload: null,
        });
      }
    },

    *startQuitEditMode({ payload }, { call, put, select }) {
      const { rosterId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const modifyCount = yield select(state => state.rosterDetail.modifyCount);

      if (modifyCount > 0) {
        yield put({
          type: 'toggleModal',
          payload: {
            result: true,
            type: 'quitEditModeModal',
          }});
      } else {
        yield put(routerRedux.push(`/rosters/${rosterId}`));

        yield put({
          type: 'toggleEditable',
          payload: {
            result: false,
          }});
      }
    },

    *forceQuitEditMode({ payload }, { call, put, select }) {
      const { rosterId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      yield put({
        type: 'forceQuitEditModeSuccess',
        payload: null,
      });

      yield put(routerRedux.push(`/rosters/${rosterId}`));
    },
  },

  reducers: {
    loading(state, { payload }) {
      const { type, result } = payload;
      const loading = state.loading;
      const tmpLoading = type === 'all' ?
                         {
                           all: result,
                           department: result,
                           departmentRosters: result,
                           table: result,
                           positions: result,
                           shifts: result,
                         } :
                         Object.assign({}, loading, {
                           [type]: result,
                         });

      console.log(tmpLoading);
      const newLoading = getNewLoading(tmpLoading);

      return { ...state, loading: newLoading };
    },

    toggleModal(state, { payload }) {
      const { type, result } = payload;
      return { ...state, modalVisible: { ...state.modalVisible, [type]: result } };
    },

    fetchRosterSuccess(state, { payload }) {
      const { roster } = payload;
      const { year, month } = roster;

      return { ...state,
               basicInfo: roster,
               dateFilter: { ...state.dateFilter, value: `${year}_${month}` }
      };
    },

    fetchRosterTableSuccess(state, { payload }) {
      const { page, rosterItem, meta } = payload;
      console.log('hello items', rosterItem);
      const positions = state.positions;
      const rosterItems = rosterItem.items;

      const oldDetailData = state.detailData;
      const oldOriginalDetailData = state.originalDetailData;

      let columnFields = state.columnFields;

      if (columnFields.length === 0) {
        const tmpUser = rosterItem.users[0];
        const tmpItem = rosterItems.filter(item => item['user_id'] === tmpUser.id)
                                   .sort((a, b) => ( a.id - b.id));
        console.log('tmpItem', tmpItem);

        columnFields = tmpItem.map(item => {
          const date = item.date.split('-').join('/');
          return Object.assign({}, {}, {
            dataIndex: date,
            key: date,
          });
        });
      }


      console.log('columnFields', columnFields);

      const detailData = rosterItem.users.map(row => {
        const position = positions.filter(p => p.id === row.position_id)[0];
        return Object.assign({}, row, {
          page,
          position: position ? position['chinese_name'] : '',
        });
      });

      const detailDataWithItems = detailData.map(user => {
        return columnFields.reduce((result, row) => {
          const date = row.dataIndex;
          const item = rosterItems.filter(item => (item['user_id'] === user.id &&
                                                   item.date === date.split('/').join('-')))[0];
          result[date] = item;
          return result;
        }, user);
      });

      console.log('**********', detailDataWithItems);

      const newDetailData = [ ...oldDetailData, ...detailDataWithItems ];
      const newOriginalDetailData = [ ...oldOriginalDetailData, ...detailDataWithItems ];

      const filtersForPosition = rosterItem.users.map(user => {
        const position = positions.filter(p => p.id === user['position_id'])[0];
        return Object.assign({}, {}, {
          id: position ? position.id : -1,
          text: position ? position['chinese_name'] : '',
          value: position ? position['chinese_name'] : '',
        });
      }).reduce((result, position) => {
        return result.findIndex(p => p.id === position.id) < 0 ? [ ...result, position ] : result;
      }, []);

      const newLoadedPages = [ ...state.loadedPages, page ];

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['table']: false };
      const newLoading = getNewLoading(tmpLoading);


      return { ...state,
               columnFields,
               detailData: newDetailData,
               originalDetailData: newOriginalDetailData,
               dataTable: { ...state.dataTable,
                            filtersForPosition
               },
               totalPages: meta.total_pages,
               currentPage: page,
               loadedPages: newLoadedPages,
               loading: newLoading,
      };
    },

    fetchPositionsSuccess(state, { payload }) {
      const { positions } = payload;

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['positions']: false };
      const newLoading = getNewLoading(tmpLoading);

      return { ...state, positions, loading: newLoading };
    },

    fetchShiftsSuccess(state, { payload }) {
      const { shifts } = payload;

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['shifts']: false };
      const newLoading = getNewLoading(tmpLoading);

      return { ...state, shifts, loading: newLoading };
    },

    fetchDepartmentSuccess(state, { payload }) {
      const { department } = payload;
      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['department']: false };
      const newLoading = getNewLoading(tmpLoading);
      return { ...state, department, loading: newLoading };
    },

    fetchDepartmentRostersSuccess(state, { payload }) {
      const { departmentRosters, rosterId } = payload;

      const sortedDepartmentRosters = departmentRosters.sort((item1, item2) => (
        parseInt(`${item1.year}${item1.month}`) - parseInt(`${item2.year}${item2.month}`)
      ));

      const index = sortedDepartmentRosters.findIndex(rr => rr.id === rosterId);
      const prev = index === 0 ? true : false;
      const next = index === sortedDepartmentRosters.length - 1 ? true : false;

      const oldLoading = state.loading;
      const tmpLoading = { ...oldLoading, ['departmentRosters']: false };
      const newLoading = getNewLoading(tmpLoading);

      return { ...state,
               departmentRosters,
               dateFilter: { ...state.dateFilter,
                             prevDisabled: prev,
                             nextDisabled: next,
               },
               loading: newLoading,
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


    /* filterDateChange(state, { payload }) {
       const { newDate } = payload;
       const departmentRosters = state.departmentRosters;
       const [ year, month ] = newDate.split('_');
       const newRoster = departmentRosters.filter(roster => (
       roster.year === year && roster.month === month
       ))[0];

       return { ...state,
       basicInfo: newRoster,
       dateFilter: { ...state.dateFilter,
       value: newDate,
       },
       };
       },
     */
    clearAllFiltersAndSorters(state, { payload }) {
      return { ...state,
               detailData: state.originalDetailData,
               dataTable: {
                 ...state.dataTable,
                 filteredInfo: {},
                 sortedInfo: {},

                 searchText: {
                   empoid: '',
                   name: '',
                 },

                 filterDropdownVisible: {
                   empoid: false,
                   name: false,
                 },
               }};
    },

    tableChange(state, { payload }) {
      const { filteredInfo, sortedInfo } = payload;
      return { ...state, dataTable: {
        ...state.dataTable,
        filteredInfo,
        sortedInfo,
      }};
    },

    filterDropdownVisibleChange(state, { payload }) {
      const { type, visible } = payload;
      console.log('why not here', visible);
      return { ...state, dataTable: {
        ...state.dataTable,
        filterDropdownVisible: { ...state.dataTable.filterDropdownVisible, [type]: visible },
      }};
    },

    searchTextChange(state, { payload }) {
      const { type, searchText } = payload;
      return { ...state, dataTable: {
        ...state.dataTable,
        searchText: { ...state.dataTable.searchText, [type]: searchText },
      }};
    },

    search(state, { payload }) { // maybe TODO
      const { type } = payload;
      const searchText = state.dataTable.searchText[type];
      const oldDetailData = state.originalDetailData;

      const reg = new RegExp(searchText, 'gi');
      /* const searchDetailData = oldDetailData.filter(record => ()); */

      console.log(searchText, oldDetailData);
      const newDetailData = oldDetailData.map(record => {
        const realType = type === 'empoid' ? 'empoid' : 'chinese_name';
        const match = record[realType].match(reg);

        if (!match) {
          return null;
        }
        return record;
      }).filter(record => !!record);

      return { ...state, detailData: newDetailData };
    },

    toggleEditable(state, { payload }) {
      const { result } = payload;

      const detailData = state.detailData;
      const completedDetailData = detailData.map(item => (
        Object.assign({}, item, {
          changeColumns: [],
        })
      ));

      /* const originalDetailData = result ? state.detailData : null; */
      const originalDetailData = state.detailData;
      return { ...state,
               originalDetailData,
               editable: result,
               detailData: completedDetailData,
      };
    },

    itemChange(state, { payload }) {
      const { value, valueType, record, index, columnTitle, dataIndex } = payload;
      console.log('itemChange', value, record, index, columnTitle, dataIndex);

      const oldDetailData = state.detailData;
      const originalDetailData = state.originalDetailData;

      const originalRecord = originalDetailData.filter(item => item.id === record.id)[0]
      const oldRecord = oldDetailData.filter(item => item.id === record.id)[0]

      const isChange = (valueType === 'shift' && originalRecord[columnTitle]['shift_id'] !== parseInt(value)) ||
                       (valueType === 'leaveType' && originalRecord[columnTitle]['leave_type'] !== value) ?
                       true : false;

      /* const shouldAddOne = (isChange === true) && ((valueType === 'shift' && oldRecord[columnTitle]['shift_id'] === originalRecord[columnTitle]['shift_id']) ||
         (valueType === 'leaveType' && oldRecord[columnTitle]['leave_type'] === originalRecord[columnTitle]['leave_type']));

         const shouldMinusOne = (isChange === false) && ((valueType === 'shift' && oldRecord[columnTitle]['shift_id'] !== originalRecord[columnTitle]['shift_id']) ||
         (valueType === 'leaveType' && oldRecord[columnTitle]['leave_type'] !== originalRecord[columnTitle]['leave_type']));
       */

      const shouldAddOne = isChange && !oldRecord[columnTitle]['isModify'];
      const shouldMinusOne = isChange === false && oldRecord[columnTitle]['isModify'] === true;

      const oldModifyCount = state.modifyCount;

      let newModifyCount = 0;

      if (shouldAddOne) {
        newModifyCount = oldModifyCount + 1;
      } else if (shouldMinusOne) {
        newModifyCount = oldModifyCount - 1;
      } else {
        newModifyCount = oldModifyCount;
      }

      // index is work in multiPage ? todo : nothing

      const newDetailData = oldDetailData.map(item => {
        if (item.id === record.id) {
          // dataIndex TODO

          const changeColumns = record.changeColumns || [];
          const newChangeColumns = isChange === true ?
                                   [ ...changeColumns, columnTitle]:
                                   changeColumns.filter(column => column !== columnTitle);
          const newColumnItem = valueType === 'shift' ?
                                Object.assign({}, item[columnTitle], {
                                  shift_id: parseInt(value),
                                  leave_type: null,
                                  isModify: isChange ? true : false,
                                }) :
                                Object.assign({}, item[columnTitle], {
                                  shift_id: null,
                                  leave_type: value,
                                  isModify: isChange ? true : false,
                                });

          return Object.assign({}, item, {
            [columnTitle]: newColumnItem,
            changeColumns: newChangeColumns,
          });
        }
        return item;
      });

      return { ...state, detailData: newDetailData, modifyCount: newModifyCount };
    },

    saveModifySuccess(state, { payload }) {
      const detailData = state.detailData;
      const completedDetailData = detailData.map(item => (
        Object.assign({}, item, {
          changeColumns: [],
        })
      ));

      console.log('come on', completedDetailData);

      return { ...state, detailData: completedDetailData, modifyCount: 0 };
    },

    clearAllModify(state, { payload }) {
      const originalDetailData = state.originalDetailData;
      console.log(originalDetailData);
      return { ...state, detailData: originalDetailData, modifyCount: 0 };
    },

    forceQuitEditModeSuccess(state, { payload }) {
      const originalDetailData = state.originalDetailData;
      return { ...state,
               detailData: originalDetailData,
               editable: false,
               modifyCount: 0,
      };
    },

    saveInitialState(state, { payload }) {
      const initialState = state.initialState === null ? state : state.initialState;
      return { ...state, initialState };
    },

    resetState(state, { payload }) {
      return { ...state.initialState, initialState: state.initialState };
    },
  },
}
