import { Card, Col, Form, InputNumber, Row } from "antd";
import React, { PropTypes } from 'react';

import _ from 'lodash';
import styles from "../../scheduleRuleDetail.less";

const InputNumberWithLabel = props => {
  const dispatch = props.dispatch;

  const {getFieldDecorator, getFieldError, isFieldValidating} = props.form;
  function request(value) {
    console.warn('start request')
    dispatch({
      type: "scheduleRuleDetail/setRouterInterval",
      payload: {
        type: props.type,
        grade: props.index,
        value: value
      }
    })
  }

  const debounce = _.debounce(request, 1000, true);

  const handleChange = (value) => {
    debounce(value);
  }

  return (
    <div className={styles.inputNumber} >
      <span className={styles.label}>職位{props.index}級：</span>
      <span className={styles.prefix}>{_.get(props,'prefix',null)}</span>
      {getFieldDecorator('vvv', { initialValue: props.value })(
        <InputNumber min={props.min} max={props.max} onChange={handleChange} />
      )}
      <span className={styles.unit}>{props.unit}</span>
    </div>

  );
};

export default Form.create()(InputNumberWithLabel);