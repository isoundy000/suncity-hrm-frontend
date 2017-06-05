import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs } from 'antd';
import styles from './index.less';

import RoleTitle from '../RoleTitle';
import RolePermissionsTable from '../RolePermissionsTable';
import AddPermissionModal from '../Modals/AddPermissionModal';
/* import RegionFilter from '../RegionFilter';*/

import RoleUsersTable from '../RoleUsersTable';
import AddUserModal from '../Modals/AddUserModal';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const TabPane = Tabs.TabPane;

function TabsPanel({ role, currentUser, region, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  return (
    <div className={styles.tabsPanel}>
      <Tabs
        tabBarExtraContent={<RoleTitle role={role} dispatch={dispatch} />}
      >

        <TabPane tab={`權限`} key="1">
          <div>
            <Row>
              {/* <Col md={5}> */}
              {/* <div className={styles.regionFilter}> */}
              {/* <RegionFilter */}
              {/* role={role} */}
              {/* region={region} */}
              {/* dispatch={dispatch} */}
              {/* {...props} */}
              {/* /> */}
              {/* </div> */}
              {/* </Col> */}

              <Col md={3} offset={21}>
                <div className={styles.addBtn}>
                  <AddPermissionModal
                    role={role}
                    region={region}
                    dispatch={dispatch}
                    {...props}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <RolePermissionsTable
            role={role}
            dispatch={dispatch}
            {...props}
          />
        </TabPane>

        <TabPane tab={`員工`} key="2">
          <div className={styles.addBtn}>
            <AddUserModal
              role={role}
              dispatch={dispatch}
              {...props}
            />
          </div>

          <RoleUsersTable
            role={role}
            dispatch={dispatch}
            {...props}
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
