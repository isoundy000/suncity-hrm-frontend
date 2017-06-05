/**
 * Created by meng on 16/9/6.
 */
import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'antd';
import { getLocaleText } from 'locales/messages';
import FieldEditable from 'components/ProfileDetail/FieldEditable';

import GetInfoFrom from './GetInfoFrom';

const YLemonFieldsSectionEditable = ({ intl, params, sectionData, onSave, currentUser, region, dataType, getInfoFrom }, context) => {

  console.log('wahhhhhhhhhhhh', sectionData);

  const rowHeight = 36;
  const fields = sectionData.fields.filter(f => f.type !== 'image'/* remove avatar */);

  const fieldsCount = fields.length;
  const rowCount = Math.ceil(fieldsCount / 2);
  const fullRowHeight = rowHeight * rowCount;

  const getInfoFromSection = (sectionData) => {
    console.log(getInfoFrom);
    return sectionData.key === 'position_to_apply' ?
           (
               <GetInfoFrom
                 onSave={onSave}
                 currentUser={currentUser}
                 getInfoFrom={getInfoFrom}
               />
           ) :
           null;
  }

  return(
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">{getLocaleText(sectionData, intl.locale)}</div>
      </div>
      <div className="panel-body">
        <Row style={{height: `${fullRowHeight}px`}}>
          {
            fields
              .map(field => (
                <Col className="y-form-group" span={12} key={field.key}>
                  <Col className="y-control-label" span={8} style={{overflow: 'hidden'}}>
                    {getLocaleText(field, intl.locale)}
                  </Col>
                  <Col className="y-control" span={16}>
                    <FieldEditable
                      field={field}
                      schema={sectionData.fields}
                      disabled= {(
                          context.readonly
                        || (dataType === 'applicantProfile' &&
                            region === 'macau' &&
                            currentUser.can.updateApplicantProfileInMACAU !== true)
                        || (dataType === 'applicantProfile' &&
                            region === 'manila' &&
                            currentUser.can.updateApplicantProfileInMANILA !== true)
                        || (dataType === 'profile' &&
                            region === 'macau' &&
                            currentUser.can.updateProfileInMACAU !== true)
                        || (dataType === 'profile' &&
                            region === 'manila' &&
                            currentUser.can.updateProfileInMANILA !== true)
                        || field.readonly === true
                        )}
                      onSave={(value) => {
                          return onSave(sectionData, {
                            edit_action_type: 'edit_field',
                            params: {
                              section_key: sectionData.key,
                              field: field.key,
                              new_value: value,
                            },
                          });
                        }}
                    />
                  </Col>
                </Col>
              ))
          }
        </Row>
        {
          getInfoFromSection(sectionData)
        }
      </div>
    </div>
  );
}

YLemonFieldsSectionEditable.contextTypes = {
  readonly: PropTypes.bool
};

YLemonFieldsSectionEditable.propTypes = {
  sectionData: PropTypes.shape({
    key: PropTypes.string.isRequired,
    chinese_name: PropTypes.string.isRequired,
    english_name: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      chinese_name: PropTypes.string.isRequired,
      english_name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.any,
    })).isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default injectIntl(YLemonFieldsSectionEditable);
