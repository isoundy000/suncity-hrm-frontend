import { Button, Card, Icon, Popconfirm, Table, Tabs } from "antd";
import React, { Component } from "react";

import { getLocaleText } from 'locales/messages';
import { injectIntl } from 'react-intl';
import styles from "../scheduleRuleDetail.less";

function SameOrNoStaffSet({intl, state, dispatch }) {

  function handleTabChange(key) {
    if (key === 'together') {
      dispatch({
        type: 'scheduleRuleDetail/changeGroupModalType',
        payload: {}
      })

    }
    if (key === 'no_together') {
      dispatch({
        type: 'scheduleRuleDetail/changeGroupModalType',
        payload: {}
      })
    }
  }

  function handleDelete(record) {
    dispatch({
      type: "scheduleRuleDetail/deleteShiftGroups",
      payload: {
        shift_group_id: record.id
      }
    })
  }

  function handleEdit(record) {
    dispatch({
      type: "scheduleRuleDetail/showModal",
      payload: {
        modalType: 'groupModal',
        modalData: record,
        editModal: true
      }
    })
  }

  function addGroup(type) {
    dispatch({
      type: 'scheduleRuleDetail/showModal',
      payload: {
        modalType: 'groupModal',
        addGroupModalType: type,
        editModal: false
      }
    })
  }

  const TabPane = Tabs.TabPane;
  const columns = [
    {
      title: '組名',
      dataIndex: 'chinese_name',
      key: 'chinese_name',
      width:100
    },
    {
      title: '組成員',
      dataIndex: 'member_user_ids',
      key: 'member_user_ids',
      width:300,
      render: (text, record) => {
        let users = [];
        record.member_user_ids.map((userId) => {
          const profile = state.profiles.find(profile => profile.id == userId)
          const name =  profile == undefined ? null : getLocaleText(profile, intl.locale);
          users.push(name);
        })
        return users.join('，')
      }
    },
    {
      title: '備註',
      dataIndex: 'comment',
      key: 'comment',
      width:200,
    },
    {
      title: 'Action',
      key: 'action',
      width:100,
      render: (text, record) => (
        <div>
          <Icon type="edit" style={{ fontSize: '20px' }} onClick={() => handleEdit(record)} />
          <Popconfirm title="確認要刪除這行內容嗎?" onConfirm={() => handleDelete(record)} okText="確認"
            cancelText="取消">
            <Icon type="delete" style={{ fontSize: '20px', marginLeft: '20px' }} />
          </Popconfirm>
        </div>
      ),
    }];

  let data = null;
  if (state.groupModalType == 'together') {
    data = state.shiftGroupsTogether;
  }
  if (state.groupModalType == 'no_together') {
    data = state.shiftGroupsNoTogether;
  }

  return (
    <div>
      <Card title="排版班別設定" className={styles.classSetCard}>
        <Tabs defaultActiveKey="together" size="small" onChange={handleTabChange}>
          <TabPane tab="同更出現" key="together">
            <Table locale={{emptyText:"暫無數據"}} bordered pagination={false} columns={columns} dataSource={data} />
            <Button className={styles.addClass} onClick={() => {
              addGroup('together')
            } }>添加組</Button>
          </TabPane>
          <TabPane tab="不同更出現" key="no_together">
            <Table locale={{emptyText:"暫無數據"}} bordered pagination={false} columns={columns} dataSource={data} />
            <Button className={styles.addClass} onClick={() => {
              addGroup('no_together')
            } }>添加組</Button>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default injectIntl(SameOrNoStaffSet);
