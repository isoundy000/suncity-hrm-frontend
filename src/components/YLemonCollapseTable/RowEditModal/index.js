/**
 * Created by meng on 16/9/1.
 */

import _ from 'lodash';
import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, Row, Col, message } from 'antd';
import { getLocaleText } from 'locales/messages';
import classNames from 'classnames';

import Field from 'components/ProfileDetail/Field';
import classes from './index.less';


class RowEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: this.getDefaultRowData(props),
    };
  }

  getDefaultRowData(props) {
    const defaultRowData = {};
    const { sectionTemplate } = props;
    for (let field of sectionTemplate.schema) {
      if (!_.isEmpty(field.default)) {
        defaultRowData[field.key] = field.default;
      }
      if (props.defaultRowData && !_.isEmpty(props.defaultRowData[field.key])) {
        defaultRowData[field.key] = props.defaultRowData[field.key];
      }
      if (field.key === 'record_date') {
        defaultRowData[field.key] = this.getNowDate();
      }
    }
    return defaultRowData;
  }

  handleChange(key, value) {
    this.setState({
      rowData: _.merge({}, this.state.rowData, { [key]: value }),
    });
  }

  isDate(date) {
    return isNaN(new Date(date));
  }

  getNowDate() {
    const Now = new Date();
    const Year = Now.getFullYear();
    let Month = Now.getMonth() +1;
    let Day = Now.getDate();
    if (Month >= 1 && Month <= 9) {
        Month = "0" + Month;
    }
    if (Day >= 0 && Day <= 9) {
        Day = "0" + Day;
    }
    return [Year, Month, Day].join('/');
  }

  handleConfirm() {
    const invalidFields = this.props.sectionTemplate.schema.filter(field => {
      return field.required && _.isEmpty(this.state.rowData[field.key]);
    });
    const invalidDate = this.props.sectionTemplate.schema.filter(field => {
      if(field.type === 'date') {
        if(!field.required && _.isEmpty(this.state.rowData[field.key])) {
          return false;
        } else {
          return this.isDate(this.state.rowData[field.key]);
        }
      }
      else return false;
    });
    if (invalidFields.length === 0) {
      if(invalidDate.length === 0) {
        this.props.onConfirm(this.state.rowData);
      } else {
        message.error('保存失敗，請查看日期是否填寫正確。');
      }
    } else {
      message.error('保存失敗，請查看必填內容是否填寫。');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        rowData: this.getDefaultRowData(nextProps),
      });
    }
  }

  render() {
    const { className, intl, visible, sectionTemplate, onCancel } = this.props;
    return (
      <Modal
        okText= "確認"
        className={classNames(classes.container, 'table-modal', className)}
        title={getLocaleText(sectionTemplate, intl.locale)}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm.bind(this)}
      >
        {
          sectionTemplate.schema.map(field => (
            <Row className="y-form-group" key={field.key}>
              <Col className="y-control-label" span={9}>
                {field.required && <span className="y-required">*</span>}
                {getLocaleText(field, intl.locale)}
              </Col>
              <Col className="y-control" span={15}>
                <Field
                  field={field}
                  schema={sectionTemplate.schema}
                  resetValue={this.state.rowData[field.key] || field.default}
                  onChange={value => this.handleChange(field.key, value)}
                  disabled={field.key === 'record_date'}
                />
              </Col>
            </Row>
          ))
        }
      </Modal>
    );
  }
}

RowEditModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  sectionTemplate: PropTypes.shape({
    schema: PropTypes.array.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  defaultRowData: PropTypes.object,
}

export default injectIntl(RowEditModal);
