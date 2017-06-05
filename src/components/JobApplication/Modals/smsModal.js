import React, {Component} from 'react';
import {
  Spin,
  Modal,
  Form,
  Input,
  Radio
} from 'antd';
import style from '../jobApplication.less';
import {injectIntl} from 'react-intl';
import {getLocaleText, definedMessages as messages} from '../../../locales/messages';


function SmsModal({intl, onChangeSmsModalToPeopleType, smsModalToPeopleType, smsTemplates, applicantProfiles, smsModalStatus, form, onOk, onCancel}) {

  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  const notNull = formatMessage(messages['app.job_application.not_null']);

  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;

  const {getFieldDecorator, setFieldsValue} = form;

  const person_info = applicantProfiles.sections.find(section => section.key === 'personal_information');
  const chineseName = person_info.fields.find(field => field.key === 'chinese_name').value;
  const englishName = person_info.fields.find(field => field.key === 'english_name').value;
  const mobileNumber = person_info.fields.find(field => field.key === 'mobile_number').value;
  const gender = person_info.fields.find(field => field.key === 'gender').value;


  const introducer = applicantProfiles.sections.find(section => section.key === 'referrals_information');
  const IntroducerChineseName = introducer.fields.find(field => field.key === 'referrals').value;
  const IntroducerMobileNumber = introducer.fields.find(field => field.key === 'referrals_contact_number').value;


  var smsTemplates2 = {};
  if (smsTemplates != null) {
    smsTemplates2 = smsTemplates;
  }
  function handleOk() {
    var fields = ['smsContentToApplicant', 'smsContentToIntroducer'];
    if (smsModalToPeopleType == 'applicant') {
      fields = [];
      fields.push('smsContentToApplicant')
    }
    if (smsModalToPeopleType == 'sponsor') {
      fields = [];
      fields.push('smsContentToIntroducer')
    }
    form.validateFields(fields, (errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};

      data.markTemplateToApplicantChanged = 'changed';
      data.markTemplateToIntroducerChanged = 'changed';
      data.markTemplateToIntroducer = 'noTemplate';
      data.markTemplateToApplicant = 'noTemplate';
      if (data.smsContentToApplicant != null) {
        if (smsTemplates != null) {
          for (let key in smsTemplates) {
            if (smsTemplates[key] != undefined) {
              if (smsTemplates[key].content == data.smsContentToApplicant) {
                data.markTemplateToApplicant = key;
                data.markTemplateToApplicantChanged = 'noChanged';
              }
            }
          }
        }
      }

      if (data.smsContentToIntroducer != null) {
        if (smsTemplates != null) {
          for (let key in smsTemplates) {
            if (smsTemplates[key] != undefined) {
              if (smsTemplates[key].content == data.smsContentToIntroducer) {
                data.markTemplateToIntroducer = key;
                data.markTemplateToIntroducerChanged = 'noChanged';
              }
            }
          }
        }
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
    onOk: handleOk,
    title: "發送 SMS",
    visible: smsModalStatus,
    onCancel: handleOnCancel
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };

  const toApplicant = <div key={1}>
    <div className={style.modalContentTitle}>
      求職者信息
    </div>
    <FormItem
      {...formItemLayout}
      label="中文姓名"
    >
      <span>{chineseName}</span>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="英文姓名"
    >
      <span>{englishName}</span>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="流動電話"
      required
    >
      {getFieldDecorator('mobile_number', {initialValue: mobileNumber})(
        <Input type="text"/>
      )}
    </FormItem>
    <Spin spinning={smsTemplates == null ? true : false}>
      <FormItem
        {...formItemLayout}
        label="內容模板"
      >
        {getFieldDecorator('smsContentToApplicant', {initialValue: ''})(
          <RadioGroup >
            <RadioButton className={style.modalBtn}
                         value={smsTemplates2.hasOwnProperty('first_interview_to_applicant') ? smsTemplates.first_interview_to_applicant.content : null}>第一次面試</RadioButton>
            <RadioButton className={style.modalBtn}
                         value={smsTemplates2.hasOwnProperty('second_interview_to_applicant') ? smsTemplates.second_interview_to_applicant.content : null }>
              第二次面試 </RadioButton >
            < RadioButton className={style.modalBtn}
                          value={smsTemplates2.hasOwnProperty('third_interview_to_applicant') ? smsTemplates.third_interview_to_applicant.content : null}>第三次面試</RadioButton>
            <RadioButton className={style.modalBtn}
                         value={smsTemplates2.hasOwnProperty('interview_failed_to_applicant') ? smsTemplates.interview_failed_to_applicant.content : null}>面試失敗</RadioButton>
            <RadioButton className={style.modalBtn}
                         value={smsTemplates2.hasOwnProperty('contract_notice_to_applicant') ? smsTemplates.contract_notice_to_applicant.content : null}>錄取簽約</RadioButton>
            <RadioButton className={style.modalBtn}
                         value={smsTemplates2.hasOwnProperty('change_contract_time_to_applicant') ? smsTemplates.change_contract_time_to_applicant.content : null}>更新簽約時間</RadioButton>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="SMS內容">
        {getFieldDecorator('smsContentToApplicant', {rules: [{required: true, message: notNull}]})(
          <Input type="textarea" rows={5}/>
        )}
      </FormItem>
    </Spin>
  </div>;

  const toSponsor = <div key={2}>
    <div className={style.modalContentTitle}>
      介紹人
    </div>
    <FormItem
      {...formItemLayout}
      label="中文姓名"
    >
      <span>{IntroducerChineseName}</span>
    </FormItem>

    <FormItem
      {...formItemLayout}
      label="英文姓名"
    >
      <span>
        {IntroducerChineseName}
      </span>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="流動電話"
      required
    >
      {getFieldDecorator('introducerMobileNumber', {initialValue: IntroducerMobileNumber})(
        <Input type="text"/>
      )}
    </FormItem>

    <Spin spinning={smsTemplates == null ? true : false}>
      <FormItem
        {...formItemLayout}
        label="內容模版"
      >
        {getFieldDecorator('smsContentToIntroducer', {initialValue: ''})(
          <RadioGroup >
            <RadioButton className={style.modalBtn}
                         value={smsTemplates == null ? null : smsTemplates.applicant_rejected_to_introducer.content}>不獲錄取</RadioButton>
            <RadioButton className={style.modalBtn}
                         value={smsTemplates == null ? null : smsTemplates.applicant_accepted_to_introducer.content}>獲錄取</RadioButton>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="SMS內容"
      >
        {getFieldDecorator('smsContentToIntroducer', {rules: [{required: true, message: notNull}]})(
          <Input type="textarea" rows={5}/>
        )}
      </FormItem>
    </Spin>
  </div>

  var vm = [toApplicant, toSponsor];

  if (smsModalToPeopleType == 'applicant') {
    vm = [];
    vm.push(
      toApplicant
    );
  }
  if (smsModalToPeopleType == 'sponsor') {
    vm = [];
    vm.push(
      toSponsor
    );
  }
  return (
    <Modal {...modalOpts}
           className={style.modalClass}
    >
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="發送SMS給"
        >
          {getFieldDecorator('who', {initialValue: 'all'})(
            <RadioGroup onChange={onChangeSmsModalToPeopleType}>
              <RadioButton className={style.modalBtn} value="all">全部</RadioButton>
              <RadioButton className={style.modalBtn} value="applicant">求職者</RadioButton>
              <RadioButton className={style.modalBtn} value="sponsor">介紹人</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        {vm}
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(SmsModal));
