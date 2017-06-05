/**
 * Created by meng on 16/9/22.
 */

import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import {
  loadProfileTemplate,
  createProfile,
  loadProfile,
  editProfile,
  loadProfileRoleGroup,
  loadAllRoleGroup,
  addRoleGroup,
  removeRoleGroup,
  loadApplicantProfile
} from 'services/profiles';

import { fetchApplicantPositionDetail, getApplicantProfiles } from "services/jobApplication";
import { templateToPostData, sectionReducers, setcionEffects } from 'helpers/profiles';

export default {
  namespace: 'profileDetail',
  state: {
    applicantPositionDetail: {
      department: '',
      position: '',
      grade: ''
    },
    template: {},
    templateError: null,
    isLoadingTemplate: true,
    commitError: null,
    profileTemplate: null,
    postData: {},
    isCommitingProfile: false,

    profile: null,
    profileId: null,
    profileError: null,
    isLoadingProfile: false,

    roleGroup: [],
    allRoleGroup: [],

    modalVisible: {
      removeRoleGroupModal: -1,
      addRoleGroupModal: -1,
    },

    clickSource:null,
  },

  subscriptions: {
    listenProfilesCreate({ dispatch, history }) {
      //Load Locations Departments And Positions
      history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/profiles/create').exec(pathname);
        if (match) {
          dispatch({ type: 'clearPostData' });
          const applicantProfileTemplateId = query.applicantProfileTemplateId;
          if(applicantProfileTemplateId) {
            dispatch({type: 'loadApplicantProfileTemplate', payload: applicantProfileTemplateId});
          }else {
            dispatch({ type: 'loadTemplate' });
          }
        }
      });
    },
    listenProfileDetail({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/profile/:id').exec(pathname);
        if (match) {
          dispatch({type: 'clearProfileData'});
          const profileId = match[1];
          dispatch({ type: 'loadProfile', payload: profileId });
        }
      });
    },
    listenProfileDetailSource({ dispatch, history }) {
      history.listen(({ pathname, query})=> {
        const match = pathToRegexp('/profile/:id').exec(pathname);
        if (match) {
          dispatch({ type: 'clearClickSource'});
          const clickSource = query.source;
          dispatch({ type: 'setClickSource', payload: clickSource });
        };

      });
    }
  },

  effects: {
    *loadApplicantProfileTemplate({ payload: profileId }, { call, put, select }) {
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(loadApplicantProfile, profileId);

      if (data) {
        console.log('dataaaaa', data);
        yield put({
          type: 'loadingApplicantProfileTemplateSucceed',
          payload: data.data
        });

        const applicantProfile = yield call(getApplicantProfiles, { id: profileId }, token);

        if(applicantProfile.data){
          const applicantProfileData = applicantProfile.data.data;
          const {
            first_applicant_position_status,
            second_applicant_position_status,
            third_applicant_position_status
          } = applicantProfileData;
          const applicant_position_id = first_applicant_position_status == 'entry_finished' ? applicantProfileData.first_applicant_position_id
            : second_applicant_position_status == 'entry_finished' ? applicantProfileData.second_applicant_position_id
            : third_applicant_position_status == 'entry_finished' ? applicantProfileData.third_applicant_position_id : null;
          if(applicant_position_id!==null){
            const appliantPositionDetail = yield call(fetchApplicantPositionDetail, applicant_position_id, token);
            if(appliantPositionDetail.data){
              yield put({type: 'setApplicantPositionDetail',payload:appliantPositionDetail.data.data})
            }
          }
        }
        yield put({ type: 'loadTemplate' });
      }
    },



    *loadTemplate(action, { call, put, select }) {
      yield put({ type: 'startLoadingTemplate' });
      const region = yield select(state => state.region);
      const { data, err } = yield call(loadProfileTemplate, region);

      if (data) {
        console.log('dataaaaadadaaaaa', data);
        yield put({ type: 'loadingTemplateSucceed', payload: data.data });
      }

      if (err) {
        yield put({ type: 'loadingTemplateFailed', payload: err });
      }

      yield put({ type: 'stopLoadingTemplate' });
    },
    *commitProfile(action, { call, put, select }) {
      const postData = yield select(select => select.profileDetail.postData);
      const region = yield select(select => select.region);

      yield put({ type: 'startCommitProfile' });

      const { data, err } = yield call(
        createProfile,
        { sections: _.values(postData.sections) },
        postData.sections.personal_information.id_number ,
        region
      );

      yield put({ type: 'stopCommitProfile' });

      if (data) {
        console.log('commit profile succeed', data);
        yield put(routerRedux.push(`/profile/${data.data.id}`));
      }

      if (err) {
        const errorJson = yield err.response.json();
        yield put({type: 'setCommitError', payload: errorJson.data});
      }
    },
    *loadProfile({ payload: profileId }, { call, put, select }) {
      yield put({ type: 'startLoadingProfile', payload: profileId });

      const { data, err } = yield call(loadProfile, profileId);

      yield put({ type: 'stopLoadingProfile' });

      if (data) {

        yield put({ type: 'startLoadProfileRoleGroup', payload: { userId: data.data.user_id } });
        yield put({
          type: 'loadingProfileSucceed',
          payload: data.data
        });
      }

      if (err) {

      }
    },

    *startLoadProfileRoleGroup({ payload }, { call, put, select }) {
      /* yield put({ type: 'startLoadingProfile', payload: profileId }); */

      const { userId } = payload;
      const { data, err } = yield call(loadProfileRoleGroup, userId);

      /* yield put({ type: 'stopLoadingProfile' }); */

      if (data) {
        yield put({
          type: 'loadingProfileRoleGroupSucceed',
          payload: {
            roleGroup: data.data,
          }
        });
      }
    },

    *startLoadAllRoleGroup({ payload }, { call, put, select }) {
      const { data, err } = yield call(loadAllRoleGroup);

      if (data) {
        yield put({
          type: 'loadingAllRoleGroupSucceed',
          payload: {
            allRoleGroup: data.data,
          }
        });
      }
    },

    *startAddRoleGroup({ payload }, { call, put, select }) {
      /* yield put({ type: 'startLoadingProfile', payload: profileId }); */

      const { formData } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const userId = yield select(state => _.get(state, 'profileDetail.profile.user_id', null));

      const postData = Object.assign({}, {}, {
        role_ids: formData.roleGroup,
      });

      const { data, err } = yield call(addRoleGroup, {
        id: userId,
        postData,
        region,
        token,
      });

      if (data) {
        console.log('addRoleGroupSucceed', data.data);
        yield put({
          type: 'addRoleGroupSucceed',
          payload: {
            newRoleGroup: data.data,
          }
        });
      }
    },

    *startRemoveRoleGroup({ payload }, { call, put, select }) {
      /* yield put({ type: 'startLoadingProfile', payload: profileId }); */

      const { roleId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const userId = yield select(state => _.get(state, 'profileDetail.profile.user_id', null));

      const postData = Object.assign({}, {}, {
        role_id: roleId,
      });

      const { data, err } = yield call(removeRoleGroup, {
        id: userId,
        postData,
        region,
        token,
      });


      if (data) {
        yield put({
          type: 'removeRoleGroupSucceed',
          payload: {
            roleId,
          }
        });
      }
    },
    ...setcionEffects('profile'),
  },

  reducers: {
    setApplicantPositionDetail(state,{payload:applicantPositionDetail}){
      console.warn('applicantPositionDetail',applicantPositionDetail);
      return{
        ...state,
        applicantPositionDetail: {
          department: applicantPositionDetail.department.id.toString(),
          position: applicantPositionDetail.position.id.toString(),
          grade: applicantPositionDetail.position.grade.toString()
        }
      }
    },
    clearApplicantProfileTemplate(state) {
      return {
        ...state,
        profileTemplate: null,
        commitError: null,
      }
    },
    loadingApplicantProfileTemplateSucceed(state, { payload: profileTemplate }) {
      return {
        ...state,
        profileTemplate,
        postData: templateToPostData(
          profileTemplate.sections.map(section => {
            if(section.key != 'position_to_apply' && section.key != 'referrals_information') {
              return section;
            }else {
              return {
                ...section,
                field_values: {}
              }
            }
          })
        ),
      }
    },
    startLoadingTemplate(state) {
      return {
        ...state,
        templateError: null,
        isLoadingTemplate: true,
      };
    },
    stopLoadingTemplate(state) {
      return {
        ...state,
        isLoadingTemplate: false,
      };
    },
    loadingTemplateSucceed(state, { payload: template }) {
      console.log('postData', state.postData, state.profileTemplate, template, templateToPostData(template));

      const personalInfo = state.profileTemplate === null ?
                           {} :
                           state.profileTemplate.sections.find(section => section.key === 'personal_information');

      const referralsInfo = state.profileTemplate === null ?
                           {}:
                           state.profileTemplate.sections.find(section => section.key === 'referrals_information');

      const postData = templateToPostData(template);
      const newPostData = state.profileTemplate === null ?
                          postData :
                          Object.assign({}, postData, {
                            sections: {
                              ...postData.sections,
                              personal_information: {
                                ...postData.sections.personal_information,
                                field_values: {
                                  ...postData.sections.personal_information.field_values,
                                  ...personalInfo.field_values,
                                }
                              },
                              position_information: {
                                ...postData.sections.position_information,
                                field_values: {
                                  ...postData.sections.position_information.field_values,
                                  ...referralsInfo.field_values,
                                  ...state.applicantPositionDetail,
                                }
                              }
                            }
                          });

      console.log('postData', state.postData, state.profileTemplate, template, templateToPostData(template), newPostData);
      return {
        ...state,
        template: template,
        postData: newPostData,
      };
    },
    loadingTemplateFailed(state, { payload: error }) {
      return {
        ...state,
        templateError: error,
      };
    },
    startLoadingProfile(state, { payload: profileId }) {
      return {
        ...state,
        profileId: profileId,
        isLoadingProfile: true,
      };
    },
    stopLoadingProfile(state) {
      return {
        ...state,
        isLoadingProfile: false,
      };
    },
    loadingProfileSucceed(state, { payload: profile }) {
      return {
        ...state,
        profile: profile,
      };
    },

    loadingProfileFailed(state, { payload: error }) {
      return {
        ...state,
        profileError: error,
      };
    },
    startCommitProfile(state) {
      return {
        ...state,
        isCommitingProfile: true,
      }
    },
    stopCommitProfile(state) {
      return {
        ...state,
        isCommitingProfile: false,
      }
    },
    clearPostData(state) {
      return {
        ...state,
        postData: null,
        profileTemplate:null,
      };
    },

    clearProfileData(state) {
      return {
        ...state,
        profile: null,
      }
    },

    loadingProfileRoleGroupSucceed(state, { payload }) {
      const { roleGroup } = payload;
      return { ...state, roleGroup };
    },

    loadingAllRoleGroupSucceed(state, { payload }) {
      const { allRoleGroup } = payload;
      return { ...state, allRoleGroup };
    },

    addRoleGroupSucceed(state, { payload }) {
      const { newRoleGroup } = payload;
      return { ...state, roleGroup: newRoleGroup };
    },
    setCommitError(state, { payload: commitError }){
      return {
        ...state,
        commitError
      };
    },
    removeRoleGroupSucceed(state, { payload }) {
      const { roleId } = payload;
      const newRoleGroup = state.roleGroup.filter(role => (role.id !== roleId))
      return { ...state, roleGroup: newRoleGroup };
    },

    toggleModal(state, { payload }) {
      const { id, type } = payload;
      return { ...state, modalVisible: { ...state.modalVisible, [type]: id } };
    },

    setClickSource(state, { payload: clickSource }) {
      return { ...state, clickSource: clickSource};
     },

     clearClickSource(state){
      return {
        ...state,
        clickSource: null
      };
     },
    ...sectionReducers(),
  },
};
