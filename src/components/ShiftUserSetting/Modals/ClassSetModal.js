import { Button, Col, DatePicker, Form, Icon, Input, Modal, Row, Select } from 'antd';
import React, { Component } from 'react';

import _ from "lodash";
import moment from "moment";
import styles from "../shiftUserSetting.less";

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
let uuid = 0;
const message = "该字段为必填";

class ClassSetModal extends Component {

  componentWillMount() {
    this.props.form.setFieldsValue({
      // keys: [0],
    });
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
    let children = [];
    if (shifts != null) {
      shifts.map(shift => {
        children.push(<Option key={shift.id} > {shift.chinese_name}</Option>)
      })
    }
    const dispatch = this.props.dispatch;
    let modalData = {};

    if (state.modalData == null) {
      modalData = {
        department: '',
        position: '',
        chinese_name: '',
        english_name: '',
        empoid: '',
        created_at: '',
        shift_user_settings_of_roster: {}
      };

    }
    if (state.modalData != null) {
      modalData = state.modalData;
    }

    const shift_user = modalData.shift_user_settings_of_roster;
    let init = {
      shift_interval: null,
      shift_special: null,
    }

    let initkeys = [];
    let shift_ids = [];
    if (shift_user != undefined) {
      if (shift_user.shift_special != undefined) {
        init.shift_special = shift_user.shift_special
        for (let i = 0; i < init.shift_special.length; i++) {
          initkeys.push(i)
          init.shift_special[i].shift_ids = init.shift_special[i].shift_ids.map(data => data.toString())
        }
      }
      if (shift_user.shift_interval != undefined) {
        init.shift_interval = shift_user.shift_interval;
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
                {getFieldDecorator(`shift_special_time-${k}`, {
                  initialValue: k < initkeys.length ? init.shift_special != null ?
                    [moment(init.shift_special[k].from), moment(init.shift_special[k].to)] : null : [],
                  rules: [{
                    required: true,
                    type: 'array',
                    message: message
                  }]
                })(
                  <RangePicker />
                  )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem
                {...formItemLayout2}
                label={'可排班别'}
                required={false}
                key={k}
                >
                {getFieldDecorator(`shift_special_class-${k}`, {
                  initialValue: k < initkeys.length ? init.shift_special != null ? init.shift_special[k].shift_ids : [] : [],
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
      let shift_special = [];
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }

        if (!err) {
          let num = 0;
          for (let value in values) {
            if (value.match('shift_special_time')) {
              shift_special.push(
                {
                  from: moment(values[value][0]).format("YYYY-MM-DD"),
                  to: moment(values[value][1]).format("YYYY-MM-DD"),
                }
              )
            }
            if (value.match('shift_special_class')) {
              shift_special[num].shift_ids = values[value].map(data => parseInt(data));
              num++;
            }
          }
          console.warn('result', shift_special);
          const shift_user_settings_of_roster = _.get(state.modalData, 'shift_user_settings_of_roster', null);
          if (shift_user_settings_of_roster == null) {
            dispatch({
              type: 'shiftUserSetting/createShiftUserSetting',
              payload: {
                data: {
                  user_id: modalData.id,
                  shift_interval: values.shift_interval,
                  shift_special: shift_special,
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
                  shift_interval: values.shift_interval,
                  shift_special: shift_special,
                }
              }
            })
          }
        }
      });
      this.props.form.resetFields();
      dispatch({
        type: 'shiftUserSetting/hideModal',
        payload: { modalType: 'classSetModal' }
      })
    }

    function handleOnCancel() {
      dispatch({
        type: 'shiftUserSetting/hideModal',
        payload: { modalType: 'classSetModal' }
      })
    }

    const modalOpts = {
      okText: "確認",
      onOk: handleOk,
      title: "本月排班設定",
      visible: state.classSetModalStatus,
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
          本月可排班別
        </div>

        <Form>
          <FormItem
            {...formItemLayout}
            label="本月排班"
            >
            {getFieldDecorator('shift_interval', {
              initialValue: init.shift_interval != null ? init.shift_interval : [],
              rules: [{
                required: true,
                type: 'array',
                message: message,
              }],
            })(
              <Select tags
                style={{ width: '100%' }}
                onChange={handleChange}
                >
                {children}
              </Select>
              )}
          </FormItem>

          {formItems}
          <FormItem {...formItemLayout2}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" />添加特殊时段
          </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ClassSetModal);
