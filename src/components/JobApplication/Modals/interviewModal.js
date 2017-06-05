import React, { Component } from 'react';
import {  Col, Form, Modal, Button, Input } from 'antd';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';

function InterviewModal({intl, interviewModalStatus, onOk, onCancel}) {

  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  const modalOpts = {
    okText:okText,
    cancelText:cancelText,
    wrapClassName:style.verticalCenterModal,
    title: "面試",
    visible: interviewModalStatus,
    onOk,
    onCancel
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };

  return (
    <Modal {...modalOpts} className={style.modalClass}>
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="面試官"
        >
          <Col span="15">
            <Input type="text"/>
          </Col>
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

export default injectIntl(InterviewModal);
