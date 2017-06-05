import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal, Form, Input } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;


function UpdateRoleModal({ record, roleList, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const { getFieldDecorator, setFieldsValue, resetFields } = props.form;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const roleId = record.id;

  const modalType = 'updateRoleModal';

  const handleOnClick = () => {
    setFieldsValue({
      chinese_name: record.chinese_name,
      english_name: record.english_name,
    });

    dispatch({
      type: 'roleList/toggleModal',
      payload: {
        id: roleId,
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
      /* console.log(formFields); */

      dispatch({
        type: 'roleList/startPxRole',
        payload: {
          id: roleId,
          pData: formFields,
          pType: 'PATCH',
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
      <Link onClick={handleOnClick}>編輯名稱</Link>

      <Modal
        okText="確認"
        title="編輯權限組名稱"
        visible={roleList.modalVisible[modalType] === roleId}
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

UpdateRoleModal = createForm()(UpdateRoleModal);

export default injectIntl(UpdateRoleModal);
