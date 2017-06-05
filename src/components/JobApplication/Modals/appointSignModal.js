import React, { Component } from 'react';
import {
  Col,
  Form,
  Modal,
  Input,
  Checkbox,
} from 'antd';
import style from '../jobApplication.less';

import MaskedInput from 'react-text-mask';
import ApplicantInfo from '../Modals/common/applicantInfo';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';

function AppointSignModal({
  showModal,
  ApplicantPositionDetail,
  applicantProfiles,
  form,
  appointSignModalStatus,
  onOk,
  onCancel,
  intl
}) {

  const InputGroup = Input.Group;

  const {getFieldDecorator} = form;
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.time = data.date + '' + data.time;
      delete data.date;
      onOk(data);
      if (data.need_sms === true) {
        showModal('smsModal', data.time);
      }
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
    title: "預約簽約",
    visible: appointSignModalStatus,
    onOk: handleOk,
    onCancel: handleOnCancel
  };


  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };

  const person_info = applicantProfiles.sections.find(section => section.key === 'personal_information');
  const gender = person_info.fields.find(field => field.key === 'gender').value;

  return (
    <Modal {...modalOpts}
      className={style.modalClass}
    >
      <Form horizontal>

        <ApplicantInfo applicantProfiles={applicantProfiles} ApplicantPositionDetail={ApplicantPositionDetail}/>

        <div className={style.modalContentTitle}>
          簽約信息
        </div>

        <FormItem className="required"
          {...formItemLayout}
          label="簽約時間"
        >
          <InputGroup size="large">
            <Col span="12">
              <FormItem>
                {getFieldDecorator('date', {initialValue: '', rules: [{required: true, message: "该字段不能为空"}]})(
                   <MaskedInput
                     type="text"
                     className="y-form-control"
                     mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
                     placeholderChar={'\u2000'}
                     placeholder="_____/ ___/ ___"
                   />
                 )}
              </FormItem>
            </Col>

            <Col span="12">
              <FormItem>
                {getFieldDecorator('time', {initialValue: '', rules: [{required: true, message: "该字段不能为空"}]})(
                   <MaskedInput
                     type="text"
                     className="y-form-control"
                     mask={[/\d/, /\d/, ':', /\d/, /\d/, '-', /\d/, /\d/, ':', /\d/, /\d/]}
                     placeholderChar={'\u2000'}
                     placeholder="__:__ - __:__"
                   />
                 )}
              </FormItem>
            </Col>
          </InputGroup>

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="備註"
        >
          {getFieldDecorator('comment')(
             <Input type="textarea" rows={5}/>
           )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('need_sms', {initialValue: true, valuePropName: 'checked'})(
             <Checkbox>需要發送SMS</Checkbox>
           )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(AppointSignModal));
