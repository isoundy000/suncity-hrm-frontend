import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';

import PanelTitle from '../PanelTitle';
import MessageBoard from '../MessageBoard';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const TabPane = Tabs.TabPane;

function TabsPanel({ myMessages, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const tabPanelTitle = formatMessage(messages['app.messages.tabpanel.messages_title']);
  const notificationsText = formatMessage(messages['app.messages.tabpanel.notifications']);
  const tasksText = formatMessage(messages['app.messages.tabpanel.tasks']);

  const task = 'task';
  const notification = 'notification';

  const handleTabClick = () => {
    dispatch({
      type: 'myMessages/toggleActiveKey',
    });
  }

  return (
    <div className={styles.tabsPanel}>
      <Tabs
        activeKey={myMessages.activeKey}
        onTabClick={handleTabClick}
        tabBarExtraContent={<PanelTitle name={tabPanelTitle} />}
      >
        <TabPane tab={`${notificationsText} (${myMessages.count[notification]})`} key="1">
          <MessageBoard
            content={notification}
            list={myMessages.lists[notification]}
            pagination={myMessages.pagination[notification]}
            dispatch={dispatch}
            db={myMessages}
          />
        </TabPane>
        <TabPane tab={`${tasksText} (${myMessages.count[task]})`} key="2">
          <MessageBoard
            content={task}
            list={myMessages.lists[task]}
            pagination={myMessages.pagination[task]}
            dispatch={dispatch}
            db={myMessages}
          />
        </TabPane>
      </Tabs>

    </div>
  );
}

TabsPanel.propTypes = {
};

const mapStateToProps = ({ myMessages }) => ({
  myMessages,
});

export default connect(mapStateToProps)(injectIntl(TabsPanel));
