import { Button, Col, DatePicker, Form, Icon, Input, Modal, Row, Select } from 'antd';
import React, { Component } from 'react';

import _ from "lodash";
import moment from "moment";
import styles from "../shiftUserSetting.less";

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
let uuid = 0;
const message = "该字段为必填";

class HolidaySetModal extends Component {

  componentWillMount() {
    this.props.form.setFieldsValue({
    });
    this.setState({
    })
  }

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    uuid++;
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const formItemLayout2 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const Option = Select.Option;

    const state = this.props.shiftUserSetting;
    const shifts = state.shifts;
    const children = [
      <Option key="1">每週一</Option>,
      <Option key="2">每週二</Option>,
      <Option key="3">每週三</Option>,
      <Option key="4">每週四</Option>,
      <Option key="5">每週五</Option>,
      <Option key="6">每週六</Option>,
      <Option key="7">每週日</Option>,
    ];
    const dispatch = this.props.dispatch;
    let modalData = {
    };
    if (state.modalData == null) {
      modalData = {
        department: '',
        position: '',
        chinese_name: '',
        english_name: '',
        empoid: '',
        created_at: '',
        shift_user_settings_of_roster: ''
      };

    }
    if (state.modalData != null) {
      modalData = state.modalData;
    }

    const shift_user = modalData.shift_user_settings_of_roster;
    let init = {
      rest_interval: null,
      rest_special: null,
    }

    let initkeys = [];
    if (shift_user != undefined) {
      if (shift_user.rest_special != undefined) {
        init.rest_special = shift_user.rest_special
        for (let i = 0; i < init.rest_special.length; i++) {
          initkeys.push(i)
          init.rest_special[i].wdays = init.rest_special[i].wdays.map(data => data.toString())
        }
      }
      if (shift_user.rest_interval != undefined) {
        init.rest_interval = shift_user.rest_interval.map(data => data.toString());
      }
    }

    getFieldDecorator('keys', { initialValue: initkeys });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <div key={index}>
          <Row>
            <Col span={11}>
              <FormItem
                {...formItemLayout2}
                label="時間段"
                >
                {getFieldDecorator(`rest_special_time-${k}`, {
                  initialValue: k < initkeys.length ? init.rest_special != null ?
                    [moment(init.rest_special[k].from), moment(init.rest_special[k].to)] : null : [],
                  rules: [{
                    required: true,
                    type: 'array',
                    message:message
                  }]
                })(
                  <RangePicker />
                  )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem
                {...formItemLayout2}
                label={'可排'}
                required={false}
                key={k}
                >
                {getFieldDecorator(`rest_special_class-${k}`, {
                  initialValue: k < initkeys.length ? init.rest_special != null ? init.rest_special[k].wdays : [] : [],
                  rules: [{
                    required: true,
                    type: 'array',
                    message: message,
                    whitespace: true,
                  }],
                })(
                  <Select tags
                    style={{ width: '100%' }}
                    searchPlaceholder="标签模式"
                    >
                    {children}
                  </Select>
                  )}
              </FormItem>
            </Col>

            <Col span={2}>
              <Icon
                className="dynamic-delete-button"
                style={{ fontSize: '18px', marginTop: '16px', }}
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
                />
            </Col>
          </Row>
        </div>
      );
    });

    const handleChange = (value) => {
      let secondChildren = shifts.filter(shift => {
        value.indexOf(shift.id.toString()) != '-1' ? true : false
      })
    }
    const handleOk = () => {
      let rest_special = [];
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if (!err) {
          let num = 0;
          let wdays = [];
          for (let value in values) {
            if (value.match('rest_special_time')) {
              rest_special.push(
                {
                  from: moment(values[value][0]).format("YYYY-MM-DD"),
                  to: moment(values[value][1]).format("YYYY-MM-DD"),
                }
              )
            }
            if (value.match('rest_special_class')) {
              rest_special[num].wdays = values[value].map(day => parseInt(day));
              num++;
            }
          }
          console.warn('result', rest_special);
          const shift_user_settings_of_roster = _.get(state.modalData, 'shift_user_settings_of_roster', null);
          if (shift_user_settings_of_roster == null) {
            dispatch({
              type: 'shiftUserSetting/createShiftUserSetting',
              payload: {
                data: {
                  user_id: modalData.id,
                  rest_interval: values.rest_interval.map(data => parseInt(data)),
                  rest_special: rest_special,
                }
              }
            })
          }
          if (shift_user_settings_of_roster != null) {
            dispatch({
              type: 'shiftUserSetting/updateShiftUserSetting',
              payload: {
                data: {
                  id: modalData.shift_user_settings_of_roster.id,
                  rest_interval: values.rest_interval.map(data => parseInt(data)),
                  rest_special: rest_special,
                }
              }
            })
          }
        }

      });

      this.props.form.resetFields();
      dispatch({
        type: 'shiftUserSetting/hideModal',
        payload: { modalType: 'holidaySetModal' }
      })
    }

    function handleOnCancel() {
      dispatch({
        type: 'shiftUserSetting/hideModal',
        payload: { modalType: 'holidaySetModal' }
      })
    }

    const modalOpts = {
      okText: "確認",
      onOk: handleOk,
      title: "本月公休设定",
      visible: state.holidaySetModalStatus,
      onCancel: handleOnCancel
    };

    return (
      <Modal {...modalOpts}>
        <div>
          <div className={styles.modalContentTitle}>
            員工信息
          </div>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="部門"
                >
                <span>{modalData.department}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="職位"
                >
                <span>{modalData.position}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="中文姓名" >
                <span>{modalData.chinese_name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="英文姓名" >
                <span>{modalData.english_name}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="員工編號"
                >
                <span>{modalData.empoid}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="入職日期"
                >
                <span>{moment(modalData.created_at).format('YY/MM/DD')}</span>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div className={styles.modalContentTitle}>
          公休设定
        </div>

        <Form>
          <FormItem
            {...formItemLayout}
            label="本月公休"
            >
            {getFieldDecorator('rest_interval', {
              initialValue: init.rest_interval != null ? init.rest_interval : []
            })(
              <Select tags
                style={{ width: '100%' }}
                onChange={handleChange}
                tokenSeparators={[',']}
                >
                {children}
              </Select>
              )}
          </FormItem>

          {formItems}
          <FormItem {...formItemLayout2}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加特殊时段
          </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(HolidaySetModal);
