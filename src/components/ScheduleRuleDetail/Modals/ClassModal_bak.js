import { Cascader, Form, Input, InputNumber, Modal, TimePicker } from "antd";
import React, { Component } from "react";

import TimeSelect from '../../Record/TimeSelect';
import _ from 'lodash';
import { injectIntl } from "react-intl";
import { definedMessages as messages } from "../../../locales/messages";
import moment from 'moment';

class ClassModal extends Component {
  constructor(props) {
    super(props);
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
    }
  }

  handleStartTime(value) {
    console.log('startTime', value);
    this.setState({
      startTime: value
    })
  }

  handleEndTime(value) {
    this.setState({
      endTime: value

    })
  }

  handleCancel() {
    const {state, dispatch, intl, form} = this.props;
    form.resetFields();
    dispatch({
      type: 'scheduleRuleDetail/hideModal',
      payload: {
        modalType: 'classModal'
      }
    });
  }

  handleOk() {
    const {state, dispatch, intl, form} = this.props;
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...form.getFieldsValue() };

      data.start_time = this.state.startTime;
      data.end_time = this.state.endTime;
      console.log('this is fomr', data);

      if (state.editModal) {
        dispatch({
          type: 'scheduleRuleDetail/alterRosterShifts',
          payload: {
            shift_id: modalData.id,
            data: data
          }
        });
      }
      if (!state.editModal) {
        dispatch({
          type: 'scheduleRuleDetail/createRosterShifts',
          payload: { data: data }
        });
      }
      this.setState={};
      this.handleCancel();
    });
  }

  render() {
    const {state, dispatch, intl, form} = this.props;
    const { getFieldDecorator, getFieldError, isFieldValidating } = form;
    const { formatMessage } = intl;
    const notNull = formatMessage(messages['app.job_application.not_null']);
    const format = 'HH:mm';
    let modalData = {
      chinese_name: '',
      english_name: '',
      start_time: '',
      end_time: '',
      min_workers_number: 1,
      min_3_leval_workers_number: 0,
      min_4_leval_workers_number: 0,
    }

    if (state.modalData != null) {
      console.log('modalData');
      modalData = state.modalData
    }

    const initStartTime = modalData.start_time == '' ? null : moment(modalData.start_time);
    const initEndTime = modalData.end_time == '' ? null : moment(modalData.end_time);

    const modalOpts = {

      okText: "確認",
      // wrapClassName: style.verticalCenterModal,
      onOk: this.handleOk,
      title: "新增班別",
      visible: state.classModalStatus,
      onCancel: this.handleCancel,
    };

    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const require = [{ required: true, message: "不能为空" }];
    const requireMoment = [{ required: true, message: "不能为空", type: 'object' }];
    const requireNumber = [{ required: true, message: "不能为空", type: 'number' }];




    return (
      <Modal {...modalOpts}>
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            label="班别中文名"
            >
            {getFieldDecorator('chinese_name', { initialValue: modalData.chinese_name, rules: require })(
              <Input placeholder="请输入班别中文名，必填" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="班別英文名"
            >
            {getFieldDecorator('english_name', { initialValue: modalData.english_name, rules: require })(
              <Input placeholder="请输入班别英文名，必填" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="開始時間"
            required
            >
            <TimeSelect onChange={this.handleStartTime} initValue={initStartTime} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="結束時間"
            required
            >
            <TimeSelect onChange={this.handleEndTime} initValue={initEndTime} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="最少員工數"
            >
            {getFieldDecorator('min_workers_number', { initialValue: modalData.min_workers_number, rules: requireNumber })(
              <InputNumber min={1} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="最少3級員工數"
            >
            {getFieldDecorator('min_3_leval_workers_number', { initialValue: modalData.min_3_leval_workers_number, rules: requireNumber })(
              <InputNumber min={0} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="最少4級員工數"
            >
            {getFieldDecorator('min_4_leval_workers_number', { initialValue: modalData.min_4_leval_workers_number, rules: requireNumber })(
              <InputNumber min={0} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(injectIntl(ClassModal));
