import React from 'react';
import { Row, Col, Button, Modal, Form, Input, Select } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

const Option = Select.Option;


function AddUserModal({ role, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const { getFieldDecorator, resetFields } = props.form;


  const allEmails = role.allEmails;
  /* const rolePermissions = role.role ? role.role.permissions : []; */
  const roleUsers = role.roleDataAbout['users'];

  console.log('all', allEmails);
  console.log('role', roleUsers);

  const beChosen = allEmails.filter(email => {
    return roleUsers.findIndex(roleUser => {
      return (roleUser.email === email);
    }) < 0;
  });

  console.log(beChosen);


  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const modalType = 'addUserModal';
  const showModalId = 1;

  const handleOnClick = () => {
    dispatch({
      type: 'role/toggleModal',
      payload: {
        id: showModalId,
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

      console.log(formFields);

      dispatch({
        type: 'role/startAddUser',
        payload: {
          pData: formFields,
          dataType: 'user',
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

      resetFields();
    });

  };

  const handleOnSearch = (value) => {
    dispatch({
      type: 'role/startFetchEmails',
      payload: {
        value,
      },
    });
  }

  return (
    <span>
      <Button onClick={handleOnClick}>添加員工</Button>

      <Modal
        okText="確認"
        title="請選擇要添加的員工"
        visible={role.modalVisible[modalType] === showModalId}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.addUserModal}
      >
        <Form horizontal form={props.form}>
          <FormItem
            {...formItemLayout}
            label="員工"
          >
            {getFieldDecorator('users', {
               rules: [
                 { required: true, message: 'Please Type Correct User Email', type: 'array' },
               ],
             })(
               <Select
                 multiple
                 onSearch={handleOnSearch}
                 placeholder="Please Type User Email"
               >
                 {
                   beChosen.map(user => {
                     return (
                       <Option key={user}>{user}</Option>
                     );
                   })
                 }
               </Select>
             )}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
}

AddUserModal = createForm()(AddUserModal);

export default injectIntl(AddUserModal);
