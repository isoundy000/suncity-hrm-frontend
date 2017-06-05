import React from 'react';
import OperationModal from '../OperationModal';
import styles from './index.less';
import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function AddLocationButton({ ...props }) {
  const { formatMessage } = props.intl;
  const { currentUser, region } = props;

  const newLocation = formatMessage(messages['app.arch.operation.new_location']);

  return (
    <div>
      <div className={styles.addLocationButton}>
        <OperationModal {...props} itemTitle={newLocation} kind={"List"} />
      </div>
    </div>
  );
}

export default injectIntl(AddLocationButton);
