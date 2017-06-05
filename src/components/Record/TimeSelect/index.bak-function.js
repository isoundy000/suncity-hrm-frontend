import { Cascader, Form } from 'antd';
import React, { Component } from 'react';

import { injectIntl } from "react-intl";
import moment from 'moment';

function TimeSelect({initValue, onChange, form}) {

  const { getFieldDecorator, getFieldError, isFieldValidating } = form;

  function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  let options = [];
  let children = [];
  for (let i = 0; i < 60; i++) {
    children.push({
      value: i,
      label: `${pad(i)} 分`,
    })
  }

  for (let i = 0; i < 48; i++) {
    if (i > 23) {
      options.push({
        value: i,
        label: `次日 ${pad(i - 24)} 时`,
        children: children
      })
    }
    if (i <= 23) {
      options.push({
        value: i,
        label: `${pad(i)} 时`,
        children: children
      })
    }
  }

  function onChangeMoment(value) {
    const HH = value[0];
    const mm = value[1];
    let time = moment();
    time.hour(HH);
    time.minute(mm);
    onChange(time);
  }

  function getTime() {
    console.warn('vvvvvvvvl',initValue);
    if (initValue !== null) {
      const HH = initValue.hour();
      const mm = initValue.minute();
      return [HH, mm]
    }
    return [8, 0];
  }

  // return (
  //   <div>
  //     {getFieldDecorator('vvv', { initialValue: getTime() })(
  //       <Cascader options={options} onChange={onChangeMoment} placeholder="请选择时间,必填" />
  //     )}
  //   </div>
  // )

  return (
    <div>
        <Cascader defaultValue={getTime()} options={options} onChange={onChangeMoment} placeholder="请选择时间,必填" />
    </div>
  )

}
export default Form.create()(injectIntl(TimeSelect));