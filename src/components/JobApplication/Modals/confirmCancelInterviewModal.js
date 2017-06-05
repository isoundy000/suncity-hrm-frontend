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

function ConfirmCancelInterviewModal({
  intl,
  currentInterviewModalData,
  ApplicantPositionDetail,
  showModal,
  applicantProfiles,
  form,
  confirmCancelInterviewModalStatus,
  onOk,
  onCancel,
  dispatch,
}) {

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
      data.interview_id = currentInterviewModalData.id;
      data.applicant_position_id = currentInterviewModalData.applicant_position_id;
      data.result = 'cancelled';
      if (data.need_email === true) {
        showModal('emailModal', data.interview_id);

        const interviewers = currentInterviewModalData.interviewer_users.map(item => item.email);
        dispatch({
          type: 'jobApplication/updateInitialEmail',
          payload: {
            emails: interviewers,
          },
        });
      }
      if (data.need_sms === true) {
        showModal('smsModal');
      }
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
    title: "确认取消面試",
    visible: confirmCancelInterviewModalStatus,
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

  if (currentInterviewModalData != null) {
    var comment = currentInterviewModalData.comment;
    var mark = currentInterviewModalData.mark;
    var interviewer_users = currentInterviewModalData.interviewer_users;
    var time = null;
    if (currentInterviewModalData.time != null) {
      time = currentInterviewModalData.time.substring(0, 10) + "\u00a0\u00a0" + currentInterviewModalData.time.substring(10);
    }
  }

  return (
    <Modal {...modalOpts}
      className={style.modalClass}
    >
      <Form horizontal>
        <div className={style.modalErrorMessage}>
          取消該面試後，數據將不能恢復！
        </div>

        <ApplicantInfo applicantProfiles={applicantProfiles} ApplicantPositionDetail={ApplicantPositionDetail}/>

        <div className={style.modalContentTitle}>
          面試信息
        </div>

        <FormItem
          {...formItemLayout}
          label="面試輪次"
        >
          <span>{mark}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試時間"
        >
          <span>{time}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試官"
        >
          <span>{interviewer_users != null ? interviewer_users.map(item=>item.chinese_name) : null}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="備註"
        >
          <p>
            {comment}
          </p>
        </FormItem>

        <div className={style.modalContentTitle}>
          取消面試
        </div>

        <FormItem
          {...formItemLayout}
          label="取消原因"
        >
          {getFieldDecorator('cancel_reason')(
             <Input type="textarea" placeholder=""/>
           )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('need_email', {initialValue: true, valuePropName: 'checked'})(
             <Checkbox>需要發送 E-mail 給面試官</Checkbox>
           )}
             <br/>
             {getFieldDecorator('need_sms', {initialValue: true, valuePropName: 'checked'})(
                <Checkbox>需要發送 SMS</Checkbox>
              )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(ConfirmCancelInterviewModal));
