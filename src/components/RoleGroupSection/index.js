import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import update from 'react-addons-update';
import { Table, Modal, Button, Icon, Spin } from 'antd';

import RemoveRoleGroupModal from './Modals/RemoveRoleGroupModal';
import AddRoleGroupModal from './Modals/AddRoleGroupModal';

import EDIT_ICON from './assets/bianji.png';
import styles from './index.less';

function RoleGroupSection({
  roleGroup,
  allRoleGroup,
  currentUser,
  region,
  dataType,
  readonly,
  modalVisible,
  dispatch,
}) {
  console.log('roleGroup', roleGroup);
  const columns = [
    {
      title: '中文名',
      dataIndex: 'chinese_name',
      key: 'chinese_name',
      className: 'roleName',
      width: 450,
    },

    {
      title: '英文名',
      dataIndex: 'english_name',
      key: 'english_name',
      className: 'roleName',
      width: 450,
    },

    {
      key: 'action',
      width: 300,
      className: 'actionColumn',
      render: (text, record) => (
        <span>
          <Link
            to={`/roles/${record.id}`}
            className={styles.actionLink}
          >
            <img alt="edit" src={EDIT_ICON} />
          </Link>

          <RemoveRoleGroupModal
            roleId={record.id}
            roleName={record.chinese_name}
            dispatch={dispatch}
            roleGroup={roleGroup}
            modalVisible={modalVisible}
            currentUser={currentUser}
            region={region}
            readonly={readonly}
          />

        </span>
      ),
    }
  ];

  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">用戶組</div>
      </div>
      <div className="panel-body">
        <Table
          locale={{emptyText:"暫無數據"}}
          columns={columns}
          dataSource={roleGroup}
          pagination={false}
        />

        <AddRoleGroupModal
          dispatch={dispatch}
          roleGroup={roleGroup}
          allRoleGroup={allRoleGroup}
          modalVisible={modalVisible}
          currentUser={currentUser}
          region={region}
          readonly={readonly}
        />
      </div>
    </div>
  );
}

RoleGroupSection.propTypes = {
};

export default RoleGroupSection;
