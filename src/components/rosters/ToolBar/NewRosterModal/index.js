import React from 'react';
import { Modal, Button, Form, Radio, Checkbox, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const NewRosterModal = ({ rosters, dispatch, date, ...props }) => {
  console.log('Hello Here', rosters);
  const { formatMessage } = props.intl;

  const { getFieldDecorator, getFieldsValue, setFieldsValue, resetFields } = props.form;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const dateRange = (new Array(12)).fill(0).map((item, index) => {
    const tmpMonth = date.month + index + 1;
    return Math.floor(tmpMonth / 12) === 0 ?
           { ...date, month: tmpMonth } :
           { ...date,
             year: date.year + 1,
             month: tmpMonth % 12 === 0 ? 12 : tmpMonth % 12,
           }
  });

  const radioOptions = dateRange.map((date, index) =>
    <Radio
      key={index}
      value={`${date.year}_${date.month}`}
    >
      {`${date.year}年 ${date.month}月`}
    </Radio>
  );

  const newRosterDate = rosters.form.newRosterDate;
  const allOptionsList = rosters.form.availableDepartments;

  const freezeList = rosters.form.freezeList;

  const originalOptionsList = allOptionsList.filter(option => {
    return freezeList.findIndex(freezeItem => freezeItem.value === option.value) < 0;
  });

  const optionsList = newRosterDate === null ?
                      [] :
                      originalOptionsList.map(option => (
                        { ...option,
                          label: option.chinese_name,
                          value: option.id,
                          disabled: false,
                        }
                      ));


  const handleOnClick = () => {
    dispatch({
      type: 'rosters/toggleModal',
      payload: {
        status: true,
      },
    });

    dispatch({
      type: 'rosters/setDateToNull',
      payload: null,
    });
  };

  const handleCancel = () => {
    resetFields();

    dispatch({
      type: 'rosters/toggleModal',
      payload: {
        status: false,
      },
    });

    dispatch({
      type: 'rosters/setDateToNull',
      payload: null,
    });
  };

  const handleOk = () => {
    props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      const formFields = getFieldsValue();

      console.log('formFields', formFields);

      dispatch({
        type: 'rosters/startAddNewRosters',
        payload: formFields,
      });

      dispatch({
        type: 'rosters/setDateToNull',
        payload: null,
      });

      dispatch({
        type: 'rosters/toggleModal',
        payload: {
          status: false,
        },
      });

      resetFields();
    });
  };

  const handleChangeDate = (e) => {
    dispatch({
      type: 'rosters/startFetchAvailableDepartments',
      payload: {
        date: e.target.value,
      },
    });
  };

  const handleCheckAllDepartment = (e) => {
    const checkedResult = e.target.checked === true ?
                          optionsList.map(option => option.value) :
                          [];

    setFieldsValue({ departments: checkedResult });
  }

  const handleCheckDepartment = (departmentList) => {
    const checkedAllResult = departmentList.length === optionsList.length ? true : false;

    setFieldsValue({ departmentsAll: checkedAllResult });
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={handleOnClick}
      >
        新增
      </Button>

      <Modal
        okText="確認"
        title="新增排班事件表"
        visible={rosters.modalStatus}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="newRosterModal"
      >
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            label="選擇新增排班時間段"
          >
            {getFieldDecorator('date', {
               rules: [{ required: true }],
             })(
               <RadioGroup onChange={handleChangeDate}>
                 {radioOptions}
               </RadioGroup>
             )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="選擇新增部門"
          >
            <div>
              {getFieldDecorator('departmentsAll', {
                 initialValue: false,
                 valuePropName: 'checked',
               })(
                 <Checkbox
                   onChange={handleCheckAllDepartment}
                   disabled={newRosterDate === null}
                 >
                   Check all
                 </Checkbox>
               )}

            </div>
          </FormItem>

          <FormItem
            wrapperCol={{ span: 19, offset: 5 }}
          >
            <Spin spinning={rosters.modalLoading}>
              <div>
                {getFieldDecorator('departments', {
                   rules: [{ required: true }],
                   initialValue: [], //freezeList.map(item => item.value),
                 })(

                   <CheckboxGroup
                     options={optionsList}
                     onChange={handleCheckDepartment}
                     disabled
                   />
                 )}
              </div>
            </Spin>

          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

export default injectIntl(
  createForm()(NewRosterModal)
);
