import React, { Component, PropTypes } from 'react';
import { Element } from 'react-scroll';
import { connect } from 'dva';
import { Button, Spin } from 'antd';

import DetailsHeader from 'components/ProfileDetail/DetailsHeader';
import Menubar from 'components/ProfileDetail/Menubar';

import YLemonCollapseTable from 'components/YLemonCollapseTable';
import YLemonFieldsSectionEditable from 'components/YLemonFieldsSectionEditable';
import ProfileForm from 'components/ProfileForm';

import PersonalInformation from './PersonalInformation';
import PositionInformation from './PositionInformation';
import SalaryInformation from './SalaryInformation';
import HolidayInformation from './HolidayInformation';

import classes from './index.less';

function ProfileDetail({ profile, dispatch, currentUser, region, roleGroup, allRoleGroup, modalVisible, clickSource }) {
  const onUpdateRow = (sectionKey, rowData, rowIndex, row) => {
    dispatch({
      type: 'profileDetail/edit_section',
      payload: {
        edit_action_type: 'edit_row_fields',
        params: {
          section_key: sectionKey,
          row_id: row.id,
          fields: rowData,
        }
      }
    });
  };

  const onDeleteRow = (sectionKey, rowIndex, row) => {
    dispatch({
      type: 'profileDetail/edit_section',
      payload: {
        edit_action_type: 'remove_row',
        params: {
          section_key: sectionKey,
          row_id: row.id,
        }
      }
    });
  };

  const onCreateRow = (sectionKey, rowData) => {
    dispatch({
      type: 'profileDetail/edit_section',
      payload: {
        edit_action_type: 'add_row',
        params: {
          section_key: sectionKey,
          new_row: rowData
        }
      }
    });
  };

  const onFieldValueChanged = (data, params) => {
    dispatch({
      type: 'profileDetail/edit_section',
      payload: params
    });
  };
  /*判断点击来源*/
  let readonly = true;

  if(clickSource === "myprofile"){
    readonly = true;
  }else{
    readonly = false;
  }

  if(!profile){
    return (
      <Spin>
        <div className={classes.spinContainer}>
        </div>
      </Spin>
    );
  }else{
    return (
      <div className={classes.content}>
        <DetailsHeader
          data={profile.sections}
          dispatch={dispatch}
          currentUser={currentUser}
          onImageChange={(path) => {
              dispatch({
                type: 'profileDetail/edit_section',
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
          readonly = {readonly}
          region={region}
          dataType='profile'
        />

        <div className={classes.wrapper}>
          <ProfileForm
            template={profile.sections}
            type="edit"
            currentUser={currentUser}
            region={region}
            dataType='profile'
            roleGroup={roleGroup}
            allRoleGroup={allRoleGroup}
            modalVisible={modalVisible}
            dispatch={dispatch}
            finderEndpointType={{
                type: 'profile',
                id: profile.id
              }}
            onUpdateRow={onUpdateRow}
            onDeleteRow={onDeleteRow}
            onCreateRow={onCreateRow}
            onFieldValueChanged={onFieldValueChanged}
            readonly= {(clickSource === "myprofile" )? true : false }
          />
        </div>
      </div>

    );
  }
}

ProfileDetail.propTypes = {
  profile: PropTypes.object,
};

const mapStateToProps = ({
  profileDetail: {
    profile,
    roleGroup,
    allRoleGroup,
    modalVisible,
    clickSource,
  },
  currentUser,
  region,
}) => ({
  profile,
  roleGroup,
  allRoleGroup,
  modalVisible,
  clickSource,
  currentUser,
  region,
});

export default connect(mapStateToProps)(ProfileDetail);
