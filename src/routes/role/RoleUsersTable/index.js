import React from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import RemoveUserModal from '../Modals/RemoveUserModal';


function RoleUsersTable({ ...props }) {
  const { formatMessage } = props.intl;
  const { role } = props;

  const columns = [
    {
      dataIndex: 'chinese_name',
      key: 'chinese_name',
      className: 'roleName',
      width: 1000,
    },

    {
      key: 'action',
      width: 200,
      className: 'actionColumn',
      render: (text, record) => (
        <RemoveUserModal
          record={record}
          {...props}
        />
      ),
    }
  ];

  const data = [{
    key: '1',
    id: 1,
    chinese_name: "李大仁",
    english_name: "Dalan Li",
    region: "macau",
    created_at: "2016-08-11T04:10:15.008Z",
    updated_at: "2016-08-11T04:10:15.008Z",
  }, {
    key: '2',
    id: 2,
    chinese_name: "陈大文",
    english_name: "Daven Chen",
    region: "macau",
    created_at: "2016-08-11T04:10:15.008Z",
    updated_at: "2016-08-11T04:10:15.008Z",
  }];

  const pagination = {
    total: role.roleDataAbout['users'].length,
    size: 'small',
    defaultPageSize: 10,
    pageSize: 10,
  };

  return (
    <Spin spinning={role.loading['all']}>
      <div className={styles.tableContent}>
        <Table
          locale={{emptyText:"暫無數據"}}
          columns={columns}
          dataSource={role.roleDataAbout['users']}
          showHeader={false}
          pagination={pagination}
        />
      </div>
    </Spin>
  )
}

export default injectIntl(RoleUsersTable);
