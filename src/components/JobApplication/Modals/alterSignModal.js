import React, { Component } from 'react';
import {
  Col,
  Form,
  Modal,
  Input,
  Checkbox,
} from 'antd';

import MaskedInput from 'react-text-mask';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import {getLocaleText, definedMessages as messages} from '../../../locales/messages';
import ApplicantInfo from '../Modals/common/applicantInfo';

const InputGroup = Input.Group;

function AlterSignModal({
  currentInterviewModalData,
  intl,
  alterSignModalStatus,
  ApplicantPositionDetail,
  showModal,
  applicantProfiles,
  form,
  onOk,
  onCancel
}) {

  if (currentInterviewModalData != null) {
    var date = currentInterviewModalData.time.substring(0, 10);
    var time = currentInterviewModalData.time.substring(10);
    var comment = currentInterviewModalData.comment;
  }
  const {getFieldDecorator} = form;
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const notNull = formatMessage(messages['app.job_application.not_null']);


  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.sign_id = currentInterviewModalData.id;
      data.applicant_position_id = currentInterviewModalData.applicant_position_id;
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

  const interviewerOptions = [];

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    // onOk: handleOk,
    title: "修改签约",
    visible: alterSignModalStatus,
    onOk: handleOk,
    onCancel: handleOnCancel
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };
  const formItemLayout2 = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };

  const person_info = applicantProfiles.sections.find(section => section.key === 'personal_information');
  let genderObj = person_info.fields.find(field => field.key === 'gender');
  genderObj = genderObj.select.options.find(field =>field.key == genderObj.value);
  const gender = getLocaleText(genderObj, intl.local);

  return (
    <Modal {...modalOpts}
      className={style.modalClass}
    >
      <Form horizontal>
        <ApplicantInfo applicantProfiles={applicantProfiles} ApplicantPositionDetail={ApplicantPositionDetail}/>
        <div className={style.modalContentTitle}>
          面試信息
        </div>

        <FormItem
          {...formItemLayout}
          label="签约时间"
          required
        >
          <InputGroup size="large">
            <Col span="12">
              {getFieldDecorator('date', {initialValue: date, rules: [{required: true,message:notNull}]})(
                 <MaskedInput
                   type="text"
                   className="y-form-control"
                   mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
                   placeholderChar={'\u2000'}
                 />
               )}

            </Col>
            <Col span="12">
              <FormItem>
                {getFieldDecorator('time', {initialValue: time, rules: [{required: true,message:notNull}]})(
                  <MaskedInput
                    type="text"
                    className="y-form-control"
                    mask={[/\d/, /\d/, ':', /\d/, /\d/, '-', /\d/, /\d/, ':', /\d/, /\d/]}
                    placeholderChar={'\u2000'}
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
          {getFieldDecorator('comment', {initialValue: comment})(
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

export default Form.create()(injectIntl(AlterSignModal));
