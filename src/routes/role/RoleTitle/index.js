import React, { PropTypes } from 'react';
import styles from './index.less';
import icon from './assets/paneltitle.png'

import UpdateRoleModal from '../Modals/UpdateRoleModal';

function PanelTitle({ role, dispatch }) {
  const roleName = role.role === null ? '' :  role.role.chinese_name;

  return (
    <div>
      <span className={styles.title}>
        <span className={styles.titleText}>
          {roleName} - 權限組
        </span>

        <UpdateRoleModal
          role={role}
          dispatch={dispatch}
        />
      </span>
    </div>
  );
}

PanelTitle.propTypes = {
};

export default PanelTitle;
