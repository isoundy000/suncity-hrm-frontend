import {
  fetchTreeByType,
  fetchListByType,
  getDepartmentDetail,
  getPositionDetail,

  /* create data */
  createDataOf,
  createDataInTheTree,
  getId,

  /* update data */
  updateDataOf,
  updateDataInTheTree,
  updateDepartmentInPositionTree,

  /* update status */
  updateStatusTo,
  updateStatusInTheTree,

  /* delete data */
  deleteDataOf,
  deleteDataInTheTree,

  // complete post data
  completeDeptPostData,
  completePosiData,
  completeLocaPostData,

  fillInDataToTheTree,
  sortByTime,
  sortByStatus,
  sortTreeBy,
} from '../services/architectureSetting';


const LIST_TYPES = [
  'departments', 'positions', 'locations'
];

export default {
  namespace: 'architectureSetting',

  state: {
    loading: {
      departments: true,
      positions: true,
      locations: true,
    },

    lists: {
      departments: [],
      positions: [],
      locations: [],
    },

    completedTree: {
      departments: [],
      positions: [],
      locations: [],
    }
  },

  subscriptions: {
    listSubscriber({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/architecture') {
          for (const type of LIST_TYPES) {
            dispatch({type: 'fetchList', payload: { type }})
          }
        }
      });
    },
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const { type } = payload;
      yield put({ type: 'startLoading', payload: { type } });

      const tree = yield call(fetchTreeByType, type);

      const region = yield select(state => state.region);
      const list = yield call(fetchListByType, type, region);

      let treeData = tree.data.data;
      const listData = list.data.data;
      const listIds = listData.map(item => item.id);

      yield put({ type: 'saveList', payload: { listData, type } });

      if (type === 'departments') {
        for (let item of listData) {
          const json = yield call(getDepartmentDetail, item.id);
          const header_name = item.head_id ? item.head.chinese_name : '--';
          Object.assign(item, {
            header_name,
            location_ids: json.data.data.location_ids,
          });
        }
      } else if (type === 'positions') {
        for (let item of listData) {
          const json = yield call(getPositionDetail, item.id);
          const locationIds = json.data.data.location_ids;
          const departmentIds = json.data.data.department_ids;
          let deptNames = '--';

          if (departmentIds) {
            let deptNamesArray = [];
            for (let deptId of departmentIds) {
              let json = yield call(getDepartmentDetail, deptId);
              deptNamesArray = [...deptNamesArray, json.data.data.chinese_name];
            }
            deptNames = deptNamesArray.join(' / ');
          }
          Object.assign(item, {
            location_ids: locationIds,
            department_ids: departmentIds,
            department_names: deptNames,
          });
        }
      }


      treeData = treeData.filter(node => {
        return listIds.indexOf(node.id) >= 0 ? true : false;
      });

      console.log('tree', treeData);

      const dataTree = fillInDataToTheTree(listData, treeData, 0);
      const sortedDataTree = sortTreeBy('status', dataTree);

      yield put({ type: 'saveCompletedList', payload: { sortedDataTree, type } });
    },

    *createData({ payload }, { call, put, select }) {
      const { type, postData } = payload;
      const region = yield select(state => state.region);

      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const list = yield call(fetchListByType, type, region);
      const listData = list.data.data;
      const id = yield call(getId, listData);

      let completedPostData = Object.assign({}, postData, {
        region_key: region,
        status: 'enabled',
        parent_id: parseInt(postData.parent_id),
        id: id,
        key: `${id}`,
      });

      if (type === 'departments') {
        completedPostData = completeDeptPostData(completedPostData);
      }

      if (type === 'locations') {
        completedPostData = completeLocaPostData(completedPostData, region);
      }

      const { data } = yield call(createDataOf, type, completedPostData, token);

      if (data.state === 'success') {
        const list = yield call(fetchListByType, type, region);
        const listData = list.data.data;
        yield put({ type: 'saveList', payload: { listData, type } });

        if (type === 'positions') {
          const deptList = yield call(fetchListByType, 'departments', region);
          const deptListData = deptList.data.data;
          completedPostData = completePosiData(completedPostData, deptListData);
        }

        /* yield put({
           type: 'createDataSuccess',
           payload: { type, completedPostData },
           });
         */
        yield put({
          type: 'fetchList',
          payload: { type },
        });
      }
    },

    *updateData({ payload }, { call, put, select }) {
      const { type, patchData, id } = payload;
      console.log(patchData);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data } = yield call(updateDataOf, type, patchData, id, token);
      if (data.state === 'success') {
        let newPatchData = patchData;

        if (type === 'positions') {
          const region = yield select(state => state.region);
          const deptList = yield call(fetchListByType, 'departments', region);
          const deptListData = deptList.data.data;
          newPatchData = completePosiData(patchData, deptListData, id);
        }

        yield put({
          type: 'fetchList',
          payload: { type },
        });

        /* yield put({*/
        /* type: 'updateDataSuccess',*/
        /* payload: { type, newPatchData, id },*/
        /* });*/
      }
    },

    *deleteData({ payload }, { call, put }) {
      const { type, id } = payload;
      const { data } = yield call(deleteDataOf, type, id);
      if (data.state === 'success') {
        yield put({
          type: 'deleteDataSuccess',
          payload: { type, id },
        });
      }
    },

    *updateStatus({ payload }, { call, put, select }) {
      const { status, type, id } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data } = yield call(updateStatusTo, status, type, id, token);
      if (data.state === 'success') {
        yield put({
          type: 'updateStatusSuccess',
          payload: { status, type, id },
        });
      }
    }
  },

  reducers: {
    startLoading(state, { payload }) {
      const { type } = payload;
      return { ...state, loading: { ...state.loading, [type]: true } };
    },

    saveList(state, { payload }) {
      const { listData, type } = payload;
      return { ...state, lists: { ...state.lists, [type]: listData } };
    },

    saveCompletedList(state, { payload }) {
      const { sortedDataTree, type } = payload;
      return { ...state,
               loading: {
                 ...state.loading,
                 [type]: false
               },
               completedTree: {
                 ...state.completedTree,
                 [type]: sortedDataTree
               }};
    },

    createDataSuccess(state, { payload }) {
      const { type, completedPostData } = payload;
      const oldCompletedTree = state.completedTree[type];
      let newCompletedTree = createDataInTheTree(oldCompletedTree, completedPostData);

      newCompletedTree = sortTreeBy('status', newCompletedTree);

      return { ...state,
               completedTree: {
                 ...state.completedTree,
                 [type]: newCompletedTree
               }};
    },

    updateDataSuccess(state, { payload }) {
      const { type, newPatchData, id } = payload;

      console.log(newPatchData);

      const oldList = state.lists[type];
      const newList = oldList.map(node => {
        if (node.id === id) {
          return Object.assign({}, node, { ...newPatchData });
        }
        return node;
      });


      const oldCompletedTree = state.completedTree[type];
      let newCompletedTree = updateDataInTheTree(oldCompletedTree, newPatchData, id);
      newCompletedTree = sortTreeBy('status', newCompletedTree);

      const newState = { ...state,
                         lists: {
                           ...state.lists,
                           [type]: newList
                         },
                         completedTree: {
                           ...state.completedTree,
                           [type]: newCompletedTree
                         }};

      if (type === 'departments') {
        const oldPositionTree = state.completedTree['positions'];
        let newPositionTree = updateDepartmentInPositionTree(oldPositionTree, newPatchData, id);
        newPositionTree = sortTreeBy('status', newPositionTree);

        return { ...newState,
                 completedTree: {
                   ...state.completedTree,
                   [type]: newCompletedTree,
                   ['positions']: newPositionTree
                 }};
      }

      return newState;
    },

    deleteDataSuccess(state, { payload }) {
      const { type, id } = payload;
      if (type === 'locations') {
        const oldList = state.lists[type];
        const newList = oldList.filter(item => item.id !== id);
        const oldCompletedTree = state.completedTree[type];
        const newCompletedTree = deleteDataInTheTree(oldCompletedTree, id);
        return { ...state,
                 lists: {
                   ...state.lists,
                   [type]: newList
                 },
                 completedTree: {
                   ...state.completedTree,
                   [type]: newCompletedTree
                 }
        };
      }
      return { ...state };
    },

    updateStatusSuccess(state, { payload }) {
      const { status, type, id } = payload;
      const oldCompletedTree = state.completedTree[type];
      let newCompletedTree = updateStatusInTheTree(oldCompletedTree, status, id);
      newCompletedTree = sortTreeBy('status', newCompletedTree);

      return { ...state,
               completedTree: {
                 ...state.completedTree,
                 [type]: newCompletedTree
               }};
    }
  },
}
