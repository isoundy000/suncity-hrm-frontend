import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';
import PanelTitle from '../PanelTitle';
import CardBoard from '../CardBoard';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const TabPane = Tabs.TabPane;

function TabsPanel({ myRecruit, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const tabPanelTitle = formatMessage(messages['app.my_recruit.tabpanel.title']);
  const forScreening = formatMessage(messages['app.my_recruit.tabpanel.for_screening']);
  const forMyInterviews = formatMessage(messages['app.my_recruit.tabpanel.my_interviews']);

  const audiences = 'audiences';
  const interviewers = 'interviewers';

  const handleTabClick = (key) => {
    dispatch({
      type: 'myRecruit/toggleActiveKey',
      payload: {
        nowActiveKey: key,
      },
    });
  }

  return (
    <div className={styles.tabsPanel}>
      <Tabs
        activeKey={myRecruit.activeKey}
        onChange={handleTabClick}
        tabBarExtraContent={<PanelTitle name={tabPanelTitle} />}
      >

        <TabPane tab={`${forScreening} (${myRecruit.counts[audiences]})`} key="1">
          <CardBoard
            content={audiences}
            list={myRecruit.lists[audiences]}
            currentList={myRecruit.lists['audiencesCurrentPage']}
            currentPage={myRecruit.currentPage[audiences]}
            count={myRecruit.counts[audiences]}
            pageSize={myRecruit.pageSize}
            dispatch={dispatch}
            db={myRecruit}
          />
        </TabPane>

        <TabPane tab={`${forMyInterviews} (${myRecruit.counts[interviewers]})`} key="2">
          <CardBoard
            content={interviewers}
            list={myRecruit.lists[interviewers]}
            currentList={myRecruit.lists['interviewersCurrentPage']}
            currentPage={myRecruit.currentPage[interviewers]}
            count={myRecruit.counts[interviewers]}
            pageSize={myRecruit.pageSize}
            dispatch={dispatch}
            db={myRecruit}
          />
        </TabPane>

      </Tabs>
    </div>
  );
}

TabsPanel.propTypes = {
};

const mapStateToProps = ({ myRecruit }) => ({
  myRecruit,
});

export default connect(mapStateToProps)(injectIntl(TabsPanel));
