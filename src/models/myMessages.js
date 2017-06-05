import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import {
  fetchAllMessagesByType,
  fetchUnreadMessagesByType,
  fetchCountByType,
  readMessage,
  readAllMessages,
} from '../services/myMessages';


const MESSAGE_TYPES = [
  'task', 'notification',
];

const PER_PAGE = 20;

export default {

  namespace: 'myMessages',

  state: {
    loading: {
      task: true,
      notification: true,
    },

    count: {
      task: 0,
      notification: 0,
    },

    lists: {
      task: {},
      notification: {},
    },

    msgBoxLists: {
      task: [],
      notification: [],
    },

    pagination: {
      task: {
        total: 0,
        current: 1,
      },
      notification: {
        total: 0,
        current: 1,
      },
    },

    markContent: 'notification',
    totalUnreadCount: 0,
    popoverVisible: false,
    activeKey: 1,
  },

  subscriptions: {
    /* listSubscriber({ dispatch, history }) {
       return history.listen(location => {
       if (location.pathname === '/messages') {
       for (const type of MESSAGE_TYPES) {
       dispatch({ type: 'fetchCompletedList', payload: { type } });
       }
       }
       });
       },
     */

    msgBoxSubscriber({ dispatch, history }) {
      function realTimeFetch() {
        for (const type of MESSAGE_TYPES) {
          /* dispatch({ type: 'fetchUnreadList', payload: { type } }); */
          dispatch({ type: 'startFetchCountByType', payload: { type, auto: false } });
          dispatch({ type: 'startFetchCurrentPageList', payload: { type, currentPage: 1, auto: false } });
        }
      }

      let intervalId = -1;
      let firstTime = true;

      return history.listen((location) => {
        const { pathname } = location;
        const match = pathToRegexp('/*').exec(pathname);

        if (match && match[1] === 'login') {
          firstTime = true;

          for (const type of MESSAGE_TYPES) {
            dispatch({ type: 'emptyList', payload: { type } });
          }
        }

        if (match && match[1] !== 'login') {
          if (firstTime) {
            realTimeFetch();
            firstTime = false;
          }

          if (match[1] === 'messages') {
            const activeKey = location.query.tab;
            if (activeKey === 'tasks') {
              console.log(location);
              dispatch({ type: 'selectActiveKey', payload: { key: '2' }});
            } else {
              dispatch({ type: 'selectActiveKey', payload: { key: '1' }});
            }
            realTimeFetch();
          }

          /* fetch unread messages per minute */
          intervalId = setInterval(realTimeFetch, 6000000000);
        } else if ((!match && intervalId !== -1) || match[1] === 'login') {
          clearInterval(intervalId);
          intervalId = -1;
        }
      });
    },
  },

  effects: {

    *startFetchCountByType({ payload }, { call, put, select }) {
      const { type } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      if (token) {
        const { data, err } = yield call(fetchCountByType, {
          type,
          token,
        });

        if (err) {
          console.log(err);
        }

        if (data) {
          const count = data.data;
          yield put({ type: 'saveCount', payload: { count, type } });
        }
      }
    },

    *startFetchCurrentPageList({ payload }, { call, put, select }) {
      const { type, currentPage, auto } = payload;

      const lists = yield select(state => _.get(state, 'myMessages.lists', null));
      const oldList = lists[type];

      if ( auto || oldList[currentPage] === undefined) {
        const token = yield select(state => _.get(state, 'currentUser.token', null));

        if (token) {
          const region = yield select(state => state.region);

          yield put({ type: 'startLoading', payload: { type } });
          /* yield put({ type: 'emptyList', payload: { type } }); */


          const { data, err } = yield call(fetchAllMessagesByType, {
            type,
            page: currentPage,
            perPage: PER_PAGE,
            token,
          });

          if ( data ) {
            const total = data.meta.total;
            const msgList = data.data;
            yield put({ type: 'setTotal', payload: { type, total } });

            yield put({ type: 'saveCompletedList', payload: { msgList, currentPage, type } });
          }
        }
      } else {
        yield put({ type: 'doNothing', payload: null });
      }
    },

    *startRealTimeUpdate({ payload }, { call, put, select }) {
      const { type } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const oldList = yield select(state => state.myMessages.lists[type]);
      const pages = Object.keys(oldList);
      console.log(pages);
      let newList = {};

      for (const page of pages) {
        const { data, err } = yield call(fetchAllMessagesByType, {
          type,
          page,
          perPage: PER_PAGE,
          token,
        });
        if (data) {
          newList[page] = data.data;
        }
      }

      yield put({ type: 'realTimeUpdateSuccess', payload: { type, newList } });

      /* if (data) {*/
      /* const newMessages = data.data;*/
      /* yield put({ type: 'realTimeUpdateSuccess', payload: { type, newMessages } });*/
      /* }*/
    },

    *markRead({ payload }, { call, put, select }) {
      const { type, id, currentPage } = payload;
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const mList = yield select(state => state.myMessages.lists[type]);
      const msg = mList[currentPage].find(m => m.id === id);


      if (msg.read_status === 'unread') {

        const { data, err } = yield call(readMessage, {
          id,
          token,
        });

        if (err) {
          console.log(err);
        }

        if (data) {
          yield put({ type: 'markReadSuccess', payload: { type, id, currentPage } });
        }
      }
    },

    *markAllRead({ payload }, { call, put, select }) {
      const { type } = payload;
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(readAllMessages, {
        type,
        token,
      });

      if (data) {
        yield put({ type: 'markAllReadByTypeSuccess', payload: { type } });
      }
    },
  },

  reducers: {
    startLoading(state, { payload }) {
      const { type } = payload;
      return { ...state, loading: { ...state.loading, [type]: true } };
    },

    emptyList(state, { payload }) {
      const { type } = payload;
      return { ...state,
               count: { ...state.count, [type]: 0 },
               lists: { ...state.lists, [type]: [] },
               msgBoxLists: { ...state.msgBoxLists, [type]: []},
               totalUnreadCount: 0,
      };
    },

    setTotal(state, { payload }) {
      const { type, total } = payload;
      const oldPagination = state.pagination;
      const newPagination = { ...oldPagination, [type]: { ...oldPagination[type], total}}
      return { ...state, pagination: newPagination }
    },

    saveCompletedList(state, { payload }) {
      const { msgList, currentPage, type } = payload;

      const oldList = state.lists[type];
      const currentPageObj = [msgList].reduce((result, list) => {
        result[currentPage] = list;
        return result;
      }, {})

      const newList = { ...oldList, ...currentPageObj};
      console.log('newList', newList);

      const newMsgBoxList = [...newList['1'].slice(0, 10)];
      return { ...state,
               loading: { ...state.loading, [type]: false },
               lists: { ...state.lists, [type]: newList },
               msgBoxLists: { ...state.msgBoxLists, [type]: newMsgBoxList },
      };
    },

    saveCount(state, { payload }) {
      const { count, type } = payload;
      let newTotalUnreadCount = 0;
      for (const tmpType of MESSAGE_TYPES) {
        if (tmpType === type) {
          newTotalUnreadCount += count;
        } else {
          newTotalUnreadCount += state.count[tmpType];
        }
      }
      return { ...state,
               count: { ...state.count, [type]: count },
               totalUnreadCount: newTotalUnreadCount,
      };
    },

    realTimeUpdateSuccess(state, { payload }) {
      const { type, newList } = payload;

      const newCount = state.count[type] + 1;
      const newTotalUnreadCount = state.totalUnreadCount + 1;
      const newMsgBoxList = [...newList[1].slice(0, 10)];

      return { ...state,
               lists: { ...state.lists, [type]: newList },
               count: { ...state.count, [type]: newCount },
               msgBoxLists: { ...state.msgBoxLists, [type]: newMsgBoxList },
               totalUnreadCount: newTotalUnreadCount,
      };
    },

    /* realTimeUpdateSuccess(state, { payload }) {
     *   const { type, newMessage } = payload;
     *   const oldList = state.lists[type];
     *   const newCount = state.count[type] + 1;
     *   const newTotalUnreadCount = state.totalUnreadCount + 1;

     *   const pageKeys = Object.keys(oldList);
     *   console.log('------', oldList, pageKeys);

     *   const oldCompletedList = pageKeys.reduce((resultArray, currentPage) => {
     *     resultArray = [...resultArray, ...oldList[currentPage]];
     *     return resultArray;
     *   }, []);

     *   console.log('------', oldCompletedList);

     *   const newCompletedList = [newMessage[0], ...oldCompletedList].slice(0, oldCompletedList.length);

     *   const newList = pageKeys.reduce((result, currentPage) => {
     *     const idx = parseInt(currentPage);
     *     const start = (idx - 1) * PER_PAGE;
     *     const end = start + PER_PAGE;
     *     result[currentPage] = newCompletedList.slice(start, end);
     *     return result;
     *   }, {});

     *   const newMsgBoxList = [...newList[1].slice(0, 10)];
     *   return { ...state,
     *            lists: { ...state.lists, [type]: newList },
     *            count: { ...state.count, [type]: newCount },
     *            msgBoxLists: { ...state.msgBoxLists, [type]: newMsgBoxList },
     *            totalUnreadCount: newTotalUnreadCount,
     *   };
     * },
     */

    markReadSuccess(state, { payload }) {
      const { type, id, currentPage } = payload;

      const newCount = state.count[type] - 1;
      const oldList = state.lists[type];
      const oldTotalUnreadCount = state.totalUnreadCount;
      const newTotalUnreadCount = oldTotalUnreadCount - 1;

      const oldCurrentPageList = oldList[currentPage];

      const newCurrentPageList = oldCurrentPageList.map(msg => {
        if (msg.id === id) {
          return Object.assign({}, msg, {
            read_status: 'read',
          });
        }
        return msg;
      });

      const newList = { ...oldList, [currentPage]: newCurrentPageList };

      const newMsgBoxList = [...newList[1].slice(0, 10)];

      return { ...state,
               count: { ...state.count, [type]: newCount },
               lists: { ...state.lists, [type]: newList },
               msgBoxLists: { ...state.msgBoxLists, [type]: newMsgBoxList },
               totalUnreadCount: newTotalUnreadCount,
      };
    },

    markAllReadByTypeSuccess(state, { payload }) {
      const { type } = payload;
      const oldList = state.lists[type];

      const newList = Object.keys(oldList).reduce((result, page) => {

        result[page] = oldList[page].map(msg => {
          return Object.assign({}, msg, {
            read_status: 'read',
          });
        })

        return result;
      }, {});

      const oldTotalUnreadCount = state.totalUnreadCount;
      const newTotalUnreadCount = oldTotalUnreadCount - state.count[type];

      const newMsgBoxList = [...newList[1].slice(0, 10)];

      return { ...state,
               count: { ...state.count, [type]: 0 },
               lists: { ...state.lists, [type]: newList },
               msgBoxLists: { ...state.msgBoxLists, [type]: newMsgBoxList },
               totalUnreadCount: newTotalUnreadCount,
      };
    },

    changeMarkContent(state, { payload }) {
      const { content } = payload;
      return { ...state, markContent: content };
    },

    handlePopoverVisible(state, { payload }) {
      const { visible } = payload;
      return { ...state, popoverVisible: visible };
    },

    hidePopover(state, { payload }) {
      const { status } = payload;
      return { ...state, popoverVisible: status };
    },

    toggleActiveKey(state, { payload }) {
      const oldActiveKey = state.activeKey;
      const newActiveKey = oldActiveKey === '1' ? '2' : '1';
      return { ...state, activeKey: newActiveKey };
    },

    selectActiveKey(state, { payload }) {
      const { key } = payload;
      return { ...state, activeKey: key };
    },

    doNothing(state, { payload }) {
      console.log('doNothing');
      return { ...state };
    },
  },
}
