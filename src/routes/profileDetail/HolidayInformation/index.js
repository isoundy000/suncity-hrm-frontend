import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col, Input } from 'antd';

import { getLocaleText } from 'locales/messages';
import FieldEditable from 'components/ProfileDetail/FieldEditable';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';
import MaskedInput from 'react-text-mask';

import classes from './index.less';

function HolidayInformation({intl, data, onSave}) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">{getLocaleText(data, intl.locale)}</div>
      </div>
      <div className="panel-body">
        <Row>
          <Col span={16}>
            {data.fields.map((field) => (
              <Col className="y-form-group" span={12} key={field.key}>
                <Col className="y-control-label" span={8}>
                  {getLocaleText(field, intl.locale)}
                </Col>
                <Col className="y-control" span={16}>
                  <div className="y-form-control-static"><YLemonFieldText field={field} /></div>
                </Col>
              </Col>
            ))}
          </Col>
          <Col span={8} className="holiday-calc">
            <div className="holiday-calc-container">
              <Row className="y-form-group y-form-group-horizontal">
                <Col span={8} className="y-control-label">
                  <span>截止日期</span>
                </Col>
                <Col span={16} className="y-control">
                  <MaskedInput
                    type="text"
                    className="y-form-control"
                    mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
                    placeholderChar={'\u2000'}
                    onChange={() => null}
                  />
                </Col>
              </Row>
              <Row className="y-form-group y-form-group-horizontal">
                <Col span={8} className="y-control-label">
                  <span>可申請年假</span>
                </Col>
                <Col span={16} className="y-control">
                  <Input className="y-form-control" type="number"/>
                  <span>天</span>
                </Col>
              </Row>
              <Row className="y-form-group y-form-group-horizontal">
                <Col span={8} className="y-control-label">
                  <span>可申請病假</span>
                </Col>
                <Col span={16} className="y-control">
                  <Input className="y-form-control" type="number"/>
                  <span>天</span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

HolidayInformation.propTypes = {
  data: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default injectIntl(HolidayInformation);
