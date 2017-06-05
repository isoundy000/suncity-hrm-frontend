import { Alert, Button, Col, Modal, Row, Spin } from "antd";
import React, { Component } from "react";

import styles from "../shiftUserSetting.less";

const confirm = Modal.confirm;



function Header({state, dispatch}) {
  function handleSaveFail() {
    confirm({
      title: '保存失敗',
      content: '信息未填寫完整',
      okText: "確認",
      cancelText: "取消",
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('OK');
      },
    });
  }

  function handleClearSearch() {
    dispatch({
      type: 'shiftUserSetting/clearSearch'
    })
  }

  function handleConfirmCancel() {
    confirm({
      title: '是否确认取消？',
      content: '取消后，已编辑的信息不会保存，請慎重操作',
      okText: "確認",
      cancelText: "取消",
      onOk() {
        console.log('OK');
        dispatch({
          type: 'shiftUserSetting/routerToRosterShift'
        })
      },
      onCancel() {
      },
    });
  }

  function handleConfirmSave() {
    dispatch({
      type: 'shiftUserSetting/checkDataTable'
    })
    if (state.dataTable != null) {
      let newDataTable = state.dataTable.filter(data => data.DataErr == true);
      if (newDataTable.length > 0) {
        handleSaveFail()
      } else {
        confirm({
          title: '是否確認保存所有設定？',
          okText: "確認",
          cancelText: "取消",
          onOk() {
            dispatch({
              type: "shiftUserSetting/routerToRosterShift"
            })
          },
          onCancel() {
            console.log('OK');
          },
        });
      }
    }
  }


  return (
    <div>
      <Row>
        <Col>
          <span className={styles.title}>按員工設定排班和公休</span>
          <Button className={styles.button} onClick={handleConfirmCancel}>取消</Button>
          <Button className={styles.button} onClick={handleConfirmSave}>保存</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Spin spinning={state.meta == null ? true : false}>
            <div className={styles.clickText} >
              <span>員工 {state.meta != null ? state.meta.total_count : null} 人</span>
              <span className={styles.spanClear} onClick={handleClearSearch}>清空條件</span>
            </div>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
