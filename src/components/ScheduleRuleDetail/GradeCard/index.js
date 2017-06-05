import { Card, Col, InputNumber, Row } from "antd";
import React, { Component } from "react";

import InputNumberWithLabel from "./InputNumberWithLabel";
import _ from "lodash";
import styles from "../scheduleRuleDetail.less";

class GradeCard extends React.Component {

  constructor(props) {
    super(props);
    this.de = _.debounce(this.test, 1000, true);
  }

  test() {
    const {title, index, value} = this.state;
    console.warn('发送请求了', this.state);
  }

  label(index) {
    let value = null;
    if (this.props.state.rosterDetail != null) {
      value = _.get(this.props.state.rosterDetail[this.props.type], index, null);
    }
    return (
      <Col span={8} key={index}>
        <InputNumberWithLabel
          type={this.props.type}
          min={this.props.range.min}
          max={this.props.range.max}
          prefix = {this.props.prefix}
          unit={this.props.unit}
          index={index}
          state={this.props.state}
          dispatch={this.props.dispatch}
          value={value}
          />
      </Col>
    )
  };

  forLabel(index, title) {
    let array = new Array();
    for (let i = 1; i <= index; i++) {
      array.push(this.label(i));
    }
    return array;
  };

  render() {
    const { title, range, unit } = this.props;

    return (
      <div>
        <Card title={title} className={styles.gradeCard}>
          <Row>
            {this.forLabel(6)}
          </Row>
        </Card>
      </div>
    )
  }
}

export default GradeCard;