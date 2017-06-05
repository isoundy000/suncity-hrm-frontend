import React, { Component } from 'react';
import { Spin, Col, Form, Modal, Button, Rate, message, Input, Checkbox, Radio, Select, Tooltip, Icon } from 'antd';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';

function ScheduleModal({
  intl,
  form,
  ApplicantPositionDetail,
  allApplicantPositionDetailStatuses,
  scheduleModalStatus,
  onOk,
  onCancel
}) {

  const {getFieldDecorator} = form;
  const currentStatus = ApplicantPositionDetail.status;
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);


  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      onOk(data);
      form.resetFields();
    });
  }

  function handleOnCancel() {
    form.resetFields();
    onCancel();
  }

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    title: "進度",
    visible: scheduleModalStatus,
    onOk: handleOk,
    onCancel:handleOnCancel
  };

  const options = [];
  for (let i = 0; i < allApplicantPositionDetailStatuses.length; i++) {
    options.push(<Option key={i} value={allApplicantPositionDetailStatuses[i].key}>{getLocaleText(allApplicantPositionDetailStatuses[i], intl.locale)}</Option>);
  }

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };

  return (

    <Modal {...modalOpts}
           className={style.modalClass}
    >
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="進度"
        >
          {getFieldDecorator('status',{initialValue:currentStatus})(
            <Select id="select" size="large" style={{width: 200}}>
              {options}
            </Select>
          )}

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="備註"
        >
          {getFieldDecorator('comment')(
            <Input
              type="textarea" placeholder=""/>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(ScheduleModal));
