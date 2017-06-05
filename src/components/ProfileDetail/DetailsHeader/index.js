import _ from 'lodash';
import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col, Upload, Icon } from 'antd';
import { getLocaleText } from 'locales/messages';

import classes from './index.less';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';
import ProfileAvatar from 'components/ProfileDetail/ProfileAvatar';

function DetailsHeader({ intl, data, dispatch, currentUser, onImageChange, readonly, region, dataType}) {

  const personalSection = data.find(section => section.key === 'personal_information');

  const positionSection = data.find(section => section.key === 'position_information');

  const photoField = personalSection.fields.find(field => field.key === 'photo');
  const chineseNameField = personalSection.fields.find(field => field.key === 'chinese_name');
  const englishNameField = personalSection.fields.find(field => field.key === 'english_name');
  const nicknameField = personalSection.fields.find(field => field.key === 'nick_name');

  const departmentField = positionSection.fields.find(field => field.key === 'department');
  const positionField = positionSection.fields.find(field => field.key === 'position');

  const mobileField = personalSection.fields.find(field => field.key === 'mobile_number');
  const empoidField = positionSection.fields.find(field => field.key === 'empoid');
  const locationField = positionSection.fields.find(field => field.key === 'location');
  const dateOfEmploymentField = positionSection.fields.find(field => field.key === 'date_of_employment');
  const employmentStatusField = positionSection.fields.find(field => field.key === 'employment_status');

  const headerItemFields = [
    empoidField,
    departmentField,
    mobileField,
    locationField,
    dateOfEmploymentField,
    employmentStatusField,
  ];

  return (
    <div className={classes.container}>
      <ProfileAvatar
        photoField={photoField}
        imageOnChange={(value) => {
            onImageChange(value);
          }}
        currentUser={currentUser}
        readonly = {readonly}
        region={region}
        dataType={dataType}
      />
      <div className="personal-summary">
        <div className="personal-summary-name">
          <YLemonFieldText className="personal-summary-name-chinese" field={chineseNameField} />
          <YLemonFieldText className="personal-summary-name-english" field={englishNameField} />
          <span className="personal-summary-name-nickname">(</span>
          <YLemonFieldText className="personal-summary-name-nickname" field={nicknameField} />
          <span className="personal-summary-name-nickname">)</span>
        </div>
        <div className="position-summary">
          <YLemonFieldText field={departmentField} />
          <YLemonFieldText field={positionField} />
        </div>
        <Row className="personal-summary-fields">
          {
            headerItemFields.map((field, index) => (
              <Col className="field" span={8} key={field.key}>
                <span className={`icon icon-${index + 1}`} />
                <span className="label">{getLocaleText(field, intl.locale)}</span>
                <YLemonFieldText className="value" field={field} />
              </Col>
            ))
          }
        </Row>
      </div>
    </div>
  );
}

DetailsHeader.propTypes = {
  data: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default injectIntl(DetailsHeader);
