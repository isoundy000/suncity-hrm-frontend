import { Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import React, { Component } from 'react';

import moment from "moment";
import styles from "../shiftUserSetting.less";

const ClassSetModal = ({props}) => {
  const Option = Select.Option;

  const state = props.shiftUserSetting;
  const scheduleState = props.scheduleRuleDetail;
  const shifts = scheduleState.shiftsTable;

  const children = [];
  shifts.map(shift => {
    children.push(<Option key={shift.id} > {shift.chinese_name}</Option>)
  })

  const dispatch = props.dispatch;
  const { MonthPicker, RangePicker } = DatePicker;
  let modalData = {
    department: '',
    position: '',
    chinese_name: '',
    english_name: '',
    empoid: '',
    created_at: ''
  };
  if (state.modalData != null) {
    modalData = state.modalData;
  }

  function handleChange(value) {
    console.log('this is vvvvvv', value);
  }
  function handleOk() {
    dispatch({
      type: 'shiftUserSetting/hideModal',
      payload: { modalType: 'classSetModal' }
    })
  }
  function handleOnCancel() {
    dispatch({
      type: 'shiftUserSetting/hideModal',
      payload: { modalType: 'classSetModal' }
    })
  }

  const modalOpts = {
    okText: "確認",
    onOk: handleOk,
    title: "本月排班設定",
    visible: state.classSetModalStatus,
    onCancel: handleOnCancel
  };

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  const formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };


  return (
    <Modal {...modalOpts}>
      <Form horizontal>
        <div>
          <div className={styles.modalContentTitle}>
            員工信息
          </div>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="部門"
                >
                <span>{modalData.department}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="職位"
                >
                <span>{modalData.position}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="中文姓名" >
                <span>{modalData.chinese_name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="英文姓名" >
                <span>{modalData.english_name}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="員工編號"
                >
                <span>{modalData.empoid}</span>
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="入職日期"
                >
                <span>{moment(modalData.created_at).format('YY/MM/DD')}</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={styles.modalContentTitle}>
          本月可排班別
        </div>
        <div>
          <FormItem
            {...formItemLayout}
            label="本月排班"
            >
            <Select tags
              style={{ width: '100%' }}
              onChange={handleChange}
              tokenSeparators={[',']}
              >
              {children}
            </Select>
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="時間段"
                >
                <RangePicker />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="可排"
                >
                <Select tags
                  style={{ width: '100%' }}
                  searchPlaceholder="标签模式"
                  >
                  {children}
                </Select>
              </FormItem>
            </Col>
          </Row>

        </div>
      </Form>
    </Modal >
  );
};

export default ClassSetModal;
