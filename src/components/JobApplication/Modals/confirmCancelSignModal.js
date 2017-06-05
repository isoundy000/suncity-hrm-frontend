import React, { Component } from 'react';
import {
  Form,
  Modal,
  Input,
  Checkbox,
} from 'antd';

import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';
import ApplicantInfo from '../Modals/common/applicantInfo';

function confirmCancelSignModal({
  currentInterviewModalData,
  intl,
  confirmCancelSignModalStatus,
  ApplicantPositionDetail,
  showModal,
  applicantProfiles,
  form,
  onOk,
  onCancel
}) {
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  if (currentInterviewModalData != null) {
    var time = currentInterviewModalData.time;
    var comment = currentInterviewModalData.comment;
  }
  const {getFieldDecorator} = form;

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.interview_id = currentInterviewModalData.id;
      data.applicant_position_id = currentInterviewModalData.applicant_position_id;
      data.status = 'cancelled';
      if (data.need_sms === true) {
        showModal('smsModal', currentInterviewModalData.time);
      }
      onOk(data);
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
    title: "確認取消签约",
    visible: confirmCancelSignModalStatus,
    onOk: handleOk,
    onCancel: handleOnCancel
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
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
        <div className={style.modalErrorMessage}>
          取消該簽約後，數據將不能恢復！
        </div>
        <ApplicantInfo applicantProfiles={applicantProfiles} ApplicantPositionDetail={ApplicantPositionDetail}/>
        <div className={style.modalContentTitle}>
          簽約信息
        </div>

        <FormItem
          {...formItemLayout}
          label="签约时间"
        >
          <span>{time}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="備注"
        >
          <span>{comment}</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="取消原因"
        >
          {getFieldDecorator('cancel_reason', {initialValue: ' '})(
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

export default Form.create()(injectIntl(confirmCancelSignModal));
