import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import { requestSimple } from 'utils/request';
import { fetchJobs, fetchJobsStatistics, editJobRequest } from 'services/jobs';

export default {
  namespace: 'jobs',
  state: {
    addingNewJob: false,
    jobs: [],
    jobOnEditing: null,

    filterDepartment: null,
    filterGrade: null,
    filterState: null,

    jobsStatistics: null,

  },
  subscriptions: {
    setup({ dispatch, history }) {
      //Load Locations Departments And Positions
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/jobs').exec(pathname);
        dispatch({
          type: 'clearFilterParams'
        });

        dispatch({
          type: 'fetchJobsAction'
        });

        dispatch({
          type: 'fetchStatistics'
        });
      });
    }
  },
  effects: {
    *createJob({ payload: jobParams }, { call, put, select }) {
      const params = {
        ...jobParams,
        region: yield select(state => state.region),
      }

      const response = yield requestSimple({
        url: '/jobs',
        method: 'POST',
        body: params
      });

      yield put({
        type: 'endAddingNewJob'
      });

      yield put({
        type: 'fetchJobsAction'
      });

      yield put({
        type: 'fetchStatistics'
      });
    },

    *editJob({ payload: jobParams }, { call, put, select }){
      const editJob = yield select(state => state.jobs.jobOnEditing);
      const response = yield editJobRequest(editJob.id, jobParams);

      yield put({
        type: 'endEditingJob'
      });

      yield put({
        type: 'fetchJobsAction'
      });

      yield put({
        type: 'fetchStatistics'
      });
    },

    *fetchJobsAction(action, { call, put, select }) {
      const region = yield select(state => state.region);
      const filterDepartment = yield select(state => state.jobs.filterDepartment);
      const filterGrade = yield select(state => state.jobs.filterGrade);
      const filterState = yield select(state => state.jobs.filterState);

      const page = _.get(action.payload,'page',1);
      const params = {
        region,
        department_id: _.get(filterDepartment, 'id'),
        grade: _.get(filterGrade, 'id'),
        status: _.get(filterState, 'id'),
        page:page
      }

      const jobs = yield fetchJobs(params);

      yield put({
        type: 'setJobs',
        payload: {
          "jobs": jobs.data.data,
          "jobsMeta": jobs.data.meta
        }
      })
    },

    *fetchStatistics(action, { call, put, select }) {
      const region = yield select(state => state.region);
      const statisticsReponse = yield fetchJobsStatistics(region);
      yield put({
        type: 'setjobsStatistics',
        payload: statisticsReponse.data.data
      });
    },
  },

  reducers: {
    clearFilterParams(state) {
      return {
        ...state,
        filterDepartment: null,
        filterGrade: null,
        filterState: null,
      }
    },
    addingNewJob(state) {
      return {...state, addingNewJob: true};
    },
    endAddingNewJob(state) {
      return {...state, addingNewJob: false};
    },
    setJobs(state, { payload }) {
      return {...state, jobs: payload.jobs, jobsMeta: payload.jobsMeta};
    },
    editingJob(state,{ payload: jobOnEditing }) {
      return {...state, jobOnEditing};
    },
    endEditingJob(state) {
      return {...state, jobOnEditing: false};
    },
    changeFilterDepartment(state, { payload: filterDepartment }) {
      return {...state, filterDepartment};
    },
    changeFilterState(state, { payload: filterState }) {
      if(filterState.id == null) {
        filterState = null;
      }
      return {...state, filterState};
    },
    changeFilterGrade(state, { payload: filterGrade }) {
      return {...state, filterGrade};
    },
    setjobsStatistics(state, { payload: jobsStatistics }) {
      return {...state, jobsStatistics};
    }
  }
};
