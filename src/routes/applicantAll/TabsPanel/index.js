import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs, Affix } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';

import EditApplicantProfilePage from '../../applicant_profile_show';
import JobApplication from '../../jobApplication';
import SunCityAPISelect from 'components/SunCityAPISelect';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const TabPane = Tabs.TabPane;

class TabsPanel extends React.Component {

  tabs() {
    const { dispatch } = this.props;
    const { formatMessage } = this.props.intl;

    const applicantProfileText = formatMessage(messages['app.applicant_all.applicant_profile']);
    const jobApplicationText = formatMessage(messages['app.applicant_all.job_application']);

    const applicantProfileTab = {
      id: 0,
      title: applicantProfileText,
      content: EditApplicantProfilePage,
      disabled: false,
      beforeToggle: () => {
        dispatch({type: 'newApplicantProfile/refreshApplicantProfile'})
      }
    };

    const jobApplicationTab = {
      id: 1,
      title: jobApplicationText,
      content: JobApplication,
      disabled: false,
    };

    const fullTabs = this.props.profileOnly ?
                     [ applicantProfileTab ] :
                     [ applicantProfileTab, jobApplicationTab ]

    return fullTabs.map(tab => { return tab });
  }

  changeProfileSelect(profileId, dispatch) {
    const endpoint = `applicant_profiles/${profileId}/same_id_card_number_profiles`;
    return (
      <SunCityAPISelect
        type={endpoint}
        key={profileId}
        hasDefaultOption={false}
        textField="created_at"
        value={profileId}
        onChange={value => {
          dispatch(routerRedux.push(`/applicant_profiles/${value.id}`));
        }}
      />
    );
  }

  content() {
    const { activeTabId } = this.props;
    const tab = this.tabs().find(tab => tab.id == this.props.activeTabId);

    if (tab.beforeToggle) {
      tab.beforeToggle();
    }
    return React.createElement(tab.content);
  }

  render() {
    const tabs = this.tabs();
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            {
              tabs.map(tab => {
                const active = this.props.activeTabId == tab.id;
                const disabled = tab.disabled;
                return (
                  <div
                    className={classNames(styles.tab, {active, disabled})}
                    key={tab.id}
                    onClick={() => {
                        if (disabled) {

                        } else {
                          this.props.dispatch({
                            type: 'jobApplication/selectActiveTabId',
                            payload: {
                              activeTabId: tab.id,
                            }
                          });
                        }
                      }}
                  >
                    {tab.title}
                  </div>
                );
              })
            }
          </div>

          <div className={styles.applyDate}>
            <span>投遞時間</span>{this.changeProfileSelect(this.props.profileId, this.props.dispatch)}
          </div>

        </div>
        <div className={styles.content}>
          {this.content()}
        </div>
      </div>
    );
  }
}

TabsPanel.propTypes = {

};

export default connect(({
  jobApplication: {
    activeTabId,
  },
  newApplicantProfile: {
    readonly,
    profileOnly,
  }
}) => ({
  activeTabId,
  readonly,
  profileOnly,
}))(injectIntl(TabsPanel));
