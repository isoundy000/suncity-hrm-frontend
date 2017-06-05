import React from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import DeleteRoleModal from '../Modals/DeleteRoleModal';
import UpdateRoleModal from '../Modals/UpdateRoleModal';


function RoleTable({ ...props }) {
  const { formatMessage } = props.intl;
  const { roleList } = props;

  const columns = [
    {
      dataIndex: 'chinese_name',
      key: 'chinese_name',
      className: 'roleName',
      width: 900,
    },

    {
      key: 'action',
      width: 300,
      className: 'actionColumn',
      render: (text, record) => (
        <span>
          <Link to={`/roles/${record.id}`}>權限管理</Link>
          <span className="ant-divider" />

          <UpdateRoleModal
            record={record}
            {...props}
          />

          <span className="ant-divider" />

          <DeleteRoleModal
            roleId={record.id}
            roleName={record.chinese_name}
            {...props}
          />
        </span>
      ),
    }
  ];

  const pagination = {
    total: roleList.roles.length,
    size: 'small',
    defaultPageSize: 10,
    pageSize: 10,
  };

  return (
    <Spin spinning={roleList.loading}>
      <div className={styles.tableContent}>
        <Table
          locale={{emptyText:"暫無數據"}}
          columns={columns}
          dataSource={roleList.roles}
          showHeader={false}
          pagination={pagination}
        />
      </div>
    </Spin>
  )
}

export default injectIntl(RoleTable);
