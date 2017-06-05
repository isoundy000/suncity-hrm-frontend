import React, { PropTypes } from 'react';
import styles from './index.less';

import MarkAllButton from '../MarkAllButton';
import MessageTable from '../MessageTable';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function MessageBoard({ content, list, pagination, dispatch, db, ...props }) {
  return (
    <div>
      <MarkAllButton content={content} dispatch={dispatch} />
      <MessageTable
        content={content}
        list={list}
        currentPagination={pagination}
        db={db}
        dispatch={dispatch}
        {...props}
      />
    </div>
  );
}

MessageBoard.propTypes = {
  content: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(MessageBoard);
