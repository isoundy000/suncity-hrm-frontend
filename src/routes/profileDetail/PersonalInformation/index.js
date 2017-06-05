import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'antd';
import { getLocaleText } from 'locales/messages';
import FieldEditable from 'components/ProfileDetail/FieldEditable';

const PersonalInformation = ({ intl, data, onSave }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">{getLocaleText(data, intl.locale)}</div>
    </div>
    <div className="panel-body">
      <Row>
        {
          data
            .fields
            .filter(f => f.type !== 'image'/* remove avatar */)
            .map(field => (
              <Col className="y-form-group" span={12} key={field.key}>
                <Col className="y-control-label" span={8}>
                  {getLocaleText(field, intl.locale)}
                </Col>
                <Col className="y-control" span={16}>
                  <FieldEditable
                    field={field}
                    schema={data.fields}
                    onSave={(value) => {
                      return onSave(data, {
                        edit_action_type: 'edit_field',
                        params: {
                          section_key: data.key,
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
    </div>
  </div>
);

PersonalInformation.propTypes = {
  data: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default injectIntl(PersonalInformation);