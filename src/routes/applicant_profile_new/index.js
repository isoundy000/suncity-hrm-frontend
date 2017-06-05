import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'dva';
import { Spin, Alert } from 'antd';
import ProfileForm from 'components/ProfileForm';

import classes from './index.less';

const NewApplicantProfilePage = function({ isCommitingProfile, template, profileTemplate, commitError, dispatch, currentUser }) {
  const computeTemplate = (template, profileTemplate) => {
    if(!profileTemplate) {
      return template;
    }

    return template.map(section => {
      const valuedSection = profileTemplate.sections.find(templateSection => (
        templateSection.key == section.key
      ));

      if(section.key != 'position_to_apply' && section.key != 'referrals_information') {
        return valuedSection;
      }else {
        return section;
      }
    });
  };

  if(template) {
    return (
      <Spin spinning={isCommitingProfile}>
        <div className={isCommitingProfile == true ? classes.disabled : classes.enable}>
          <div className={classes.container}>
            {(
               commitError
               ? <Alert
                   type="warning"
                   message={commitError[0].message}
                   banner
                   showIcon
                   closable
                   onClose={() => {
                       dispatch({type: 'newApplicantProfile/setCommitError', payload: null})
                     }}
                 />
               : null
             )}
            <ProfileForm
              template={computeTemplate(template, profileTemplate)}
              profileTemplate={profileTemplate}
              type="create"
              dispatch={dispatch}
              currentUser={currentUser}
              finderEndpointType={{
                type: 'applicantProfile',
                id: null
              }}

              onCreateProfile={() => {
                  dispatch({type: 'newApplicantProfile/commitProfile'})
                }}
              onUpdateRow={(sectionKey, rowData, rowIndex) => {
                  dispatch({
                    type: 'newApplicantProfile/updatePostRow',
                    payload: {sectionKey, rowData, rowIndex},
                  })
                }}
              onDeleteRow={(sectionKey, rowIndex) => {
                  dispatch({
                    type: 'newApplicantProfile/deletePostRow',
                    payload: {sectionKey, rowIndex},
                  });
                }}
              onCreateRow={(sectionKey, rowData) => {
                  dispatch({
                    type: 'newApplicantProfile/createPostRow',
                    payload: {sectionKey, rowData},
                  });
                }}
              onFieldValueChanged={(sectionKey, fieldKey, value) => {
                  dispatch({
                    type: 'newApplicantProfile/changePostFieldValue',
                    payload: {sectionKey, fieldKey, value},
                  });
                }}
              isCommitingProfile={isCommitingProfile}
              onFilesChange={(files) => {
                  dispatch({
                    type: 'newApplicantProfile/updatePostFiles',
                    payload: files
                  })
                }}
            />
          </div>
        </div>
      </Spin>
    );
  }else {
    return (
      <Spin>
        <div className={classes.spinContainer}>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = ({
  newApplicantProfile: {
    template,
    profileTemplate,
    commitError,
    isCommitingProfile
  },
  currentUser,
}) => ({
  template,
  profileTemplate,
  commitError,
  isCommitingProfile,
  currentUser,
});

export default connect(mapStateToProps)(
  injectIntl(NewApplicantProfilePage)
);
