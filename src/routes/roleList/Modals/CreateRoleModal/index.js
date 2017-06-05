import React from 'react';
import { Row, Col, Button, Modal, Form, Input } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;


function CreateRoleModal({ roleList, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const { getFieldDecorator, setFieldsValue, resetFields } = props.form;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const modalType = 'createRoleModal';
  const showModalId = 1;

  const handleOnClick = () => {
    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: showModalId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    resetFields();

    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  const handleOk = () => {
    props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      const formFields = props.form.getFieldsValue();

      console.log(formFields);

      dispatch({
        type: 'roleList/startPxRole',
        payload: {
          pData: formFields,
          pType: 'POST',
        },
      });

      dispatch({
        type: 'roleList/toggleModal',
        payload: {
          id: -1,
          type: modalType,
        },
      });

    });

  };

  return (
    <span>
      <Button onClick={handleOnClick}>新增</Button>

      <Modal
        okText="確認"
        title="新增權限組"
        visible={roleList.modalVisible[modalType] === showModalId}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form horizontal form={props.form}>

          <FormItem
            {...formItemLayout}
            label="中文名"
          >
            {getFieldDecorator('chinese_name', {
               rules: [{ required: true }]
             })(
               <Input type="text" autoComplete="off" />
             )}

          </FormItem>

          <FormItem
            {...formItemLayout}
            label="英文名"
          >
            {getFieldDecorator('english_name', {
               rules: [{ required: true }]
             })(
               <Input type="text" autoComplete="off" />
             )}

          </FormItem>
        </Form>
      </Modal>
    </span>
  );
}

CreateRoleModal = createForm()(CreateRoleModal);

export default injectIntl(CreateRoleModal);
