import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'antd';
import { getLocaleText } from 'locales/messages';
import FieldEditable from 'components/ProfileDetail/FieldEditable';

import classes from './index.less';

function SalaryInformation({intl, data}) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">{getLocaleText(data, intl.locale)}</div>
      </div>
      <div className="panel-body">
        <div className={classes.bar}>
          <div className={classes.barDate}><span className="text-warning">生效日期自</span></div>
        </div>
        <Row>
          {data.fields.map((field) => (
            <Col className="y-form-group" span={12} key={field.key}>
              <Col className="y-control-label" span={8}>
                {getLocaleText(field, intl.locale)}
              </Col>
              <Col className="y-control" span={16}>
                <div className="y-form-control-static">{field.value}</div>
              </Col>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

SalaryInformation.propTypes = {
  data: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
};

export default injectIntl(SalaryInformation);
