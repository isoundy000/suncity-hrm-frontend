import React, { PropTypes } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import styles from './index.less';
import TabsPanel from './TabsPanel';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

function MyRecruit({ ...props }) {
  const { formatMessage } = props.intl;

  return (
    <section className={styles.container}>
      <Row>
        <Col md={24}>
          <TabsPanel />
        </Col>
      </Row>
    </section>
  );
}

export default injectIntl(MyRecruit);
