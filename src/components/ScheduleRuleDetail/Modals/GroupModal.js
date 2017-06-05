import { Col, Form, Input, Modal, Row, Select } from "antd";
import React, { Component } from "react";

import { injectIntl } from "react-intl";
import { definedMessages as messages } from "../../../locales/messages";

function GroupModal({ state, dispatch, intl, form }) {

  const { getFieldDecorator, getFieldError, isFieldValidating } = form;
  const { formatMessage } = intl;
  const notNull = formatMessage(messages['app.job_application.not_null']);
  const stringRule = { rules: [{ 'required': true, message: notNull }] };
  const Option = Select.Option;
  const profiles = state.profiles;

  let children = [];
  if (profiles != null) {
    profiles.map(profile => {
      children.push(<Option key={profile.id}>{profile.chinese_name}</Option>)
    })
  }
  let modalData = {
    chinese_name: '',
    english_name: '',
    comment: '',
    member_user_ids: [],
    member_users: []
  }
  if (state.modalData != null) {
    modalData = state.modalData
  }
  const format = 'HH:mm';
  function handleOnSearch() {

  }

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...form.getFieldsValue() };
      console.warn('resulttt', data);
      if (state.editModal) {
        dispatch({
          type: 'scheduleRuleDetail/alterShiftGroups',
          payload: {
            data: data,
            shift_group_id: modalData.id,
            groupModalType: 'together'
          },
        });
      }

      if (!state.editModal) {
        dispatch({
          type: 'scheduleRuleDetail/createShiftGroups',
          payload: {
            data: data,
            groupModalType: 'together'
          },
        });
      }
      handleCancel();
    });
  }


  function handleCancel() {
    form.resetFields();
    dispatch({
      type: 'scheduleRuleDetail/hideModal',
      payload: {
        modalType: 'groupModal'
      }
    });
  }

  const modalOpts = {
    okText: "確認",
    // wrapClassName: style.verticalCenterModal,
    onOk: handleOk,
    title: "新增同更員工組",
    visible: state.groupModalStatus,
    onCancel: handleCancel,
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  return (
    <Modal {...modalOpts}>
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="中文組名"
          >
          {getFieldDecorator('chinese_name', { initialValue: modalData.chinese_name, ...stringRule })(
            <Input placeholder="请输入中文組名，必填" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="英文組名"
          >
          {getFieldDecorator('english_name', { initialValue: modalData.english_name, ...stringRule })(
            <Input placeholder="请输入英文組名，必填" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="組成員"
          hasFeedback
          required
          >
          <Col span="15">
            {getFieldDecorator('member_user_ids', {
              initialValue: modalData.member_user_ids,
              rules: [
                { required: true, message: notNull, type: 'array' },
              ]
            })(

              <Select
                multiple
                style={{ width: '100%' }}
                placeholder="Please select"
                >
                {children}
              </Select>
              )}
          </Col>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="備註"
          >
          {getFieldDecorator('comment', { initialValue: modalData.comment })(
            <Input type='textarea' />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(GroupModal));
