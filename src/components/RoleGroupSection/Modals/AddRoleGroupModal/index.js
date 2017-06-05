import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Icon, Modal, Form, Select } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};


function AddRoleGroupModal({ roleGroup, allRoleGroup, dispatch, modalVisible, ...props }) {
  const { formatMessage } = props.intl;
  const { getFieldDecorator, resetFields } = props.form;

  const modalType = 'addRoleGroupModal';
  const showId = 1;

  const beChosen = allRoleGroup.filter(role => {
    return roleGroup.findIndex(userRole => {
      return (role.id === userRole.id);
    }) < 0;
  })

  const handleOnClick = () => {
    dispatch({
      type: 'profileDetail/startLoadAllRoleGroup',
      payload: null,
    });

    dispatch({
      type: 'profileDetail/toggleModal',
      payload: {
        id: showId,
        type: modalType,
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'profileDetail/toggleModal',
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
        type: 'profileDetail/startAddRoleGroup',
        payload: {
          formData: formFields,
        },
      });

      dispatch({
        type: 'profileDetail/toggleModal',
        payload: {
          id: -1,
          type: modalType,
        },
      });
      resetFields();
    });
  };

  return (
    <span>
      <Button
        className="btn-add"
        type="primary"
        size="large"
        onClick={handleOnClick}
      >
        <Icon type="plus" />
        <span>增加用戶組</span>
      </Button>

      <Modal
        okText= "確認"
        title="增加用戶組"
        visible={showId === modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.addRoleGroupModal}
      >
        <Form horizontal form={props.form}>
          <FormItem
            {...formItemLayout}
            label="用戶組"
          >
            {getFieldDecorator('roleGroup', {
               rules: [
                 { required: true, message: 'Please select follow role group!', type: 'array' },
               ],
             })(
               <Select
                 multiple
                 placeholder="Please select follow role group">
                 {
                   beChosen.map(role => {
                     return (
                       <Option
                         key={`${role.id}`}
                       >
                         {`${role.chinese_name} - ${role.english_name}`}
                       </Option>
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

AddRoleGroupModal = createForm()(AddRoleGroupModal);

export default injectIntl(AddRoleGroupModal);
