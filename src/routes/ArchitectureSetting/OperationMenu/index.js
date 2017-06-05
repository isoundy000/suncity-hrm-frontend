import React, { PropTypes } from 'react';
import { Menu } from 'antd';
import OperationModal from '../OperationModal';
import styles from './index.less';
import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function OperationMenu({ content, record, ...props }) {
  const { formatMessage } = props.intl;
  const { currentUser, region } = props;
  console.log('operationMenu', record);

  let newItemTitle = '';
  let statusTitle = '';
  const status = record.status;

  const newSubdepartmentTitle = formatMessage(messages['app.arch.operation.new_subdepartment_title']);
  const newSubpositionTitle = formatMessage(messages['app.arch.operation.new_subposition_title']);
  const edit = formatMessage(messages['app.arch.operation.edit']);
  const enableStatus = formatMessage(messages['app.arch.operation.enable_status']);
  const disableStatus = formatMessage(messages['app.arch.operation.disable_status']);

  let newItemMenuItem;
  let editItemMenuItem;

  if (content === 'departments') {
    newItemTitle = newSubdepartmentTitle;
  } else if (content === 'positions') {
    newItemTitle = newSubpositionTitle;
  }

  if (status === 'enabled') {
    statusTitle = disableStatus;
    newItemMenuItem = (
      <Menu.Item
        className={classNames({ 'shouldNotShow': ((content === 'departments' &&
                                                   region === 'macau' &&
                                                   currentUser.can.createDepartmentInMACAU !== true)
                                               || (content === 'departments' &&
                                                   region === 'manila' &&
                                                   currentUser.can.createDepartmentInMANILA !== true)
                                               || (content === 'positions' &&
                                                   region === 'macau' &&
                                                   currentUser.can.createPositionInMACAU !== true)
                                               || (content === 'positions' &&
                                                   region === 'manila' &&
                                                   currentUser.can.createPositionInMANILA !== true)
          ) })}
      >
        <OperationModal
          {...props}
          record={record}
          content={content}
          itemTitle={newItemTitle}
          kind={"menu"}
        />
      </Menu.Item>
    );
    editItemMenuItem = (
      <Menu.Item
        className={classNames({ 'shouldNotShow': ((content === 'departments' &&
                                                   region === 'macau' &&
                                                   currentUser.can.updateDepartmentInMACAU !== true)
                                               || (content === 'departments' &&
                                                   region === 'manila' &&
                                                   currentUser.can.updateDepartmentInMANILA !== true)
                                               || (content === 'positions' &&
                                                   region === 'macau' &&
                                                   currentUser.can.updatePositionInMACAU !== true)
                                               || (content === 'positions' &&
                                                   region === 'manila' &&
                                                   currentUser.can.updatePositionInMANILA !== true)
                                               || (content === 'departments' &&
                                                   record.id === 1)
                                               || (content === 'positions' &&
                                                   record.id === 1)) })}
      >
        <OperationModal
          {...props}
          record={record}
          content={content}
          itemTitle={edit}
          kind={"menu"}
        />
      </Menu.Item>
    );
  } else if (status === 'disabled') {
    statusTitle = enableStatus;
    newItemMenuItem = (<Menu.Item className={styles.none}></Menu.Item>);
    editItemMenuItem = (<Menu.Item className={styles.none}></Menu.Item>);
  }

  return (
    <div className={styles.dropdownMenu}>
      <Menu>
        {newItemMenuItem}
        {editItemMenuItem}

        <Menu.Item
          className={classNames({ 'shouldNotShow': ((content === 'departments' &&
                                                     region === 'macau' &&
                                                     currentUser.can.disableDepartmentInMACAU !== true)
                                                 || (content === 'departments' &&
                                                     region === 'manila' &&
                                                     currentUser.can.disableDepartmentInMANILA !== true)
                                                 || (content === 'positions' &&
                                                     region === 'macau' &&
                                                     currentUser.can.disablePositionInMACAU !== true)
                                                 || (content === 'positions' &&
                                                     region === 'manila' &&
                                                     currentUser.can.disablePositionInMANILA !== true)) })}
        >
          <OperationModal
            {...props}
            record={record}
            content={content}
            itemTitle={statusTitle}
            kind={"menu"}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

OperationMenu.propTypes = {
  record: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(OperationMenu);
