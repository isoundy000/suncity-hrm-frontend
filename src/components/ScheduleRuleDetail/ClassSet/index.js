import { Button, Card, Icon, Popconfirm, Spin, Table } from "antd";
import React, { Component } from "react";

import dateFormat from "dateformat";
import moment from 'moment';
import styles from "../scheduleRuleDetail.less";

function Classes({ state, dispatch }) {

  function getTimeDiff(end_time, start_time) {
    const diff = moment(end_time).diff(moment(start_time), 'hours', true).toFixed(1)
    if (diff > 0) return diff
    if (diff < 0) {
      return 24 - Math.abs(diff);
    }
  }

  function handleDelete(record) {
    dispatch({
      type: "scheduleRuleDetail/deleteShift",
      payload: {
        shift_id: record.id
      }
    })
  }

  function handleEdit(record) {
    dispatch({
      type: "scheduleRuleDetail/showModal",
      payload: {
        modalType: 'classModal',
        modalData: record,
        editModal: true
      }
    })
  }

  const cancel = () => {
  }

  function handleAddClass() {
    dispatch({
      type: 'scheduleRuleDetail/showModal',
      payload: {
        modalType: 'classModal',
        editModal: false
      }
    })
  }

  let data = state.shiftsTable;
  const columns = [
    {
      title: '更名',
      dataIndex: 'chinese_name',
      key: 'name',
      width: 100,
    },
    {
      title: '開始時間',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 100,
      render: (text, record) => (
        <span>
          {moment(record.start_time).format('HH:mm')}
        </span>
      )
    },
    {
      title: '結束時間',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 100,
      render: (text, record) => (
        <span>
          {moment(record.end_time).format('HH:mm')}
        </span>
      )
    },
    {
      title: '時長',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (text, record) => (
        <span>
          {getTimeDiff(record.end_time, record.start_time) + 'h'}
        </span>
      )
    },
    {
      title: '最少員工數',
      dataIndex: 'min_workers_number',
      key: 'min_workers_number',
      width: 100,
    },
    {
      title: '最少3級員工數（經理級)',
      dataIndex: 'min_3_leval_workers_number',
      key: 'min_3_leval_workers_number',
      width: 100,
    },
    {
      title: '最少4級員工數（主任級）',
      dataIndex: 'min_4_leval_workers_number',
      key: 'min_4_leval_workers_number',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <div>
          <Icon type="edit" onClick={() => handleEdit(record)} style={{ fontSize: '20px' }} />
          <Popconfirm title="確認要刪除這行內容嗎?" onConfirm={() => handleDelete(record)} onCancel={cancel} okText="確認"
            cancelText="取消">
            <Icon type="delete" style={{ fontSize: '20px', marginLeft: '20px' }} />
          </Popconfirm>
        </div>
      ),
    }];

  return (
    <div>
      <Card title="排版班別設定" className={styles.classSetCard}>
        <Spin spinning={state.classSetLoading}>
        </Spin>
        <Table
          locale={{emptyText:"暫無數據"}}
          pagination={false}
          bordered
          columns={columns}
          dataSource={data}
        />

        <Button className={styles.addClass} onClick={handleAddClass}>添加班別</Button>
      </Card>
    </div>
  );
}

export default Classes;
