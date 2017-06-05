import _ from 'lodash';

import {
  fetchListByType,
  fetchInterviewers,
  fetchInterviewsById,
  fetchRelated,

  startFetchApplicantPositionDetail,

  updateOneInterview,
  updateStatusById,
  startUpdateAudienceStatusById,
  startUpdateInterviewerStatusById,

  startFetchEmailTemplates,
  startSendEmail,

  updateSchedule,
} from '../services/myRecruit';

const LIST_TYPES = [
  'audiences', 'interviewers',
];

export default {
  namespace: 'myRecruit',

  state: {
    modalVisible: {
      agreeInterviewModal: -1,
      agreeInterviewModalForScreening: -1,
      completeModal: -1,
      modifyModal: -1,
      refuseInterviewModal: -1,
      refuseInterviewForScreeningModal: -1,
      cancelInterviewModal: -1,
    },

    lists: {
      audiences: [],
      interviewers: [],
      departments: [],
      positions: [],
      audiencesCurrentPage: [],
      interviewersCurrentPage: [],
    },

    currentPage: {
      audiences: 1,
      interviewers: 1,
    },

    pageSize: 5,

    counts: {
      audiences: 0,
      interviewers: 0,
    },

    loading: {
      audiences: true,
      interviewers: true,
    },

    interviewsList: {},
    activeKey: '1',
  },

  subscriptions: {
    listSubscriber({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/login') {
          console.log('Hello from myRecruit');

          for (const type of LIST_TYPES) {
            dispatch({ type: 'emptyList', payload: { type } });
          }
        }

        if (location.pathname === '/recruit/myrecruit') {

          const activeKey = location.query.tab;
          if (activeKey === 'interviewers') {
            console.log(location);
            dispatch({ type: 'selectActiveKey', payload: { key: '2' }});
          } else {
            dispatch({ type: 'selectActiveKey', payload: { key: '1' }});
          }

          for (const type of LIST_TYPES) {
            dispatch({ type: 'fetchList', payload: { type } });
          }

          /* for (const type of LIST_TYPES) {
             if (type === 'audiences') {
             dispatch({ type: 'fetchList', payload: { type } });
             } else if(type === 'interviewers') {
             dispatch({ type: 'fetchInterviewersList', payload: { type } });
             }
             }
           */

          dispatch({ type: 'fetchRelatedList', payload: { type: 'departments' } });
          dispatch({ type: 'fetchRelatedList', payload: { type: 'positions' } });
        }
      });
    },
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const { type } = payload;
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      yield put({ type: 'startLoading', payload: { type } });

      const { data, err } = yield call(fetchListByType, {
        type,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      }

      if (data) {

        const listData = data.data;

        if (listData && listData.length > 0) {
          for (const item of listData) {
            let applicantPositionId;
            if (type === 'interviewers'){
              applicantPositionId = item.interview.applicant_position_id;
            } else if (type === 'audiences') {
              applicantPositionId = item.applicant_position_id;
            }

            const { data, err } = yield call(fetchInterviewsById, {
              applicantPositionId,
              token,
            })

            if (err) {
              yield put({ type: 'hasError', payload: err });
            }

            if (data) {
              yield put({
                type: 'fetchInterviewsSuccess',
                payload: { applicantPositionId, data },
              });
            }
          }
        }

        const counts = listData.length;
        const orderListData = listData.sort((card1, card2) => {
          if (card1.created_at === undefined || card1.created_at >= card2.created_at) {
            return -1;
          }
          if (card1.created_at < card2.created_at) {
            return 1;
          }
        });

        console.log('!!!', orderListData);

        yield put({ type: 'saveCounts', payload: { counts, type } });
        yield put({ type: 'saveList', payload: { listData: orderListData, type } });
      }
    },

    *fetchInterviewersList({ payload }, { call, put, select }) {
      const { type } = payload;
      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchInterviewers, {
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      }

      if (data) {

        const listData = data.data;

        if (listData && listData.length > 0) {
          for (const item of listData) {
            const applicantPositionId = item.interview.applicant_position_id;
            const { data, err } = yield call(fetchInterviewsById, {
              applicantPositionId,
              token,
            })

            if (err) {
              yield put({ type: 'hasError', payload: err });
            }

            if (data) {
              yield put({
                type: 'fetchInterviewsSuccess',
                payload: { applicantPositionId, data },
              });
            }
          }
        }

        const counts = listData.length;

        yield put({ type: 'saveCounts', payload: { counts, type } });
        yield put({ type: 'saveList', payload: { listData, type } });
      }
    },

    *fetchRelatedList({ payload }, { call, put, select }) {
      const { type } = payload;
      const region = yield select(state => state.region);
      const { data, err } = yield call(fetchRelated, {
        type,
        region,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      }

      if (data) {
        yield put({ type: 'fetchRelatedSuccess', payload: { type, list: data.data } });
      }
    },

    *updateInterview({ payload }, { call, put, select }) {
      const { applicantPositionId, id, patchData } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(updateOneInterview, {
        applicantPositionId,
        id,
        patchData,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      } else {
        yield put({
          type: 'updateInterviewSuccess',
          payload: {
            applicantPositionId,
            id,
            patchData,
          } })
      }
    },

    *updateAudienceStatus({ payload }, { call, put, select }) {
      const { patchData, id, type } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(startUpdateAudienceStatusById, {
        patchData,
        id,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      } else {
        yield put({
          type: 'updateAudienceStatusSuccess',
          payload: {
            patchData,
            id,
            type,
          } })
      }
    },

    *updateInterviewerStatus({ payload }, { call, put, select }) {
      const { patchData, id, type } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(startUpdateInterviewerStatusById, {
        patchData,
        id,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      } else {
        yield put({
          type: 'updateInterviewerStatusSuccess',
          payload: {
            patchData,
            id,
            type,
          } })
      }
    },

    *updateStatus({ payload }, { call, put, select }) {
      const {
        patchData,
        applicantPositionId,
        id,
        type,
        hrEmail,
        applicantProfileId,
      } = payload;

      const token = yield select(state => _.get(state, 'currentUser.token', null));

      /* let data;
         let err;
       */
      console.log('what type', type);

      if (type === 'audiences') {
        console.log('audiences status');
        const { data, err } = yield call(startUpdateAudienceStatusById, {
          patchData,
          applicantPositionId,
          id,
          token,
        });

        if (err) {
          yield put({ type: 'hasError', payload: err });
        } else {
          yield put({
            type: 'updateStatusSuccess',
            payload: {
              patchData,
              id,
              type,
            } });

          const emailType = patchData.status === 'agreed' ? 'audience_agreed_to_hr' : 'audience_refused_to_hr';

          yield put({
            type: 'sendEmail',
            payload: {
              hrEmail: hrEmail,
              applicantPositionId: applicantPositionId,
              applicantProfileId: applicantProfileId,
              audienceId: id,
              emailType: emailType,
            } });
        }
      } else if (type === 'interviewers') {
        const { data, err } = yield call(startUpdateInterviewerStatusById, {
          patchData,
          id,
          token,
        });

        if (err) {
          yield put({ type: 'hasError', payload: err });
        } else {
          yield put({
            type: 'updateStatusSuccess',
            payload: {
              patchData,
              id,
              type,
            } })
        }
      }

      /* yield put({ */
      /* type: 'updateStatusSuccess', */
      /* payload: { */
      /* patchData, */
      /* id, */
      /* type, */
      /* } }) */
    },

    *sendEmail({ payload }, { call, put, select }) {
      const {
        hrEmail,
        applicantPositionId,
        applicantProfileId,
        audienceId,
        emailType
      } = payload;

      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const templateParams = {
        email_type: emailType,
        audience_id: audienceId,
        applicant_position_id: applicantPositionId,
      }

      const emailTemplate = yield call(startFetchEmailTemplates, templateParams, token);

      if (!emailTemplate.err) {
        console.log('template', emailTemplate.data.data);

        const email = emailTemplate.data.data;

        const params = Object.assign({}, {}, {
          to: hrEmail, // todo: should be modify
          subject: email.subject,
          body: email.body,
          the_object: 'applicant_position',
          the_object_id: applicantPositionId,
          mark: emailType,
          url: `#/applicant_profiles/${applicantProfileId}?tab=jobapplication`,
          audience_id: audienceId,
        });
        console.log(params);

        const {data} = yield call(startSendEmail, params, token);
        console.log(data);
      }

    },

    *startUpdateSchedule({ payload }, { call, put, select }) {
      const { applicantPositionId, status } = payload;

      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const region = yield select(state => state.region);

      const params = Object.assign({}, {}, {
        status,
      });

      const { data, err } = yield call(updateSchedule, {
        applicantPositionId,
        params,
        token,
        region,
      });

      if (err) {
        yield put({ type: 'hasError', payload: err });
      }
    },
  },

  reducers: {
    startLoading(state, { payload }) {
      const { type } = payload;
      return { ...state, loading: { ...state.loading, [type]: true } };
    },

    toggleModal(state, { payload }) {
      const { id, type } = payload;
      return { ...state, modalVisible: { ...state.modalVisible, [type]: id } };
    },

    saveList(state, { payload }) {
      const { listData, type } = payload;
      const currentType = `${type}CurrentPage`;
      const pageSize = state.pageSize;
      const current = listData.slice(0, pageSize);

      return { ...state,
               lists: { ...state.lists, [type]: listData, [currentType]: current },
               loading: { ...state.loading, [type]: false },
      };
    },

    saveInterviewersList(state, { payload }) {
      const { listData, type } = payload;
      return { ...state, lists: { ...state.lists, interviewers: listData } };
    },

    saveCounts(state, { payload }) {
      const { counts, type } = payload;
      return { ...state, counts: { ...state.counts, [type]: counts } };
    },

    fetchRelatedSuccess(state, { payload }) {
      const { type, list } = payload;
      return { ...state, lists: { ...state.lists, [type]: list } };
    },

    fetchInterviewsSuccess(state, { payload }) {
      const { applicantPositionId, data } = payload;

      const newData = [data.data];

      const newInterview = data.data.length === 0 ? {} : newData.reduce((list, item) => {
        list[item[0].applicant_position_id] = item;
        return list;
      }, {});

      return { ...state, interviewsList: { ...state.interviewsList, ...newInterview } };
    },

    updateInterviewSuccess(state, { payload }) {
      const { applicantPositionId, id, patchData } = payload;
      const oldInterviews = state.interviewsList[applicantPositionId];

      const updateInterviews = oldInterviews.map(interview => {
        if (interview.id === id) {
          return { ...interview, ...patchData };
        }
        return interview;
      })

      const newInterviews = [updateInterviews].reduce((list, item) => {
        list[applicantPositionId] = item;
        return list;
      }, {});

      return { ... state,
               interviewsList: { ...state.interviewsList, ...newInterviews } };
    },

    updateStatusSuccess(state, { payload }) {
      const { patchData, id, type } = payload;
      const oldList = state.lists[type];
      const currentType = `${type}CurrentPage`;
      const oldCurrent = state.lists[currentType];

      const newCurrent = oldCurrent.map(item => {
        return (item.id === id ? { ...item, ...patchData} : item);
      });

      const newList = oldList.map(item => {
        if (item.id === id) {
          return { ...item, ...patchData };
        }
        return item;
      });

      return { ...state,
               lists: { ...state.lists, [type]: newList, [currentType]: newCurrent },
      };
    },

    pageChange(state, { payload }) {
      const { type, pageNumber } = payload;
      const list = state.lists[type];
      const pageSize = state.pageSize;
      const currentType = `${type}CurrentPage`;
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;

      const newCurrent = list.slice(start, end);

      return { ...state,
               lists: { ...state.lists, [currentType]: newCurrent },
               currentPage: { ...state.currentPage, [type]: pageNumber},
      };
    },

    selectActiveKey(state, { payload }) {
      const { key } = payload;
      return { ...state, activeKey: key };
    },

    toggleActiveKey(state, { payload }) {
      const { nowActiveKey } = payload;
      const oldActiveKey = state.activeKey;
      const newActiveKey = oldActiveKey === nowActiveKey ? oldActiveKey : nowActiveKey;
      return { ...state, activeKey: newActiveKey };
    },

    emptyList(state, { payload }) {
      const { type } = payload;
      return { ...state,
               counts: { ...state.counts, [type]: 0 },
               lists: { ...state.lists, [type]: [] },
               interviewsList: {},
      };
    },
  },
}
