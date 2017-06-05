import React, {Component} from 'react';
import {
  Form,
  Modal,
  Rate,
  Input,
  Checkbox,
  Select,
} from 'antd';
import style from '../jobApplication.less';
import {injectIntl} from 'react-intl';
import {getLocaleText, definedMessages as messages} from '../../../locales/messages';
import ApplicantInfo from '../Modals/common/applicantInfo';

function AlterInterviewResultModal({
  currentInterviewModalData,
  changeSchedule,
  intl,
  alterInterviewResultModalStatus,
  ApplicantPositionDetail,
  showModal,
  applicantProfiles,
  form,
  onOk,
  onCancel
}) {

  const {getFieldDecorator} = form;
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const notNull = formatMessage(messages['app.job_application.not_null']);

  if (currentInterviewModalData != null) {
    var comment = currentInterviewModalData.comment;
    var time = null;
    if (currentInterviewModalData.time != null) {
      time = currentInterviewModalData.time.substring(0, 10) + "\u00a0\u00a0" + currentInterviewModalData.time.substring(10);
    }
    var mark = currentInterviewModalData.mark;
    var score = currentInterviewModalData.score;
    var interviewer_users = currentInterviewModalData.interviewer_users;
    var result = currentInterviewModalData.result;
    var evaluation = currentInterviewModalData.evaluation;
    var need_again = currentInterviewModalData.need_again == 1 ? true : false;
  }
  function handleOk() {

    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.interview_id = currentInterviewModalData.id;
      data.applicant_position_id = currentInterviewModalData.applicant_position_id;
      var mark = currentInterviewModalData.mark;
      data.score = data.score * 2;
      data.need_again == true ? data.need_again = '1' : data.need_again = '0';
      if (data.need_email === true) {
        showModal('emailModal');
      }
      if (data.need_sms === true) {
        showModal('smsModal');
      }
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
    });
  }

  function handleOnCancel() {
    form.resetFields();
    onCancel();
  }

  const modalOpts = {
    wrapClassName:style.verticalCenterModal,
    // onOk: handleOk,
    title: "修改面試结果",
    visible: alterInterviewResultModalStatus,
    okText: okText,
    cancelText: cancelText,
    onOk: handleOk,
    onCancel: handleOnCancel
  };

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


        <FormItem
          {...formItemLayout}
          label="面試結果"
          required
        >
          <div style={{position: "relative"}} id="fixedSelect2">
            {getFieldDecorator('result', {initialValue: result, rules: [{required: true, message: notNull}]})(
              <Select id="select" size="large" style={{width: 200}}
                      getPopupContainer={() => document.getElementById('fixedSelect2')}>
                <Option value="absent">未出席面試</Option>
                <Option value="succeed">通过面試</Option>
                <Option value="failed">暂不考虑</Option>
              </Select>
            )}
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試評分"
          required
        >
          {getFieldDecorator('score', {initialValue: score / 2}, {rules: [{required: true,type:'number', message: notNull}]})(
            <Rate allowHalf={true}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="面試評價"
          required
        >
          {getFieldDecorator('evaluation', {initialValue: evaluation, rules: [{required: true, message: notNull}]})(
            <Input type="textarea" rows={5}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('need_again', {initialValue: need_again, valuePropName: 'checked'})(
            <Checkbox>需要後續面試</Checkbox>
          )}
        </FormItem>
      </Form>

    </Modal>
  )
}

export default Form.create()(injectIntl(AlterInterviewResultModal));
