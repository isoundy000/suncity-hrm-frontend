import React from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import RemovePermissionModal from '../Modals/RemovePermissionModal';
import ShowPermissionModal from '../Modals/ShowPermissionModal';


function RolePermissionsTable({ ...props }) {
  const { formatMessage } = props.intl;
  const { role } = props;

  const translations = role.allPermissionsTranslation;

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      className: 'roleName',
      width: 1000,

      render: (text, record) => {
        const resource = record.resource;
        const action = record.action;
        const tmpTransResource = translations.length === 0 ? undefined : translations[resource];

        const name = tmpTransResource && !!tmpTransResource.chinese_name[action] ? tmpTransResource.chinese_name[action] : '';

        return (
          <span> {`${name}`} </span>
        )
      },
    },

    {
      key: 'action',
      width: 200,
      className: 'actionColumn',
      render: (text, record) => (
        <RemovePermissionModal
          record={record}
          {...props}
        />
      ),
    }
  ];

  const data = role.roleDataAbout['permissions'].filter(permission => {
    const permissionsRegion = role.permissionsRegion;
    return (
      permissionsRegion === 'all' || permissionsRegion === permission.region
    );
  });

  const pagination = {
    /* total: role.roleDataAbout['permissions'].length,*/
    total: data.length,
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
          dataSource={data}
          showHeader={false}
          pagination={pagination}
        />
      </div>
    </Spin>
  )
}

export default injectIntl(RolePermissionsTable);
