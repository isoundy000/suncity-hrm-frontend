/**
 * Created by meng on 16/9/21.
 */

import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Spin, Alert } from 'antd';
import { connect } from 'dva';
import ProfileForm from 'components/ProfileForm';

import classes from './index.less';

const ProfileDetailCreate = ({
  dispatch,
  template,
  templateError,
  isLoadingTemplate,
  isCommitingProfile,
  commitError,
  profileTemplate,
  currentUser,
  applicantPositionDetail,
}) => {
  const changeFieldValue = (sectionKey, fieldKey, value) => {
    dispatch({
      type: 'profileDetail/changePostFieldValue',
      payload: { sectionKey, fieldKey, value },
    });
  };

  const updateRow = (sectionKey, rowData, rowIndex) => {
    dispatch({
      type: 'profileDetail/updatePostRow',
      payload: { sectionKey, rowData, rowIndex },
    });
  };

  const deleteRow = (sectionKey, rowIndex) => {
    dispatch({
      type: 'profileDetail/deletePostRow',
      payload: { sectionKey, rowIndex },
    });
  };

  const createRow = (sectionKey, rowData) => {
    dispatch({
      type: 'profileDetail/createPostRow',
      payload: { sectionKey, rowData },
    });
  };

  const onCreateProfile = () => {
    dispatch({
      type: 'profileDetail/commitProfile',
    });
  };
  const computeTemplate = (template, profileTemplate) => {
    if(!profileTemplate) {
      return template;
    }

    return template.map(section => {
      const valuedSection = profileTemplate.sections.find(templateSection => (
        templateSection.key == section.key
      ));

      const positionSection = profileTemplate.sections.find(section=>section.key == 'referrals_information')

      console.log('applicantProfile position info',applicantPositionDetail);

      if (!valuedSection) {
        if (section.key == 'position_information') {
          return {
            ...section,
            field_values: {
              ...positionSection.field_values,
              department: applicantPositionDetail.department.toString(),
              position: applicantPositionDetail.position.toString(),
              grade: applicantPositionDetail.grade.toString()
            }
          };
        }
        return section;
      }

      if(section.key == 'personal_information') {
        console.log('ppp', section);
        return { ...section, field_values: valuedSection.field_values };
        /* return valuedSection;*/
      }else {
        return section;
      }
    });
  };


  if (isLoadingTemplate) {
    return (
      <Spin spinning={isLoadingTemplate}>
        <div className={classes.spinContainer}>
        </div>
      </Spin>
    );
  } else {
    return (
      <div className={classes.container}>
        {(
          commitError
          ?
            <div style={{width: '1200px', margin: '0 auto'}}>
              <Alert
                type="warning"
                message={commitError[0].message}
                banner
                showIcon
                closable
                onClose={() => {
                  dispatch({type: 'profileDetail/setCommitError', payload: null})
                }}
              />
            </div>
          : null
        )}

        <ProfileForm
          type="create"
          template={computeTemplate(template, profileTemplate)}
          onCreateProfile={onCreateProfile}
          onUpdateRow={updateRow}
          onDeleteRow={deleteRow}
          onCreateRow={createRow}
          currentUser={currentUser}
          onFieldValueChanged={changeFieldValue}
          isCommitingProfile={isCommitingProfile}
          finderEndpointType={{
            type: 'profile',
            id: null
          }}
          onFilesChange={(files) => {
            dispatch({
              type: 'profileDetail/updatePostFiles',
              payload: files
            })
          }}
        />
      </div>
    );
  }
};

const mapStateToProps = ({
  profileDetail: {
    template,
    templateError,
    isLoadingTemplate,
    isCommitingProfile,
    commitError,
    profileTemplate,
    applicantPositionDetail,
  },

  currentUser,
}) => ({
  template,
  templateError,
  isLoadingTemplate,
  isCommitingProfile,
  commitError,
  profileTemplate,
  currentUser,
  applicantPositionDetail
});

export default connect(mapStateToProps)(ProfileDetailCreate);
