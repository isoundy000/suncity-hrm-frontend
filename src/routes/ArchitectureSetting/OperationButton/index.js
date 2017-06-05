import React, { PropTypes } from 'react';
import { Button, Dropdown, Icon } from 'antd';
import OperationMenu from '../OperationMenu';
import styles from './index.less';
import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function OperationButton({ content, record, ...props }) {
  const { formatMessage } = props.intl;
  const { currentUser, region } = props;
  const menu = (<OperationMenu {...props} content={content} record={record} />);
  return (
    <div className={classNames({ 'shouldNotShow': ((content === 'departments' &&
                                                    region === 'macau' &&
                                                    currentUser.can.createDepartmentInMACAU !== true &&
                                                    currentUser.can.updateDepartmentInMACAU !== true &&
                                                    currentUser.can.disableDepartmentInMACAU !== true)
                                                || (content === 'departments' &&
                                                    region === 'manila' &&
                                                    currentUser.can.createDepartmentInMANILA !== true &&
                                                    currentUser.can.updateDepartmentInMANILA !== true &&
                                                    currentUser.can.disableDepartmentInMANILA !== true)
                                                || (content === 'positions' &&
                                                    region === 'macau' &&
                                                    currentUser.can.createPositionInMACAU !== true &&
                                                    currentUser.can.updatePositionInMACAU !== true &&
                                                    currentUser.can.disablePositionInMACAU !== true)
                                                || (content === 'positions' &&
                                                    region === 'manila' &&
                                                    currentUser.can.createPositionInMANILA !== true &&
                                                    currentUser.can.updatePositionInMANILA !== true &&
                                                    currentUser.can.disablePositionInMANILA !== true)) })}>
      <Dropdown overlay={menu}>
        <Button className={styles.operationBtn}>
          {formatMessage(messages['app.arch.operation.ctrl_button'])}<Icon type="caret-down" />
        </Button>
      </Dropdown>
    </div>
  );
}

OperationButton.propTypes = {
  record: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(OperationButton);
