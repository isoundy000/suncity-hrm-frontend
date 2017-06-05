import React, { PropTypes } from 'react';
/* import { connect } from 'dva'; */
import { Button } from 'antd';
import styles from './index.less';


import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function MarkAllButton({ content, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const handleMarkAll = () => {
    dispatch({
      type: 'myMessages/markAllRead',
      payload: {
        type: content,
      },
    });
  }

  return (
    <div
      className={styles.btnLine}
    >
      <Button
        className={styles.markAllBtn}
        onClick={handleMarkAll}
      >
        {formatMessage(messages['app.messages.message_board.mark_all'])}
      </Button>
    </div>
  );
}

MarkAllButton.propTypes = {
  content: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

/* const mapStateToProps = ({ myMessages }) => ({
   myMessages,
   });
 */

export default injectIntl(MarkAllButton);
/* export default connect(mapStateToProps)(injectIntl(MarkAllButton)); */
