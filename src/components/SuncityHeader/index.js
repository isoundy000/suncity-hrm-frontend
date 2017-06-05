/**
 * Created by meng on 16/9/14.
 */

import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router';
import { injectIntl } from 'react-intl';

import { Menu, Dropdown, Icon, Input, Button, Select, Badge, Popover, Tabs, Table } from 'antd';
import classNames from 'classnames';

import AdvancedSearchModal from './AdvancedSearchModal';
import { getMessage, getLocaleText } from '../../locales/messages';
import classes from './index.less';
import { navigationMenu } from './menu';

import { LOCALE } from '../../constants/GlobalConstants';
import { LANG } from '../../constants/GlobalConstants';

import MarkAllButton from '../../routes/myMessages/MarkAllButton';
import MessageContent from '../../routes/myMessages/MessageContent/';

const isObjectEmpty = (obj) => {
  for ( let key in obj) {
    return false;
  }
  return true;
}

const getRegionMenu = (intl, currentRegion, dispatch) => {
  const otherRegion = currentRegion === REGION.MANILA ? REGION.MACAU : REGION.MANILA;
  const regionMessage = getMessage(otherRegion === REGION.MANILA ? 'app.global.manila' : 'app.global.macau');
  const handleClick = () => {
    dispatch({
      type: 'region/toggleRegion',
    });
  };

  return (
    <Menu>
      <Menu.Item>
        <span onClick={handleClick}>
          {`${intl.formatMessage(getMessage('app.global.switchto'))}${intl.formatMessage(regionMessage)}`}
        </span>
      </Menu.Item>
    </Menu>
  )
};

const getLang = (lang) => {
  if (lang === LANG.TW) {
    return getMessage('app.global.tw')
  } else if (lang === LANG.EN) {
    return getMessage('app.global.en')
  } else if (lang === LANG.CN) {
    return getMessage('app.global.cn')
  }
}

const getLangMenu = (intl, currentLang, dispatch) => {
  console.log(Object.values(LANG), currentLang);

  const handleClick = (item) => {
    const lang = Object.values(LANG).filter(lang => lang !== currentLang)[parseInt(item.key)];

    dispatch({
      type: 'locales/switchLang',
      payload: {
        lang,
      },
    });
  };

  return (
    <Menu onClick={handleClick}>
      {
        Object.values(LANG).filter(lang => lang !== currentLang).map((lang, index) => {
          return (
            <Menu.Item key={`${index}`}>
              <span>
                {`${intl.formatMessage(getMessage('app.global.switchto'))}${intl.formatMessage(getLang(lang))}`}
              </span>
            </Menu.Item>
          )
        })
      }
    </Menu>
  )
};

const getProfileMenu = (intl, dispatch, currentUser, region) => {
  const handleLogout = () => {
    dispatch({
      type: 'currentUser/removeCurrentUser',
    });
  };

  const redirectToRoles = () => {
    dispatch({
      type: 'roleList/redirectToRoles',
    });
  };

  return (
    <Menu>
      <Menu.Item>
        <span onClick={handleLogout}>
          {intl.formatMessage(getMessage('app.global.logout'))}
        </span>
      </Menu.Item>

      <Menu.Item
        className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                   currentUser.can.adminglobalInMACAU !== true)
                                               || (region === 'manila' &&
                                                   currentUser.can.adminglobalInMANILA !== true)) })}
      >
        <span onClick={redirectToRoles}>
          {intl.formatMessage(getMessage('app.role_list.title'))}
        </span>
      </Menu.Item>
    </Menu>
  );
};

const SuncityHeader = ({ intl, region, header, currentUser, myMessages, dispatch, locales, lang }) => {
  const handleSearchTypeSelected = (value, option) => {
    dispatch({
      type: 'header/searchTypeSelected',
      payload: value,
    });

    dispatch({
      type: 'header/searchTextChanged',
      payload: '',
    });
  };

  const handleSearchTextChange = (e) => {
    dispatch({
      type: 'header/searchTextChanged',
      payload: e.target.value,
    });
  };

  const handleSearchCommit = () => {
    dispatch({
      type: 'header/searchCommit',
    });
  };

  const handleAdvancedSearch = () => {
    dispatch({
      type: 'advancedSearch/showModal',
    });
  };

  const notificationsText = intl.formatMessage(getMessage('app.messages.tabpanel.notifications'));
  const tasksText = intl.formatMessage(getMessage('app.messages.tabpanel.tasks'));
  const moreMessagesText = intl.formatMessage(getMessage('app.global.more_messages'));

  const TabPane = Tabs.TabPane;
  const columns = [
    {
      title: 'message',
      dataIndex: 'message',
      key: 'message',
      width: 339,
      render: (text, record) => {
        return (
          <div>
            <div className={classes.recordContent}>
              <MessageContent
                record={record}
                content={myMessages.markContent}
                currentPage={1}
                dispatch={dispatch}
              />
            </div>
            <div className={classes.recordTime}>
              {record.created_at}
            </div>
          </div>
        )
      },
    },
  ];

  const task = 'task';
  const notification = 'notification';

  const handleOnClick = (key) => {
    if (key === '1') {
      dispatch({
        type: 'myMessages/changeMarkContent',
        payload: {
          content: notification,
        },
      });
    } else {
      dispatch({
        type: 'myMessages/changeMarkContent',
        payload: {
          content: task,
        },
      });
    }
  }

  const handleMarkRead = (record) => {
    dispatch({
      type: 'myMessages/markRead',
      payload: {
        type: myMessages.markContent,
        id: record.id,
        currentPage: 1,
      },
    });
  }

  const handleVisibleChange = (visible) => {
    dispatch({
      type: 'myMessages/handlePopoverVisible',
      payload: {
        visible,
      },
    });
  }

  const hidePopover = () => {
    dispatch({
      type: 'myMessages/hidePopover',
      payload: {
        status: false,
      },
    });
  }

  const msgContent = (
    <div className={classes.popoverContent}>
      <Tabs
        onTabClick={handleOnClick}
        tabBarExtraContent={<MarkAllButton content={myMessages.markContent} dispatch={dispatch} />}
      >
        <TabPane tab={`${notificationsText} (${myMessages.count[notification]})`} key="1">
          <Table
            locale={{emptyText:"暫無數據"}}
            columns={columns}
            dataSource={myMessages.msgBoxLists[notification]}
            pagination={false}
            scroll={{ y: 270 }}
            showHeader={false}
            rowClassName={(record) => record.read_status}

            footer={() => (
                <Link to="/messages" onClick={hidePopover}>
        { moreMessagesText }
                <Icon type="right" />
                </Link>
              )}
          />
        </TabPane>

        <TabPane tab={`${tasksText} (${myMessages.count[task]})`} key="2">
          <Table
            locale={{emptyText:"暫無數據"}}
            columns={columns}
            dataSource={myMessages.msgBoxLists[task]}
            pagination={false}
            scroll={{ y: 270 }}
            showHeader={false}
            rowClassName={(record) => record.read_status}
            footer={() => (
                <Link to="/messages?tab=tasks" onClick={hidePopover}>
                  { moreMessagesText }
                <Icon type="right" />
                </Link>)}
          />
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.leftSection}>
          {/* LOGO */}
          <div className={classes.logo}>
            <Link to="/">
              <div className={classes.logoImage} />
            </Link>
          </div>

          {/* NAVIGATION */}
          <Menu
            mode="horizontal"
            className={classes.naviSection}
          >
            {
              navigationMenu(classes).map(menu => (
                <Menu.SubMenu
                  key={menu.key}
                  title={getLocaleText(menu, intl.locale)}
                  className={classNames(classes.naviItem,
                                        menu.className,
                                        { 'shouldNotShow': ((menu.english_name === 'profiles' &&
                                                             region === 'macau' &&
                                                             currentUser.can.manageProfileInMACAU !== true &&
                                                             currentUser.can['access_company_structure_managementglobalInMACAU'] !== true)
                                                         || (menu.english_name === 'profiles' &&
                                                             region === 'manila' &&
                                                             currentUser.can.manageProfileInMANILA !== true &&
                                                             currentUser.can['access_company_structure_managementglobalInMANILA'] !== true)
                                                         || (
                                                           menu.english_name === 'Recruit' &&
                                                           menu.submenu.filter(item => {
                                                             return (item.english_name === 'Applicant Profiles' &&
                                                                     region === 'macau' &&
                                                                     currentUser.can.createApplicantProfileInMACAU !== true &&
                                                                     currentUser.can.updateApplicantProfileInMACAU !== true)
                                                                 || (item.english_name === 'Applicant Profiles' &&
                                                                     region === 'manila' &&
                                                                     currentUser.can.createApplicantProfileInMANILA !== true &&
                                                                     currentUser.can.updateApplicantProfileInMANILA !== true)
                                                                 || (item.english_name === 'Jobs' &&
                                                                     region === 'macau' &&
                                                                     currentUser.can.createJobInMACAU !== true &&
                                                                     currentUser.can.updateJobInMACAU !== true)
                                                                 || (item.english_name === 'Jobs' &&
                                                                     region === 'manila' &&
                                                                     currentUser.can.createJobInMANILA !== true &&
                                                                     currentUser.can.updateJobInMANILA !== true)
                                                                 || (item.english_name === 'EntryFile' &&
                                                                     region === 'macau' &&
                                                                     currentUser.can.manage_missingProfileInMACAU !== true)
                                                                 || (item.english_name === 'EntryFile' &&
                                                                     region === 'manila' &&
                                                                     currentUser.can.manage_missingProfileInMANILA !== true)
                                                           }).length === menu.submenu.length
                                                         ))})}
                >
                  {
                    menu.submenu.map(item => (
                      <Menu.Item
                        key={item.key}
                        className={classNames({ 'shouldNotShow': ((item.english_name === 'Employee Profiles' &&
                                                                   region === 'macau' &&
                                                                   currentUser.can.manageProfileInMACAU !== true)
                                                               || (item.english_name === 'Employee Profiles' &&
                                                                   region === 'manila' &&
                                                                   currentUser.can.manageProfileInMANILA !== true)
                                                               || (item.english_name === 'Architecture' &&
                                                                   region === 'macau' &&
                                                                   currentUser.can['access_company_structure_managementglobalInMACAU'] !== true)
                                                               || (item.english_name === 'Architecture' &&
                                                                   region === 'manila' &&
                                                                   currentUser.can['access_company_structure_managementglobalInMANILA'] !== true)
                                                               || (item.english_name === 'Applicant Profiles' &&
                                                                   region === 'macau' &&
                                                                   currentUser.can.createApplicantProfileInMACAU !== true &&
                                                                   currentUser.can.updateApplicantProfileInMACAU !== true)
                                                               || (item.english_name === 'Applicant Profiles' &&
                                                                   region === 'manila' &&
                                                                   currentUser.can.createApplicantProfileInMANILA !== true &&
                                                                   currentUser.can.updateApplicantProfileInMANILA !== true)
                                                               || (item.english_name === 'Jobs' &&
                                                                   region === 'macau' &&
                                                                   currentUser.can.createJobInMACAU !== true &&
                                                                   currentUser.can.updateJobInMACAU !== true)
                                                               || (item.english_name === 'Jobs' &&
                                                                   region === 'manila' &&
                                                                   currentUser.can.createJobInMANILA !== true &&
                                                                   currentUser.can.updateJobInMANILA !== true)
                                                               || (item.english_name === 'EntryFile' &&
                                                                   region === 'macau' &&
                                                                   currentUser.can['manage_missingProfileInMACAU'] !== true)
                                                               || (item.english_name === 'EntryFile' &&
                                                                   region === 'manila' &&
                                                                   currentUser.can['manage_missingProfileInMANILA'] !== true)
                          )})}
                      >
                        <Link to={item.url}>
                          {getLocaleText(item, intl.locale)}
                        </Link>
                      </Menu.Item>
                    ))
                  }
                </Menu.SubMenu>
              ))
            }
          </Menu>
        </div>

        <div className={classes.rightSection}>
          {/* SEARCH AREA */}
          {header.showSearchBox
            ?<div className={classes.searchArea}>
            <Select
              className={classes.searchType}
              value={header.searchType}
              size="large"
              onSelect={handleSearchTypeSelected}
            >
              {
                header.searchCategories.map(category => (
                  <Select.Option value={category.search_type}  key={category.search_type} >
                    {getLocaleText(category, intl.locale)}
                  </Select.Option>
                ))
              }
            </Select>

            <Input
              className={classes.searchInput}
              value={header.searchText}
              onChange={handleSearchTextChange}
              onPressEnter={handleSearchCommit}
            />

            <Button icon="search" className={classes.searchButton} onClick={handleSearchCommit} />

            <Button className={classes.advanceSearch} onClick={handleAdvancedSearch}>
              <span>高級</span>
              <span>搜索</span>
            </Button>
          </div> : null }

          <span>
            {intl.formatMessage(
               getMessage('app.global.macau')
             )}
          </span>

          {/* SWITCH REGION */}

          {/* For 1AND2 */}
          {/* <div className={classes.switchRegion}>
          <Dropdown
          overlay={getRegionMenu(intl, region, dispatch)}
          >
          <span>
          {intl.formatMessage(
          getMessage(region === REGION.MANILA ? 'app.global.manila' : 'app.global.macau')
          )}
          </span>
          </Dropdown>
          </div>
          */}

          {
            <div className={classes.switchRegion}>
              <Dropdown
                overlay={getLangMenu(intl, locales.lang, dispatch)}
              >
                <span>
                  {
                    intl.formatMessage(getLang(locales.lang))
                  }
                </span>
              </Dropdown>
            </div>
          }

          {/* MAIL */}
      <Badge
        count={myMessages.totalUnreadCount}
        className={classes.msgBox}
          >
            <Popover
              placement="bottomLeft"
              arrowPointAtCenter
              content={msgContent}
              trigger="hover"
              visible={myMessages.popoverVisible}
              onVisibleChange={handleVisibleChange}
              overlayClassName={classes.PopoverContainer}
            >
              <Link to="/messages">
                <Icon
                  type="notification"
                />
              </Link>
            </Popover>

          </Badge>

          {/* PROFILE AREA */}
          <div className={classes.profileArea}>
            <Dropdown
              overlay={getProfileMenu(intl, dispatch, currentUser, region)}
            >
              <span>{getLocaleText(currentUser, intl.locale)}</span>
            </Dropdown>
          </div>
        </div>
      </div>
      <AdvancedSearchModal
        searchType={header.searchType}
        region={region}
        currentUser={currentUser}
       />
    </div>
  );
};

const mapStateToProps = ({ region, header, currentUser, myMessages, roleList, locales, lang }) => ({
  region,
  header,
  currentUser,
  myMessages,
  roleList,
  locales,
  lang,
});

export default connect(mapStateToProps)(injectIntl(SuncityHeader));
