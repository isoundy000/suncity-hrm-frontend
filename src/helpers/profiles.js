import {
  fetchLocations,
  fetchDepartments,
  fetchPositions,
  fetchProfiles,
  editApplicantProfile,
  editProfile,
} from 'services/profiles';

import _ from 'lodash';
import update from 'react-addons-update';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const defaultOption = {
  id: null,
  chinese_name: '不限',
  english_name: 'NOT LIMITED',
};

export const getFilterParams = function*(select) {
  const profilesState = yield select(state => state.profiles);

  const selectedSubLocationId = profilesState.selectedSubLocation.id;
  const selectedDepartmentId = profilesState.selectedDepartment.id;
  const selectedLocationId = profilesState.selectedLocation.id;
  const selectedPositionId = profilesState.selectedPosition.id;
  const selectedGradeId = profilesState.selectedGrade.id;
  const selectedCompanyId = profilesState.selectedCompany.id;
  const selectedEmploymentStatusId = profilesState.selectedEmploymentStatus.id;

  const subLocations = profilesState.subLocations;

  let employmentStatuses = [];

  if (selectedEmploymentStatusId === 'in_service') {
    employmentStatuses = ['president', 'director', 'formal_employees', 'informal_employees', 'part_time', 'trainee'];
  } else if (selectedEmploymentStatusId === 'dimiss') {
    employmentStatuses = ['resigned_president', 'resigned_director', 'resigned'];
  } else {
    employmentStatuses = selectedEmploymentStatusId ?
                         [selectedEmploymentStatusId] :
                         null;
  }

  let locationIds = [];

  if (selectedLocationId !== null) {
    if (subLocations.length > 0) {
      locationIds = selectedSubLocationId === null ?
                    [...subLocations.map(subL => subL.id), selectedLocationId] :
                    [selectedSubLocationId];
    } else {
      locationIds = [selectedLocationId];
    }
  } else {
    locationIds = null;
  }

  const queryColumns = profilesState.selectedTableFields.map((column) => {
    return column.key;
  }).filter((key) => {
    return key != 'photo';
  });

  return {
    /* location_id: selectedSubLocationId? selectedSubLocationId : selectedLocationId,*/
    location_ids: locationIds,
    department_id: selectedDepartmentId,
    position_id: selectedPositionId,
    grade: selectedGradeId,
    company_name: selectedCompanyId,
    employment_statuses: employmentStatuses,
    select_columns: queryColumns,
  };
}

export const createFetchEffect = function(model) {
  return function*({ payload: params }, { call, put, select }) {
    const region = yield select(state => state.region);

    const functionName = `fetch${model}`;

    let callFunction = null;

    switch (functionName) {
      case "fetchDepartments": callFunction = fetchDepartments; break;
      case "fetchPositions": callFunction = fetchPositions; break;
      case "fetchLocations": callFunction = fetchLocations; break;
    }

    const queryParams = yield getFilterParams(select);

    const listResponse = yield call(
      callFunction,
      {
        region,
        ...params,
        department_id: queryParams.department_id,
        location_id: queryParams.location_id,
        position_id: queryParams.position_id
      }
    );

    const list = [defaultOption].concat(listResponse.data.data);

    yield put({
      type: `set${model}List`,
      payload: list
    });
  }
}

export const createFetchEffects = function(models) {
  let effects = {};
  models.forEach((model) => {
    const modelName = model.capitalizeFirstLetter();
    effects[`fetch${modelName}`] = createFetchEffect(modelName);
  });

  return effects;
}

export const createSelectItemReducer = function(model){
  return (state, { payload: selectModel }) => {
    let new_state = {
      ...state
    };

    new_state[`selected${model}`] = selectModel;
    return new_state;
  };
}

export const createReducers = function(models) {
  let reducers = {};
  models.forEach((model) => {
    const modelName = model.capitalizeFirstLetter();
    const modelNameSingularForm = modelName.slice(0, -1);
    reducers[`set${modelName}List`] = (state, { payload: list }) => {
      let new_state = {
        ...state
      };
      new_state[`${model}List`] = list;

      return new_state;
    };

    reducers[`select${modelNameSingularForm}`] = createSelectItemReducer(modelNameSingularForm);
  });

  return reducers;
}


export const createGroupSelectChangeEffect = function(model, models){
  const otherModels = models.filter((item) => {
    return item != model;
  });

  return function*({ payload: changeValue }, { call, put, select }) {
    if(changeValue.id === null){
      //change to default value
      for(const modelForUpdateIndex in otherModels){
        const modelForUpdate = otherModels[modelForUpdateIndex].capitalizeFirstLetter();

        const actionType = `fetch${modelForUpdate}`;
        yield put({
          type: actionType
        });
      }
    }else{
      for(const modelForUpdateIndex in otherModels){
        const modelForUpdate = otherModels[modelForUpdateIndex].capitalizeFirstLetter();
        const modelSelectedKey = `selected${modelForUpdate}`.slice(0, -1);

        const selectedModel = yield select(state => state.profiles[modelSelectedKey]);

        if(selectedModel.id === null){
          const actionType = `fetch${modelForUpdate}`;
          yield put({
            type: actionType
          });
        }
      }
    }
  };
}

export const groupSelectChangeEffect = function(models){
  let effects = {};
  models.forEach((model) => {
    const modelName = model.capitalizeFirstLetter();
    const modelNameSingularForm = modelName.slice(0, -1);
    effects[`select${modelNameSingularForm}`] = createGroupSelectChangeEffect(model, models);
  });

  effects['selectSubLocation'] = effects['selectLocation'];

  return effects;
}

export const fieldsToColumns = function(fields){
  return fields.map((field) => {
    return filedToColumn(field);
  });
}

export const filedToColumn = function(field){
  return {
    ...field,
    canDelete: false,
    dataIndex: field.key,
    key: field.key,
    name: field.chinese_name,
    chinese_name: field.chinese_name,
    type: field.type,
  };
}

export function templateToPostData(template) {
  const postData = {
    sections: {},
  };

  for (let section of template) {
    const sectionData = {
      key: section.key,
    };
    if (section.type === 'fields') {
      if(section.field_values) {
        sectionData.field_values = section.field_values;
      }else {
        sectionData.field_values = {};
        for (let field of section.fields) {
          if (field.default) {
            sectionData.field_values[field.key] = field.default;
          }
        }
      }
    }
    if (section.type === 'table') {
      sectionData.rows = _.get(section, 'rows', []);
    }
    postData.sections[sectionData.key] = sectionData;
  }

  return postData;
}

export function sectionReducers() {
  return {
    updatePostFiles(state, { payload: files }) {
      const updater = {
        files
      };
      const postData = _.merge({}, state.postData, updater);

      return {
        ...state,
        postData,
      }
    },
    changePostFieldValue(state, { payload: { sectionKey, fieldKey, value } }) {
      const updater = {
        sections: {
          [sectionKey]: {
            field_values: {
              [fieldKey]: value,
            }
          }
        }
      };

      return {
        ...state,
        postData: _.merge({}, state.postData, updater),
      };
    },

    updatePostRow(state, { payload: { sectionKey, rowData, rowIndex } }) {
      const rows = state.postData.sections[sectionKey].rows;
      rows[rowIndex] = rowData;
      const updater = {
        sections: {
          [sectionKey]: {
            rows,
          }
        }
      };
      return {
        ...state,
        postData: _.merge({}, state.postData, updater),
      }
    },
    deletePostRow(state, { payload: { sectionKey, rowIndex } }) {
      const rows = state.postData.sections[sectionKey].rows;
      rows.splice(rowIndex, 1);
      const updater = {
        sections: {
          [sectionKey]: {
            rows,
          }
        }
      };
      return {
        ...state,
        postData: _.merge({}, state.postData, updater),
      }
    },
    createPostRow(state, { payload: { sectionKey, rowData } }) {
      const rows = state.postData.sections[sectionKey].rows;
      rows.push(rowData);
      const updater = {
        sections: {
          [sectionKey]: {
            rows,
          }
        }
      };
      return {
        ...state,
        postData: _.merge({}, state.postData, updater),
      }
    },
  };
}

export const setcionEffects = function(type) {
  let action = editProfile;
  let profileKey = 'profileDetail';

  if(type == 'applicant_profile') {
    action = editApplicantProfile;
    profileKey = 'newApplicantProfile';
  }

  return {
    edit_section: function*({ payload }, { call, put, select }){
      const currentProfile = yield select(state => state[profileKey].profile);
      console.log(currentProfile);
      const token = yield select(select => select.currentUser.token);
      const clonedProfile = _.clone(currentProfile);

      let currentProfileId = currentProfile.id;

      //如果是在申请人档案 修改员工编号(type== 'applicant_profile')，
      // 则获取 applicant_profile 对应的 profile_id, 调用 profiles 接口(即使用 action = editApplicantProfile),
      if (type == 'applicant_profile') {
        if (payload.edit_action_type == 'edit_field' && payload.params.field == 'empoid') {
          payload.params.section_key = "position_information";
          payload.params = {...payload.params, from_applicant_profile: true};
          action = editProfile;
          currentProfileId = yield select(state => state.newApplicantProfile.profile.profile_id);
        }
      }
      //如果是在申请人档案 修改 求职者编号(type == applicant_profile)
      //根据新增 api 接口,修改提交数据的结构
      if (type == 'applicant_profile') {
        console.warn('1111111', payload);
        if (payload.edit_action_type == 'edit_field' && payload.params.field == 'applicant_no') {
          payload = {
            edit_action_type: 'edit_applicant_no',
            params: {applicant_no: payload.params.new_value}
          };
        }
      }

      const { data, err } = yield call(action, currentProfileId, payload, token);
      if (data) {
        const section_key = payload.params.section_key;

        if(type == 'applicant_profile') {
          //当个人资料的数据更新后，更新 职位申请 界面的数据
          yield put({type: 'jobApplication/updateOptions'});
        }

        const sectionIndex = currentProfile.sections.findIndex((section) => {
          return section.key == section_key
        });

        if (payload.edit_action_type == 'add_row'){
          const newRow = data.data;
          clonedProfile.sections[sectionIndex].rows.push(newRow);
        }

        if(payload.edit_action_type == 'remove_row') {
          const removeRowIndex = clonedProfile.sections[sectionIndex].rows.findIndex(row => row.id == payload.params.row_id);
          clonedProfile.sections[sectionIndex].rows.splice(removeRowIndex, 1);
        }

        if(payload.edit_action_type == 'edit_row_fields') {
          const rowAttribute = data.data;

          const rowIndex = clonedProfile.sections[sectionIndex].rows.findIndex(row => row.id == payload.params.row_id);
          clonedProfile.sections[sectionIndex].rows[rowIndex] = _.merge({}, clonedProfile.sections[sectionIndex].rows[rowIndex], rowAttribute);
        }

        if(payload.edit_action_type == 'edit_field') {
          const field_key = payload.params.field;
          const newValue = payload.params.new_value;
          let newFieldValues = clonedProfile.sections[sectionIndex].field_values;
          newFieldValues[field_key] = newValue;
          clonedProfile.sections[sectionIndex].filed_values = newFieldValues;

          let newFieldIndex = clonedProfile.sections[sectionIndex].fields.findIndex(field => field.key == field_key);
          const newField = update(clonedProfile.sections[sectionIndex].fields[newFieldIndex], {value: {$set: newValue}});
          clonedProfile.sections[sectionIndex].fields = update(clonedProfile.sections[sectionIndex].fields, {
            $splice: [[newFieldIndex, 1, newField]]
          });

          if (type == 'profile') {
            if ( field_key == 'chinese_name' || field_key == 'english_name') {
              const currentUser = yield select(state => state.currentUser);
              if (currentProfile['user_id'] === currentUser.id) {
                let newCurrentUser = currentUser;
                newCurrentUser[field_key] = newValue;

                yield put({
                  type: 'currentUser/setCurrentUser',
                  payload: newCurrentUser
                })
              }
            }
          }
        }

        if(payload.edit_action_type == 'edit_get_info_from') {
          console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
          console.log(payload);
        }

        yield put({
          type: 'loadingProfileSucceed',
          payload: clonedProfile
        });

      }
    }
  };
}
