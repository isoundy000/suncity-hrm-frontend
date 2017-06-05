import React, { Component } from 'react';
import {
  Form,
  Modal,
  Rate,
  Input,
  Checkbox,
  Select,
} from 'antd';

import style from '../jobApplication.less';
import ApplicantInfo from '../Modals/common/applicantInfo';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';
import { DropdownList } from 'react-widgets';

function FinishInterviewModal({
  currentInterviewModalData,
  intl,
  ApplicantPositionDetail,
  applicantProfiles,
  form,
  finishInterviewModalStatus,
  onOk,
  onCancel,
  changeSchedule
}) {

  const {getFieldDecorator} = form;
  const {formatMessage} = intl;
  const notNull = formatMessage(messages['app.job_application.not_null']);
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);


  if (currentInterviewModalData != null) {
    var comment = currentInterviewModalData.comment;
    // var time = currentInterviewModalData.time;
    var mark = currentInterviewModalData.mark;
    var interviewer_users = currentInterviewModalData.interviewer_users;
    var time = null;
    if (currentInterviewModalData.time != null) {
      time = currentInterviewModalData.time.substring(0, 10) + "\u00a0\u00a0" + currentInterviewModalData.time.substring(10);
    }
  }

  function handleOk() {
    form.validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = {...form.getFieldsValue()};
        data.interview_id = currentInterviewModalData.id;
        data.applicant_position_id = currentInterviewModalData.applicant_position_id;
        data.score = data.score * 2;
        var mark = currentInterviewModalData.mark;
        data.need_again == true ? data.need_again = '1' : data.need_again = '0';
        onOk(data);
        switch (data.result) {
          case 'succeed':
            switch (mark) {
              case'第一次面試':
                changeSchedule({status: 'first_interview_succeed'});
                break;
              case '第二次面試':
                changeSchedule({status: 'second_interview_succeed'});
                break;
              case '第三次面試':
                changeSchedule({status: 'third_interview_succeed'});
                break;
            }
            break;
          case 'absent':
            switch (mark) {
              case '第一次面試':
                changeSchedule({status: 'first_interview_absent'});
                break;
              case '第二次面試':
                changeSchedule({status: 'second_interview_absent'});
                break;
              case '第三次面試':
                changeSchedule({status: 'third_interview_absent'});
                break;
            }
            break;
          case 'failed':
            switch (mark) {
              case'第一次面試':
                changeSchedule({status: 'discard'});
                break;
              case '第二次面試':
                changeSchedule({status: 'discard'});
                break;
              case '第三次面試':
                changeSchedule({status: 'discard'});
                break;
            }
            break;
          default:
            break;
        }
        form.resetFields();
      }
    );
  }

  function handleOnCancel() {
    form.resetFields();
    onCancel();
  }

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    title: "填寫面試結果",
    visible: finishInterviewModalStatus,
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

        <ApplicantInfo applicantProfiles={applicantProfiles} ApplicantPositionDetail={ApplicantPositionDetail}/>

        <div className={style.modalContentTitle}>
          完成面試
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
          面試結果
        </div>
        <FormItem
          {...formItemLayout}
          label="面試結果"
          required
        >
          <div style={{position: "relative"}} id="fixedSelect4">
            {getFieldDecorator('result', {rules: [{required: true, message: notNull}]})(
              <Select id="select" size="large" style={{width: 200}}
                      getPopupContainer={() => document.getElementById('fixedSelect4')}>
                <Option value="absent">未出席面試</Option>
                <Option value="succeed">通過面試</Option>
                <Option value="failed">暫不考慮</Option>
              </Select>
            )}
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試評分"
          required
        >
          {getFieldDecorator('score',{rules: [{required: true,type:'number', message: notNull}]})(
            <Rate allowHalf={true}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試評價"
          required
        >
          {getFieldDecorator('evaluation', {rules: [{required: true, message: notNull}]})(
            <Input type="textarea" rows={5}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('need_again', {initialValue: false})(
            <Checkbox>需要後續面試</Checkbox>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(FinishInterviewModal));
