import React, { PropTypes } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import TabsTitle from '../TabsTitle';
import DataTable from '../DataTable';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const TabPane = Tabs.TabPane;

function TabsPanel({ dataSource, dispatch, region, currentUser, ...props }) {
  const { formatMessage } = props.intl;
  const tabPanelTitle = formatMessage(messages['app.arch.tabpanel.tabpanel_title']);
  const forDepartments = formatMessage(messages['app.arch.tabpanel.for_departments']);
  const forPositions = formatMessage(messages['app.arch.tabpanel.for_positions']);
  const forLocations = formatMessage(messages['app.arch.tabpanel.for_locations']);

  return (
    <div className={styles.tabsPanel}>
      <Tabs
        tabBarExtraContent={<TabsTitle name={tabPanelTitle} />}
      >

        <TabPane tab={forDepartments} key="1">
          <DataTable
            content={'departments'}
            db={dataSource}
            dispatch={dispatch}
            loading={dataSource.loading.departments}
            data={dataSource.completedTree.departments}
            region={region}
            currentUser={currentUser}
          />
        </TabPane>

        <TabPane tab={forPositions} key="2">
          <DataTable
            content={'positions'}
            db={dataSource}
            dispatch={dispatch}
            loading={dataSource.loading.positions}
            data={dataSource.completedTree.positions}
            region={region}
            currentUser={currentUser}
          />
        </TabPane>

        <TabPane tab={forLocations} key="3">
          <div className={styles.locationsTable}>
            <DataTable
              content={'locations'}
              db={dataSource}
              dispatch={dispatch}
              loading={dataSource.loading.locations}
              data={dataSource.completedTree.locations}
              region={region}
              currentUser={currentUser}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

TabsPanel.propTypes = {
};

export default injectIntl(TabsPanel);
