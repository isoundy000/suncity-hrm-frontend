import React from 'react';
import { Row, Col, Button, Modal, Form, Input, Select } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

const Option = Select.Option;


function AddPermissionModal({ role, region, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const { getFieldDecorator, setFieldsValue, resetFields } = props.form;

  console.log(role);

  const translations = role.allPermissionsTranslation;

  const allPermissions = role.allPermissions;
  console.log(allPermissions);
  /* const rolePermissions = role.role ? role.role.permissions : []; */
  const rolePermissions = role.roleDataAbout['permissions'];

  console.log('all', allPermissions);
  console.log('role', rolePermissions);

  const beChosen = allPermissions.filter(permission => {
    return rolePermissions.findIndex(rolePermission => {
      return (rolePermission.resource === permission.resource &&
              rolePermission.action === permission.action  &&
              rolePermission.region === permission.region);
    }) < 0;
  });

  /* const beChosen = tmpAllPermissions.filter(permission => !rolePermissions.includes(permission)); */
  console.log(beChosen);


  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const modalType = 'addPermissionModal';
  const showModalId = 1;

  const handleOnClick = () => {
    dispatch({
      type: 'role/startFetchAllPermissions',
      payload: null,
    });

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
        type: 'role/startAddPermission',
        payload: {
          pData: formFields,
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

  const capitalize = (str) => {
    return str.replace(/\b(\w)(\w*)/g, (v, v1, v2) => {
      return `${v1.toUpperCase()}${v2.toLowerCase()}`;
    });
  }

  return (
    <span>
      <Button onClick={handleOnClick}>添加權限</Button>

      <Modal
        okText="確認"
        title="請選擇要添加的權限"
        visible={role.modalVisible[modalType] === showModalId}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles.addPermissionModal}
      >
        <Form horizontal form={props.form}>
          <FormItem
            {...formItemLayout}
            label="權限列表"
          >
            {getFieldDecorator('permissions', {
               rules: [
                 { required: true, message: 'Please select follow permissions!', type: 'array' },
               ],
             })(
               <Select
                 multiple
                 placeholder="Please select follow permissions">
                 {
                   beChosen.map(permission => {

                     const name = translations.length === 0 ?
                                  '' : translations[permission.resource].chinese_name[permission.action];
                     const actionResource = capitalize(`${permission.action} - ${permission.resource}`);
                     const region = capitalize(`${permission.region}`);
                     return (
                       <Option
                         key={`${permission.action}-${permission.resource}-${permission.region}`}
                       >
                         {`${name}`}
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

AddPermissionModal = createForm()(AddPermissionModal);

export default injectIntl(AddPermissionModal);
