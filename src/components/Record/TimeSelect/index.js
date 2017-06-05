import { Cascader, Form } from 'antd';
import React, { Component } from 'react';

import { injectIntl } from "react-intl";
import moment from 'moment';

function pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}

class TimeSelect extends Component {
  constructor(props) {
    super(props);

    const {initValue} = props;
    if (initValue !== null) {
      const HH = initValue.hour();
      const mm = initValue.minute();
      this.state = {
        time: [HH, mm]
      }
    } else {
      this.state = {
        time: null
      }

    }
    this.onChangeMoment = this.onChangeMoment.bind(this);
  }

  onChangeMoment(value) {
    this.setState({
      time: value
    });
    const {onChange} = this.props;

    const HH = value[0];
    const mm = value[1];
    let time = moment();
    time.hour(HH);
    time.minute(mm);
    onChange(time);
  }

  componentWillReceiveProps(nextProps) {
    const {initValue} = nextProps;
    if (initValue !== null) {
      const HH = initValue.hour();
      const mm = initValue.minute();
      this.setState({
        time: [HH, mm]
      })
    } else {
      this.setState({
        time: null
      })
    }
  }

  render() {
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

    return (
      <div>
        <Cascader
          value={this.state.time}
          options={options}
          onChange={this.onChangeMoment}
          placeholder="请选择时间,必填" />
      </div>
    );
  }
}
export default Form.create()(injectIntl(TimeSelect));