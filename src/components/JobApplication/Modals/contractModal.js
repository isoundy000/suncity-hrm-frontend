import React, { Component } from 'react';
import { Form, Modal, Checkbox } from 'antd';
import style from '../jobApplication.less';
import { injectIntl } from 'react-intl';
import { getLocaleText, definedMessages as messages } from '../../../locales/messages';

function ContractModal({intl, agreement_files, form, contractModalStatus, visible, onOk, onCancel}) {

  const CheckboxGroup = Checkbox.Group;

  if (agreement_files != null) {
    var filesArray = [];
    var allCheckedValue = [];
    var label = null;
    for (const item in agreement_files) {
      label = agreement_files[item];
      filesArray.push({'label': label, 'value': item});
      allCheckedValue.push(item);
    }
  }
  const {formatMessage} = intl;
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const {getFieldDecorator} = form;

  function handleOk() {
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {...form.getFieldsValue()};
      onOk(data);
      form.resetFields();
    });
  }

  function onCheckAllChange() {
    const data = {...form.getFieldsValue()};
    if (data.checkAll === true) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({file_keys:allCheckedValue});
  }

  function handleChange(e) {
    let file_keys = [];
    filesArray.map(item => {
      file_keys.push(item.value)
    });
    if (e.length == file_keys.length) {
      form.setFieldsValue({checkAll:true});
    }else {
      form.setFieldsValue({checkAll:false});
    }
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
    title: "合约",
    visible: contractModalStatus,
    onCancel: handleOnCancel
  };

  return (
    <Modal {...modalOpts}
      className={style.modalClass}
    >
      <Form horizontal>
        <div className={style.contractTitle}>
          請選擇要生成的合約類型
        </div>
        <div className={style.fullWidthButton}>
          <div className={style.allContract}>
            {
              getFieldDecorator('checkAll', {initialValue: false, valuePropName: 'checked'})(
                <Checkbox onChange={onCheckAllChange}>全部選擇</Checkbox>
              )
            }
          </div>
          {
            getFieldDecorator('file_keys', {initialValue: [], rules: [{required: true}]})(
              <CheckboxGroup options={filesArray} onChange={handleChange}>
              </CheckboxGroup>
            )
          }
        </div>
      </Form>
    </Modal>
  )
}

export default Form.create()(injectIntl(ContractModal));
