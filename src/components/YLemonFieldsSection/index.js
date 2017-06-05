/**
 * Created by meng on 16/9/6.
 */

import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { getLocaleText } from 'locales/messages';

import Field from 'components/ProfileDetail/Field';
import AvatarUploader from './AvatarUploader';
import classes from './index.less';

import GetInfoFrom from '../YLemonFieldsSectionEditable/GetInfoFrom';

class YLemonFieldsSection extends Component {


  sectionHeader() {
    const { intl, sectionTemplate } = this.props;

    return (
      <div className="panel-heading">
        <div className="panel-title">{getLocaleText(sectionTemplate, intl.locale)}</div>
      </div>
    );
  }

  sectionBody() {
    const { intl, sectionTemplate, onFieldValueChanged, dispatch } = this.props;

    const onSave = (data, params) => {
      dispatch({
        type: 'newApplicantProfile/setGetInfoFrom',
        payload: {
          getInfoFrom: params,
        },
      });
    }

    const getInfoFrom = (sectionData) => {
      return sectionData.key === 'position_to_apply' ?
             (
               <GetInfoFrom
                 onSave={onSave}
                 currentUser={this.props.currentUser}
                 getInfoFrom={this.props.getInfoFrom}
               />
             ) :
             null;
    }

    return (
      <div>
        <Row>
          {
            sectionTemplate.fields
                           .filter(field => field.type !== 'alias' && field.type !== 'image')
                           .map((field) => {
                             const defaultValue = _.get(sectionTemplate, `field_values.${field.key}`)

                             return (
                               <Col className="y-form-group" span={12} key={field.key}>
                                 <Col className="y-control-label" span={9}>
                                   {field.required && <span className="y-required">*</span>}
                                   {getLocaleText(field, intl.locale)}
                                 </Col>

                                 <Col className="y-control" span={15}>
                                   <Field
                                     field={field}
                                     schema={sectionTemplate.fields}
                                     resetValue={defaultValue}
                                     onChange={
                                       (value) => onFieldValueChanged(sectionTemplate.key, field.key, value)
                                              }
                                   />
                                 </Col>
                               </Col>
                             );
                           })
          }
        </Row>

        {
          getInfoFrom(sectionTemplate)
        }
      </div>
    );
  }

  personalInformationBody() {
    const { onFieldValueChanged, sectionTemplate } = this.props;
    const photoField = sectionTemplate.fields.find(field => field.key == 'photo');
    return (
      <div>
        <Row gutter={16}>
          <Col span={3}>
            <AvatarUploader
              photoField={photoField}
              onFieldValueChanged={onFieldValueChanged}
              className={classes['personal-avatar']}
            />
          </Col>

          <Col span={21}>
            {this.sectionBody()}
          </Col>
        </Row>
      </div>
    );
  }

  isPersonalInformation() {
    const { sectionTemplate } = this.props;
    const sectionKey = sectionTemplate.key;

    return sectionKey == 'personal_information';
  }

  render() {
    return (
      <div className="panel">
        {this.sectionHeader()}
        <div className="panel-body">
          {
            (this.isPersonalInformation())
              ? this.personalInformationBody()
              : this.sectionBody()
          }
        </div>
      </div>
    );
  }
}

YLemonFieldsSection.propTypes = {
  sectionTemplate: PropTypes.shape({
    key: PropTypes.string.isRequired,
    chinese_name: PropTypes.string.isRequired,
    english_name: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
  }).isRequired,
  onFieldValueChanged: PropTypes.func.isRequired,
};

export default injectIntl(YLemonFieldsSection);
