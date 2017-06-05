import React from 'react';
import { Spin } from 'antd';
import YLemonBlock from 'components/YLemonBlock';
import JobsStatisticsItem from '../JobsStatisticsItem';
import WaitingForCheckInIcon from '../assets/waiting_for_check_in.png';
import WaitingForInterview from '../assets/waiting_for_interview.png';
import WaitingForFilter from '../assets/waiting_for_filter.png';
import WaitingForRegistry from '../assets/waiting_for_registry.png';

import classes from './index.less';

class JobsStatistics extends React.Component{
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
    return [
      {
        icon: WaitingForFilter,
        number: this.fetchItem('jobs_count'),
        itemName: '在招職位',
        className: classes.item,
        onClick() {
          dispatch({
            type: 'jobs/changeFilterState',
            payload: {id: 'enabled'}
          });

          dispatch({
            type: 'jobs/fetchJobsAction'
          });
        }
      },

      {
        icon: WaitingForInterview,
        number: this.fetchItem('profiles_plan_count'),
        itemName: '應有員工',
      },
      {
        icon: WaitingForRegistry,
        number: this.fetchItem('profiles_count'),
        itemName: '在職員工',
      },
      {
        icon: WaitingForCheckInIcon,
        number: this.fetchItem('need_count'),
        itemName: '空缺員工',
      },
    ].map((item) => {
      return (
        <JobsStatisticsItem
          icon={item.icon}
          number={item.number}
          itemName={item.itemName}
          key={item.itemName}
          className={item.className}
          onClick={item.onClick}
        />
      );
    });
  }

  render() {
    const items = this.items();
    return (
      <Spin spinning={this.loading()}>
        <YLemonBlock
          title="職位招聘"
          type="noneTitleBackground"
          content={items}
        />
      </Spin>
    );
  }
}

export default JobsStatistics;
