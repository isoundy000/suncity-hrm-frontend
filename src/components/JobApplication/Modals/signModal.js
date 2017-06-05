import React, { Component } from 'react';
import { Form, Modal, Button, Input} from 'antd';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';

function SignModal({signModalStatus, onOk, onCancel, intl}) {
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      data.time = data.data + ''+data.time;
      delete data.data;
      onOk(data);
      form.resetFields();
    });
  }

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    title: "签约",
    visible: signModalStatus,
    onOk,
    onCancel
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
        >
          <Input type="text"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="内容模版"
        >
          <Button className={style.modalBtn}>
            第一次面試
          </Button>
          <Button className={style.modalBtn}>
            第二次面試
          </Button>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail 內容"
        >
          <Input type="textarea" placeholder="随便写"/>
        </FormItem>
      </Form>

    </Modal>
  )
}

export default injectIntl(SignModal);
