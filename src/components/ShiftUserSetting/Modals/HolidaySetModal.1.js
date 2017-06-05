import { Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import React, { PropTypes } from 'react';

import styles from "../shiftUserSetting.less";

const HolidaySetModal = ({props}) => {

  const Option = Select.Option;

  const state = props.shiftUserSetting;
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

  const children = [
    <Option key="1">每週一</Option>,
    <Option key="2">每週二</Option>,
    <Option key="3">每週三</Option>,
    <Option key="4">每週四</Option>,
    <Option key="5">每週五</Option>,
    <Option key="6">每週六</Option>,
    <Option key="7">每週日</Option>,
  ];

  function handleOk() {
    dispatch({
      type: 'shiftUserSetting/hideModal',
      payload: { modalType: 'holidaySetModal' }
    })
  }
  function handleOnCancel() {
    dispatch({
      type: 'shiftUserSetting/hideModal',
      payload: { modalType: 'holidaySetModal' }
    })
  }

  const modalOpts = {
    okText: "確認",
    onOk: handleOk,
    title: "本月公休設定",
    visible: state.holidaySetModalStatus,
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
                <span>{modalData.created_at}</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={styles.modalContentTitle}>
          公休設定
        </div>
        <div>
          <FormItem
            {...formItemLayout}
            label="本月排班"
            >
            <Select tags
              style={{ width: '100%' }}
              searchPlaceholder="标签模式"
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

export default HolidaySetModal;
