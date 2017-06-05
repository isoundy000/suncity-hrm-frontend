import React, {Component} from 'react';
import {Spin, Col, Form, Modal, Input,  Radio, Select} from 'antd';
import style from '../jobApplication.less';
import {injectIntl} from 'react-intl';
import {getLocaleText, definedMessages as messages} from '../../../locales/messages';

let timeOut;


function EmailModal({
  intl,
  emailModalStatus,
  emailTemplates,
  searchResult,
  initialSearchResult,
  validatedSearchResult,
  emailList,
  validatedEmail,
  initialEmail,
  form,
  visible,
  onOk,
  onCancel,
  dispatch,
}) {
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const Option = Select.Option;

  const {getFieldDecorator, getFieldError, isFieldValidating} = form;
  const {formatMessage} = intl;
  const email_not_exit = formatMessage(messages['app.job_application.email_not_exist']);
  const notNull = formatMessage(messages['app.job_application.not_null']);
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  console.log('***', searchResult, initialSearchResult, validatedSearchResult);

  function returnOption(user, key) {
    return (
      <Option
        key={key}
        value={key}
      >
        <div>
          <span>
            {user.chinese_name}
          </span>
          <span>
            ({user.english_name})
          </span>
          <span>
            {user.empoid}
          </span>
        </div>

        <div>
          <span>
            {user.department && user.department.chinese_name}
          </span>
          <span>
            {user.position && user.position.chinese_name}
          </span>

        </div>
        <div>
          {user.email}
        </div>
      </Option>
    );
  }

  function returnSearchOptions(searchResult) {
    let searchOptions = [];
    for (const key of ['value']) {
      const tmpOptions = searchResult.map(user => returnOption(user, key));
      searchOptions = [...searchOptions, ...tmpOptions];
    }
    return searchOptions;
  }

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const tmpData = {...form.getFieldsValue()};
      const data = {
        ...tmpData,
        interviewers: tmpData.interviewers.map(interviewer => interviewer.split('||')[5]),
      }

      onOk(data);

      form.resetFields();
    });
  }

  function handleCancel() {
    form.resetFields();
    form.resetFields();
    onCancel();
  }

  function handleOnSearch(value) {
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

    console.log('###', users);
    if (users) {
      /* return users.map(user => user.email || user.split('||')[5]);*/
      return users.map(user => {
        return user.id ? user.email : user.split('||')[5];
      })
    }
  }

  function userExists(rule, value, callback) {
    if (!value) {
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
                             ...usersToEmails(initialSearchResult),
          ];
          console.log('^^^', option, allEmails);
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
          const allEmails = [...emailList, ...validatedEmail, ...initialEmail];
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

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    onOk: handleOk,
    title: "發送E-mail",
    visible: emailModalStatus,
    /* onOk, */
    onCancel: handleCancel,
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
        <FormItem
          {...formItemLayout}
          label="面試官"
          hasFeedback
          help={isFieldValidating('interviewers') ? 'validating...' : (getFieldError('interviewers') || []).join(', ')}
          required
        >
          <Col span="15">
            {getFieldDecorator('interviewers', {
               initialValue: initialSearchResult,
               rules: [
                 {required: true, message: notNull, type: 'array'},
                 {validator: userExists},
               ]
             })(
               <Select
                 tags
                 style={{width: '100%'}}
                 searchPlaceholder="标签模式"
                 onSearch={handleOnSearch}
               >
                 {
                   searchResult.map((user, index) => {
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
                 }
               </Select>
            )}
          </Col>
          <Col span="9" className={style.placeHolder}>
          </Col>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="内容模版"
        >
          {getFieldDecorator('email_content', {initialValue: ''})(
             <RadioGroup >
               <RadioButton
                 className={style.modalBtn}
                 value={emailTemplates.audience === null ? "Audience" : `${emailTemplates.audience.body}` }
               >
                 通知接見
               </RadioButton>

               <RadioButton
                 className={style.modalBtn}
                 value={emailTemplates.interview === null ? "No Interview" : `${emailTemplates.interview.body}` }
               >
                 面試通知
               </RadioButton>
             </RadioGroup>
           )}
        </FormItem>
        <Spin spinning={emailTemplates.interview === null ? true : false}>
          <FormItem
            {...formItemLayout}
            label="E-mail 內容"
          >
            {getFieldDecorator('email_content')(
               <Input type="textarea" rows={5} placeholder="可以選擇以上模板"/>
             )}
          </FormItem>
        </Spin>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(EmailModal));
