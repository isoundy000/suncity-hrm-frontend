import React, { Component } from 'react';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'dva';

import ApplicantProfileHeader from './ApplicantProfileHeader';
import ProfileForm from 'components/ProfileForm';

import classes from './index.less';

function EditApplicantProfilePage({ profile, loadingProfile, readonly, photoWidth, photoHeight, dispatch, currentUser, region }) {
  if(profile) {
    return (
      <div className={classes.container}>
        <ApplicantProfileHeader
          profile={profile}
          width={photoWidth}
          readonly={readonly}
          height={photoHeight}
          dispatch={dispatch}
          onImageChange={(path) => {
              dispatch({
                type: 'newApplicantProfile/edit_section',
                payload: {
                  edit_action_type: 'edit_field',
                  params: {
                    section_key: 'personal_information',
                    field: 'photo',
                    new_value: path,
                  },
                }
              });
            }}
        />

        <ProfileForm
          template={profile.sections}
          getInfoFrom={profile.get_info_from}
          type="edit"
          readonly={readonly}
          currentUser={currentUser}
          region={region}
          dataType='applicantProfile'
          onUpdateRow={(sectionKey, rowData, rowIndex, row) => {
              dispatch({
                type: 'newApplicantProfile/edit_section',
                payload: {
                  edit_action_type: 'edit_row_fields',
                  params: {
                    section_key: sectionKey,
                    row_id: row.id,
                    fields: rowData,
                  }
                }
              });
              dispatch({
                type: 'jobapplicant/init',
                payload: {
                  edit_action_type: 'edit_row_fields',
                  params: {
                    section_key: sectionKey,
                    row_id: row.id,
                    fields: rowData,
                  }
                }
              });
            }}

          onDeleteRow={(sectionKey, rowIndex, row) => {
              dispatch({
                type: 'newApplicantProfile/edit_section',
                payload: {
                  edit_action_type: 'remove_row',
                  params: {
                    section_key: sectionKey,
                    row_id: row.id,
                  }
                }
              });
            }}

          onCreateRow={(sectionKey, rowData) => {
              dispatch({
                type: 'newApplicantProfile/edit_section',
                payload: {
                  edit_action_type: 'add_row',
                  params: {
                    section_key: sectionKey,
                    new_row: rowData
                  }
                }
              });
            }}

          onFieldValueChanged={(data, params) => {
              dispatch({
                type: 'newApplicantProfile/edit_section',
                payload: params
              });
            }}
          isCommitingProfile={false}

          finderEndpointType={{
              type: 'applicantProfile',
              id: profile.id
            }}
        />
      </div>

    );
  }else {
    return (
      <Spin spinning={loadingProfile}>
        <div className={classes.spinContainer}>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = ({
  newApplicantProfile: {
    profile,
    loadingProfile,
    readonly,
  },

  applicantProfiles: {
    photoWidth,
    photoHeight,
  },
  currentUser,
  region,
}) => ({
  profile,
  loadingProfile,
  readonly,
  photoWidth,
  photoHeight,
  currentUser,
  region,
});

export default connect(mapStateToProps)(
  injectIntl(EditApplicantProfilePage)
);
