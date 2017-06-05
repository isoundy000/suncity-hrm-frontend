import React from 'react';
import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';
import YLemonBlock from 'components/YLemonBlock';
import JobsStatisticsItem from 'routes/jobs/JobsStatisticsItem';
import WaitingForCheckInIcon from 'routes/jobs/assets/waiting_for_check_in.png';
import WaitingForInterview from 'routes/jobs/assets/waiting_for_interview.png';
import WaitingForFilter from 'routes/jobs/assets/waiting_for_filter.png';
import WaitingForRegistry from 'routes/jobs/assets/waiting_for_registry.png';

import classes from './index.less';

class ApplicantProfileStatistics extends React.Component{
  loading() {
    return this.props.statistics == null;
  }

  fetchItem(key) {
    if(this.loading()) {
      return '...';
    }else {
      return this.props.statistics[key];
    }
  }

  items() {
    const { dispatch } = this.props;

    const { formatMessage } = this.props.intl;
    const applicantProfileForScreening = formatMessage(messages['app.applicant_profile.for_screening']);
    const applicantProfileWaitingInterviews = formatMessage(messages['app.applicant_profile.waiting_interviews']);
    const applicantProfileContractNeeded = formatMessage(messages['app.applicant_profile.contract_needed']);
    const applicantProfileEntyNeeded = formatMessage(messages['app.applicant_profile.entry_needed']);



    return [
      {
        icon: WaitingForFilter,
        key: 'choose_needed',
        itemName: applicantProfileForScreening,
        onClick() {
          dispatch({
            type: 'applicantProfiles/changeFilterState',
            payload: {key: 'choose_needed'}
          });
        }
      },
      {
        icon: WaitingForInterview,
        key: 'choose_failed',
        itemName: applicantProfileWaitingInterviews,
        onClick() {
          dispatch({
            type: 'applicantProfiles/changeFilterState',
            payload: {key: 'waiting_for_interview'}
          });
        }
      },
      {
        icon: WaitingForRegistry,
        key: 'contract_needed',
        itemName: applicantProfileContractNeeded,
        onClick() {
          dispatch({
            type: 'applicantProfiles/changeFilterState',
            payload: {key: 'contract_needed'}
          });
        }
      },
      {
        icon: WaitingForCheckInIcon,
        key: 'entry_needed',
        itemName: applicantProfileEntyNeeded,
        onClick() {
          dispatch({
            type: 'applicantProfiles/changeFilterState',
            payload: {key: 'entry_needed'}
          });
        }
      },
    ].map((item) => {
      return (
        <JobsStatisticsItem
          icon={item.icon}
          className={classes.item}
          number={this.fetchItem(item.key)}
          itemName={item.itemName}
          key={item.itemName}
          onClick={() => {
            item.onClick();
            dispatch({
              type: 'applicantProfiles/fetchProfiles'
            })
          }}
        />
      );
    });
  }

  render() {
    const items = this.items();

    return (
      <YLemonBlock
        title="求職者資料"
        type="noneTitleBackground"
        content={items}
      />
    );
  }
}

export default injectIntl(ApplicantProfileStatistics);
