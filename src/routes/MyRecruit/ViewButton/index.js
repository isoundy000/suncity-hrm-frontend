import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './index.less';
import { Button } from 'antd';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function ViewButton({ cardDataId, applicantProfileId, ...props }) {
  const { formatMessage } = props.intl;
  const viewButtonText = formatMessage(messages['app.my_recruit.card_content.view_button']);

  const handleOnClick = () => {};

  return (
    <div className={styles.viewButton}>
      <Link
        to={`/applicant_profiles/${applicantProfileId}?readonly=true&profileOnly=true`}
      >
        <Button>{viewButtonText}</Button>
      </Link>
    </div>
  );
}

ViewButton.propTypes = {
};

export default injectIntl(ViewButton);
