import { Alert, Button, Col, Modal, Row, Spin } from "antd";
import React, { Component } from "react";

import _ from 'lodash';
import styles from "../scheduleRuleDetail.less";

const confirm = Modal.confirm;

function Header({state, dispatch}) {

  const departmentName = _.get(state.departmentDetail, 'chinese_name', null)
  const year = _.get(state.rosterDetail, 'year', null)
  const month = _.get(state.rosterDetail, 'month', null)

  function handleClick() {
    dispatch({
      type: 'scheduleRuleDetail/rostering',
    })
  }

  function showConfirmClear() {
    confirm({
      title: '是否確認清空所有設定？',
      content: '清空後，操作無法撤銷，請慎重操作',
      okText: "確認",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'scheduleRuleDetail/settingEmpty',
        })
      },
      onCancel() {
      },
    });
  }

  function showConfirmExtend() {
    confirm({
      title: '是否沿用上月設定？',
      content: '確認後，之前的數據將無法找回，請慎重操作',
      okText: "確認",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'scheduleRuleDetail/adoptUltimoSetting',
        })
      },
      onCancel() {
      },
    });
  }

  return (
    <div>
      <Row>
        <Col>
          <Spin style={{ width: '300px', display: 'inline-block' }} spinning={departmentName == null || year == null || month == null}>
            <span className={styles.title}>{departmentName} {year}年{month}月</span>
          </Spin>
          <Button className={styles.button} onClick={() => handleClick()}>確認規則</Button>
          <Alert message="請設定並確認下面後，點擊確認規則，進行自動排更" type="warning" showIcon className={styles.alert} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.clickText}>
            <span onClick={showConfirmClear}>清空設定</span>
            <span onClick={showConfirmExtend}>沿用上月設定</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
