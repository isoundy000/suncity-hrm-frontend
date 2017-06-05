import React from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';
import JobsStatistics from './JobsStatistics';
import JobsFilters from './JobsFilters';
import NewJobModal from './NewJobModal';
import EditJobModal from './EditJobModal';
import JobsTable from './JobsTable';
import classes from './index.less';
import GreenPagination from '../../components/GreenPagination';
import classNames from 'classnames';

class JobsPage extends React.Component {

  constructor() {
    super();
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage(value) {
    this.props.dispatch({
      type: 'jobs/fetchJobsAction',
      payload: {
        page: value,
      }
    });
  }

  render (){
    return (
      <div className={classes.wrapper}>
        <JobsStatistics statistics={this.props.jobs.jobsStatistics} dispatch={this.props.dispatch}/>
        <JobsFilters
          dispatch={this.props.dispatch}
          currentUser={this.props.currentUser}
          region={this.props.region}
        />
        {this.props.jobs.addingNewJob  ? <NewJobModal dispatch={this.props.dispatch}/> : null}
        <JobsTable
          jobs={this.props.jobs}
          dispatch={this.props.dispatch}
          currentUser={this.props.currentUser}
          region={this.props.region}
        />

        {
          this.props.jobs.hasOwnProperty('jobsMeta') ?
            this.props.jobs.jobsMeta.total_count > 0
              ?
              <div className={classes.pagination}>
                <GreenPagination
                  className={classNames('ant-pagination', classes.pager)}
                  defaultCurrent={1}
                  current={this.props.jobs.jobsMeta.current_page}
                  total={this.props.jobs.jobsMeta.total_count}
                  onChange={this.handleChangePage}
                />
              </div>
              :
              <section />
            : null
        }

        {this.props.jobs.jobOnEditing ? <EditJobModal job={this.props.jobs.jobOnEditing} dispatch={this.props.dispatch} /> : null}
      </div>
    );
  }
}

const mapStateToProps = ({ jobs, currentUser, region }) => ({
  jobs,
  currentUser,
  region,
});

export default connect(mapStateToProps)(injectIntl(JobsPage));
