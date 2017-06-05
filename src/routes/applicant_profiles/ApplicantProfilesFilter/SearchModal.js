import React from 'react';
import { Modal, Form, Input } from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;

function SearchModal({ dispatch, form, advanceSearch}) {
  const { getFieldDecorator, getFieldsValue } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      okText= "確認"
      title="檢索求職者資料"
      visible={true}
      onCancel={() => {
        dispatch({type: 'applicantProfiles/toggleShowSearchModal'})
      }}
      onOk={() =>{
        const advanceSearch = getFieldsValue();
        dispatch({
          type: 'applicantProfiles/setAdvanceSearch',
          payload: advanceSearch
        });
        dispatch({
          type: 'applicantProfiles/fetchProfiles'
        });
        dispatch({
          type: 'applicantProfiles/toggleShowSearchModal'
        });
      }}
    >
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="證件號碼"
        >
          {getFieldDecorator('id_card_number', {
            initialValue: _.get(advanceSearch, 'id_card_number')
          })(
            <Input placeholder="證件號碼" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="中文姓名"
        >
          {getFieldDecorator('chinese_name', {
            initialValue: _.get(advanceSearch, 'chinese_name')
          })(
            <Input placeholder="中文姓名" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="英文姓名"
        >
          {getFieldDecorator('english_name', {
            initialValue: _.get(advanceSearch, 'english_name')
          })(
            <Input placeholder="英文姓名" />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(SearchModal);
