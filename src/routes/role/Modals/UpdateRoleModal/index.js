import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Modal, Form, Input } from 'antd';

import styles from './index.less';
import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

import EDIT_ICON from '../../assets/bianji.png';


function UpdateRoleModal({ role, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const { getFieldDecorator, setFieldsValue, resetFields } = props.form;

  const currentRole = role.role === null ?
                      {
                        id: -2,
                        chinese_name: '',
                        english_name: '',
                      } :
                      role.role;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const roleId = currentRole.id;

  const modalType = 'updateRoleModal';

  const handleOnClick = () => {
    setFieldsValue({
      chinese_name: currentRole.chinese_name,
      english_name: currentRole.english_name,
    });

    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: roleId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    resetFields();

    dispatch({
      type: 'role/toggleModal',
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
        type: 'role/startUpdateRole',
        payload: {
          id: roleId,
          patchData: formFields,
        },
      });

      dispatch({
        type: 'role/toggleModal',
        payload: {
          id: -1,
          type: modalType,
        },
      });

      let body = document.getElementsByTagName('body')[0];
      body.style.cssText = "";

    });
  };

  return (
    <span className={classNames({ 'shouldNotShow': ((role.role === null))})}>
      <Link onClick={handleOnClick}>
        <img alt="edit_name" src={EDIT_ICON} />
      </Link>

      <Modal
        okText="確認"
        title="編輯權限組名稱"
        visible={role.modalVisible[modalType] === roleId}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.updateRoleModal}
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
