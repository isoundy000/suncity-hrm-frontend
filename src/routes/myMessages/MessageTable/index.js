import React, { PropTypes } from 'react';
import { Table, Spin } from 'antd';
import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import MessageContent from '../MessageContent';

function MessageTable({ content, list, currentPagination, db, dispatch, ...props }) {
  const columns = [
    {
      title: 'message',
      dataIndex: 'message',
      key: 'message',
      /* dataIndex: 'content', */
      width: 1051,

      render: (text, record) => (
        <MessageContent
          record={record}
          content={content}
          list={list}
          currentPage={currentPagination.current}
          db={db}
          dispatch={dispatch}
          {...props}
        />
      ),
    },
    {
      title: 'time',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 149,
    },
  ];

  const handleMarkRead = (record) => {
    dispatch({
      type: 'myMessages/markRead',
      payload: {
        type: content,
        id: record.id,
      },
    });
  }

  const handleTableChange = (pagination) => {
    console.log('here pagination !!!', pagination);

    const pager = currentPagination;
    pager.current = pagination.current;

    dispatch({
      type: 'myMessages/startFetchCurrentPageList',
      payload: {
        type: content,
        currentPage: pager.current,
        auto: false,
      },
    });

    dispatch({
      type: 'myMessages/setPagination',
      payload: {
        type: content,
        pagination: pager,
      },
    });
  }

  const completedCurrentPagination = Object.assign({}, currentPagination,  {
    size: 'small',
    defaultPageSize: 20,
    pageSize: 20,
  });

  return (
    <Spin spinning={db.loading[content]}>
      <div className={styles.messageTable}>
        <Table
          locale={{emptyText:"暫無數據"}}
          columns={columns}
          indentSize={0}
          pagination={completedCurrentPagination}
          showHeader={false}
          rowClassName={(record) => record.read_status}
          dataSource={list[currentPagination.current]}
          onChange={handleTableChange}
        />
      </div>
    </Spin>

  );
}

MessageTable.propTypes = {
  content: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(MessageTable);
