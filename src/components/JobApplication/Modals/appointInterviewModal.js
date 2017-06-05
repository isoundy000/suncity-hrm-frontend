import React, { Component } from 'react';
import {
  Col,
  Form,
  Modal,
  Input,
  Checkbox,
  Select,
} from 'antd';

import MaskedInput from 'react-text-mask';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText ,definedMessages as messages} from '../../../locales/messages';
import ApplicantInfo from '../Modals/common/applicantInfo';

const InputGroup = Input.Group;

let timeOut;

function AppointInterviewModal({
  intl,
  ApplicantPositionDetail,
  showModal,
  applicantProfiles,
  form,
  appointInterviewModalStatus,
  onOk,
  onCancel,
  emailList,
  validatedEmail,

  searchResult,
  initialSearchResult,
  validatedSearchResult,
  dispatch,
}) {

  const {getFieldDecorator, getFieldError, isFieldValidating} = form;
  const { formatMessage } = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const notNull = formatMessage(messages['app.job_application.not_null']);
  const email_not_exit = formatMessage(messages['app.job_application.email_not_exist']);

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.time = data.date + '' + data.time;
      delete data.date;
      const trueData = {
        ...data,
        interviewer_emails: data.interviewer_emails.map(interviewer => interviewer.split('||')[5]),
      }

      onOk(trueData);

      if (data.need_email === true) {
        console.log('/??', data.interviewer_emails);
        dispatch({
          type: 'jobApplication/updateInitialSearchResult',
          payload: {
            result: data.interviewer_emails,
          },
        });
        showModal('emailModal');
      }
      if (data.need_sms === true) {
        showModal('smsModal');
      }
      form.resetFields();
    });
  }

  function handleOnCancel() {
    form.resetFields();
    onCancel();
  }

  function handleSelectSearch(value) {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }

    function doIt() {
      dispatch({
        /* type: 'jobApplication/fetchEmailList',*/
        type: 'jobApplication/fetchSearchResult',
        payload: {
          value,
        },
      });
    }

    timeOut = setTimeout(doIt, 500);
  }

  function usersToEmails(users) {
    if (users) {
      return users.map(user => {
        console.log(user);
        return user.id ? user.email : user.split('||')[5];
      })
    }
  }

  function userExists(rule, value, callback) {
    if (!value) {
      console.log('~~~~~~value', value);
      callback();
    } else {
      setTimeout(() => {

        console.log('~~~~~~value', value);
        const selectedEmails = value.map(fieldsJoin => {
          return fieldsJoin.split('||')[5];
        })

        let notExist = false;

        for (const option of selectedEmails) {
          const allEmails = [...usersToEmails(searchResult),
                             ...usersToEmails(validatedSearchResult),
          ];
          if (allEmails.findIndex(email => option === email) < 0) {
            notExist = true;
          }
        }

        if (notExist) {
          callback([new Error(email_not_exit)]);
        } else {
          const realValues = selectedEmails.map(email => {
            return searchResult.filter(user => user.email === email);
          });
          dispatch({
            type: 'jobApplication/updateValidatedSearchResult',
            payload: {
              result: value,
            }
          });
          callback();
        }
      }, 800);
    }
  }

  function emailExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        let notExist = false;

        for (const option of value) {
          const allEmails = [...emailList, ...validatedEmail];
          if (allEmails.findIndex(email => option === email) < 0) {
            notExist = true;
          }
        }

        if (notExist) {
          callback([new Error(email_not_exit)]);
        } else {
          dispatch({
            type: 'jobApplication/updateValidatedEmail',
            payload: {
              emails: value,
            }
          });
          callback();
        }
      }, 800);
    }
  }

  /* const interviewerOptions = emailList.map(email => {
   *   return (
   *     <Option key={email}>{email}</Option>
   *   );
   * });
   */

  const interviewerOptions = searchResult.map((user, index) => {
    return (
      <Option
        key={user.fields_join}
      >
        <div>
          <span>
            {`${user.chinese_name} `}
          </span>
          <span>
            {`(${user.english_name}) `}
          </span>
        </div>

        <div>
          <span className={style.fontLight}>
            {user.empoid}
          </span>
        </div>

        <div>
          <span className={style.fontLight}>
            {`${user.department && user.department.chinese_name} `}
          </span>
          <span className={style.fontLight}>
            {user.position && user.position.chinese_name}
          </span>

        </div>
        <div className={style.fontLight}>
          {user.email}
        </div>
      </Option>
    );
  })

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    title: "预约面試",
    visible: appointInterviewModalStatus,
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
  const chineseName = person_info.fields.find(field => field.key === 'chinese_name').value;
  const englishName = person_info.fields.find(field => field.key === 'english_name').value;
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
          label="面試輪次"
        >
          <div style={{position: "relative"}} id="fixedSelect10">
            {getFieldDecorator('mark', {rules: [{required: true, message: notNull}]})(
              <Select id="select" size="large" style={{width: 200}}
                      getPopupContainer={() => document.getElementById('fixedSelect10')}>
                <Option value="第一次面試">第一次面試</Option>
                <Option value="第二次面試">第二次面試</Option>
                <Option value="第三次面試">第三次面試</Option>
              </Select>
            )}
          </div>

        </FormItem>

        <FormItem className="required"
          {...formItemLayout}
          label="面試時間"
        >
          <InputGroup size="large">
            <Col span="12">
              <FormItem>
                {getFieldDecorator('date', {initialValue: '', rules: [{required: true, message: notNull}]})(
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
                {getFieldDecorator('time', {initialValue: '', rules: [{required: true,message:notNull}]})(
                   <MaskedInput
                     type="text"
                     className="y-form-control"
                     mask={[/\d/, /\d/, ':', /\d/, /\d/, '-', /\d/, /\d/, ':', /\d/, /\d/]}
                     placeholderChar={'\u2000'}
                     placeholder="__ : __-__ : __"
                   />
                 )}
              </FormItem>
            </Col>
          </InputGroup>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="面試官"
          hasFeedback
          help={isFieldValidating('interviewer_emails') ? 'validating...' : (getFieldError('interviewer_emails') || []).join(', ')}
          required
        >
          <Col span="15">
            {getFieldDecorator('interviewer_emails', {
               rules: [
                 {required: true,message:notNull,type:'array'},
                 {validator: userExists},
               ]
             })(
               <Select
                 tags
                 style={{width: '100%'}}
                 searchPlaceholder="标签模式"
                 filterOption={false}
                 onSearch={handleSelectSearch}
               >

                 {interviewerOptions}

               </Select>
             )}
          </Col>

          <Col span="9" className={style.placeHolder}>
          </Col>
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
          {getFieldDecorator('need_email', {initialValue: true, valuePropName: 'checked'})(
             <Checkbox>發送E-mail給面試官</Checkbox>
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

export default Form.create()(injectIntl(AppointInterviewModal));
