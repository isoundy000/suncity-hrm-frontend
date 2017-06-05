import React, { PropTypes } from 'react';
import OperationModal from '../OperationModal';
import style from './index.less';

import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function OperationList({ record, ...props }) {
  const { formatMessage } = props.intl;
  const editTitle = formatMessage(messages['app.arch.operation.edit_title']);
  const deleteTitle = formatMessage(messages['app.arch.operation.delete_title']);

  const { currentUser, region } = props;

  let deleteItem = (<span></span>);
  let editItem = (<span></span>);

  if (record.parent_id !== null) {
    editItem = (
      <OperationModal {...props} record={record} itemTitle={editTitle} kind={"List"} />
    );
    deleteItem = (
      <OperationModal {...props} record={record} itemTitle={deleteTitle} kind={"List"} />
    );
  }

  return (
    <div className={style.operationMenu}>
      {editItem}
      {deleteItem}

      {/* For 1AND2 */}
      {/* <div className={classNames({ 'shouldNotShow': ((region === 'macau' &&
      currentUser.can.deleteLocationInMACAU !== true)
      || (region === 'manila' &&
      currentUser.can.deleteLocationInMANILA !== true)) })}>
      {editItem}
      </div>

      <div className={classNames({ 'shouldNotShow': ((region === 'macau' &&
      currentUser.can.updateLocationInMACAU !== true)
      || (region === 'manila' &&
      currentUser.can.updateLocationInMANILA !== true)) })}>
      {deleteItem}
      </div>
      */}

    </div>
  );
}

OperationList.propTypes = {
  record: PropTypes.object.isRequired,
};

export default injectIntl(OperationList);
