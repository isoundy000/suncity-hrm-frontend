import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import {
  loadApplicantProfileTemplate as loadApplicantProfileTemplateRequest,
  createApplicantProfile,
  editApplicantProfile,
  loadApplicantProfile
} from 'services/profiles';

import {
  templateToPostData,
  sectionReducers,
  setcionEffects
} from 'helpers/profiles';

import {
  createFile,
} from 'services/finder';

export default {
  namespace: 'newApplicantProfile',
  state: {
    template: null,
    postData: null,
    profile: null,
    profileId: null,
    profileTemplate: null,

    totalNum: null,
    loadingProfile: false,
    commitError: null,
    isCommitingProfile: false,
    readonly: false,
    profileOnly: false,

    getInfoFrom: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      //Load Locations Departments And Positions
      history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/applicant_profiles/:id').exec(pathname);
        if (match) {
          if(match[1] == 'new'){
            dispatch({type: 'loadTemplate'});

            const profileTemplateId = query.profileTemplateId;
            if(profileTemplateId) {
              dispatch({type: 'loadApplicantProfileTemplate', payload: profileTemplateId})
            }else {
              dispatch({type: 'clearApplicantProfileTemplate'});
            }
          }else {
            dispatch({type: 'setProfileId', payload: match[1]});
            if (query.readonly) {
              dispatch({type: 'setReadOnly', payload: true});
            } else {
              dispatch({type: 'setReadOnly', payload: false});
            }

            if (query.profileOnly) {
              dispatch({type: 'setProfileOnly', payload: true});
            } else {
              dispatch({type: 'setProfileOnly', payload: false});
            }
          }
        }
      });
    }
  },

  effects: {
    *loadTemplate(action, { call, put, select }) {
      const region = yield select(state => state.region);
      const { data, err } = yield call(loadApplicantProfileTemplateRequest, region);

      //delete template applicant_no
      let template = data.data;
      const personInfoIndex = template.findIndex(section=>section.key=='personal_information');
      template[personInfoIndex].fields = template[personInfoIndex].fields.filter(field=>field.key != 'applicant_no');

      if (data) {
        yield put({ type: 'loadingTemplateSucceed', payload: template });
      }

      if (err) {
        yield put({ type: 'loadingTemplateFailed', payload: err });
      }

      yield put({ type: 'stopLoadingTemplate' });
    },
    *loadApplicantProfileTemplate({ payload: profileId }, { call, put, select }) {
      const { data, err } = yield call(loadApplicantProfile, profileId);

      if (data) {
        yield put({
          type: 'loadingProfileTemplateSucceed',
          payload: data.data
        });
      }
    },
    *refreshApplicantProfile(action, { call, put, select }) {
      const profileId = yield select(state => state.newApplicantProfile.profileId);
      yield put({type: 'clearProfile'});
      yield put({type: 'setProfileId', payload: profileId});
      yield put({type: 'loadApplicantProfile', payload: profileId});
    },

    *loadApplicantProfile({ payload: profileId }, { call, put, select }) {
      yield put({ type: 'toggleLoadingProfile', payload: { ans: true} });

      yield put({ type: 'startLoadingProfile', payload: profileId });

      const { data, err } = yield call(loadApplicantProfile, profileId);

      yield put({ type: 'stopLoadingProfile' });

      if (data) {
        //这三种状态的select可以编辑
        const editableStatus = ['not_started', 'choose_needed', null];
        let profile = data.data;

        //替换掉原本为空的 applicat_no
        const personInfoIndex = profile.sections.findIndex(section=>section.key=='personal_information');
        const applicantNoIndex = profile.sections[personInfoIndex].fields.findIndex(field=>field.key=='applicant_no');

        const applicantNoField =  {
          key: "applicant_no",
          chinese_name: "求職者編號",
          english_name: "applicant-no",
          type: "string",
          value: profile.applicant_no,
          required: true
        };

        profile.sections[personInfoIndex].fields[applicantNoIndex] = applicantNoField;

        Array.prototype.move = function (old_index, new_index) {
          if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
              this.push(undefined);
            }
          }
          this.splice(new_index, 0, this.splice(old_index, 1)[0]);
          return this;
        };

        //修改 求职者编号的位置
        profile.sections[personInfoIndex].fields.move(0,5);

        //把员工编号和求职者编号插入到 个人信息 section 中。
        profile.sections[personInfoIndex].field_values.applicant_no = profile.applicant_no;
        profile.sections[personInfoIndex].field_values.empoid = profile.empoid;

        profile.sections[personInfoIndex].fields.push({
          key: "empoid",
          chinese_name: "員工編號",
          english_name: "empoid",
          type: "string",
          value: profile.empoid,
          required: false,
          readonly: profile.empoid == null ? true : false
        });

        const positionToApplySectionIndex = profile.sections.findIndex(section => section.key == 'position_to_apply')
        const positionToApplySection = profile.sections[positionToApplySectionIndex];

        if(!editableStatus.includes(profile.first_applicant_position_status)) {
          const fieldIndex = positionToApplySection.fields.findIndex(field => field.key == 'first_choice')
          const newField = {
            ...positionToApplySection.fields[fieldIndex],
            disabled: true
          };
          profile.sections[positionToApplySectionIndex].fields[fieldIndex] = newField;
        }

        if(!editableStatus.includes(profile.second_applicant_position_status)) {
          const fieldIndex = positionToApplySection.fields.findIndex(field => field.key == 'second_choice')
          const newField = {
            ...positionToApplySection.fields[fieldIndex],
            disabled: true
          };

          profile.sections[positionToApplySectionIndex].fields[fieldIndex] = newField;
        }

        if(!editableStatus.includes(profile.third_applicant_position_status)) {
          const fieldIndex = positionToApplySection.fields.findIndex(field => field.key == 'third_choice')
          const newField = {
            ...positionToApplySection.fields[fieldIndex],
            disabled: true
          };
          profile.sections[positionToApplySectionIndex].fields[fieldIndex] = newField;
        }

        yield put({
          type: 'loadingProfileSucceed',
          payload: profile
        });
      }

      if (err) {

      }
    },
    *commitProfile(action, { call, put, select }) {
      const postData = yield select(select => select.newApplicantProfile.postData);
      const region = yield select(select => select.region);
      const token = yield select(select => select.currentUser.token);

      const getInfoFrom = yield select(select => select.newApplicantProfile.getInfoFrom);


      yield put({ type: 'startCommitProfile' });

      const { data, err } = yield call(
        createApplicantProfile,
        {
          sections: _.values(postData.sections),
          /* attachments,*/
          /* get_info_from: getInfoFrom,*/
        },
        region,
        token
      );


      yield put({ type: 'stopCommitProfile' });

      if (data) {
        const attachments = postData.files;
        if (attachments) {
          for (let file of attachments) {
            console.log(file);
            yield call(createFile,
                       {
                         type: 'applicantProfile',
                         id: data.data.id,
                       },
                       file);
          }
        }

        yield call(editApplicantProfile, data.data.id, getInfoFrom, token);

        yield put(routerRedux.push(`/applicant_profiles/${data.data.id}`));
      }

      if (err) {
        const errorJson = yield err.response.json();
        yield put({type: 'setCommitError', payload: errorJson.data});
      }
    },
    ...setcionEffects('applicant_profile'),
  },

  reducers: {
    startCommitProfile(state){
      return {
        ...state,
        isCommitingProfile: true
      }
    },
    stopCommitProfile(state){
      return {
        ...state,
        isCommitingProfile: false
      }
    },
    loadingTemplateSucceed(state, { payload: template }) {
      return {
        ...state,
        template,
        postData: templateToPostData(template),
      };
    },
    loadingProfileSucceed(state, { payload: profile }) {
      return {
        ...state,
        profile,
        loadingProfile: false,
      }
    },
    clearApplicantProfileTemplate(state) {
      return {
        ...state,
        profileTemplate: null,
        commitError: null,
      }
    },
    loadingProfileTemplateSucceed(state, { payload: profileTemplate }) {
      return {
        ...state,
        profileTemplate,
        postData: templateToPostData(
          profileTemplate.sections.map(section => {
            if(section.key == 'personal_information') {
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
    clearProfile(state) {
      return {
        ...state,
        profile: null,
        commitError: null,
      };
    },
    setProfileId(state, { payload: profileId}) {
      return {
        ...state,
        profileId
      }
    },
    setCommitError(state, { payload: commitError }){
      return {
        ...state,
        commitError
      };
    },
    setReadOnly(state, { payload: readonly }) {
      return {
        ...state,
        readonly
      }
    },

    setProfileOnly(state, { payload: profileOnly }) {
      return {
        ...state,
        profileOnly,
      }
    },
    toggleLoadingProfile(state, { payload }) {
      const { ans } = payload;
      return {
        ...state,
        loadingProfile: ans,
      };
    },

    setGetInfoFrom(state, { payload }) {
      const { getInfoFrom } = payload;
      console.log('!!!', getInfoFrom);
      return {
        ...state,
        getInfoFrom,
      };
    },
    ...sectionReducers(),
  }
}
