import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Icon } from 'antd';
import styles from './index.less';
import TabsPanel from './TabsPanel';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

function ApplicantAll({ profileId, dispatch, region, currentUser, ...props }) {
  const { formatMessage } = props.intl;
  if(   !((region === 'macau' &&
           currentUser.can.manageApplicationLogInMACAU === true)
       || (region === 'manila' &&
           currentUser.can.manageApplicationLogInMANILA === true))){
    dispatch({type: 'newApplicantProfile/setProfileOnly', payload: true});
  }
  return (
    <section className={styles.container}>
      <Row>
        <Col md={24}>
          <TabsPanel profileId={profileId} dispatch={dispatch} />
        </Col>
      </Row>
    </section>
  );
}

export default connect(({
  currentUser, 
  region, 
  newApplicantProfile: {
    profileId
  }
}) => ({
  currentUser, 
  region, 
  profileId
}))(injectIntl(ApplicantAll));
