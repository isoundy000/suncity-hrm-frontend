import React from 'react';
import { connect } from 'dva';
import { Lifecycle } from 'dva/router';
import classes from './index.less';
import ApplicantProfileStatistics from './ApplicantProfileStatistics';
import ApplicantProfilesFilter from './ApplicantProfilesFilter';
import ApplicantProfilesBlock from './ApplicantProfilesBlock';

const ApplicantProfilePage = React.createClass({
  mixins: [ Lifecycle ],

  routerWillLeave(nextLocation) {
    this.props.dispatch({
      type: 'header/searchTextChanged',
      payload: '',
    })
  },

  render() {
    const { applicantProfiles } = this.props;
    return (
      <div className={classes.container}>
        <ApplicantProfileStatistics
          statistics={applicantProfiles.statistics}
          dispatch={this.props.dispatch}
        />

        <ApplicantProfilesFilter
          dispatch={this.props.dispatch}
          showSearchModal={applicantProfiles.showSearchModal}
          advanceSearch={applicantProfiles.advanceSearch}
          exportExcel={applicantProfiles.exporting}
          currentUser={this.props.currentUser}
          editingExportingColumns={applicantProfiles.editingExportingColumns}
          tableFields={applicantProfiles.tableFields}
          region={this.props.region}
        />

        <ApplicantProfilesBlock
          tableData={applicantProfiles.tableData}
          tableFields={applicantProfiles.tableFields}
          loadingProfiles={applicantProfiles.loadingProfiles}
          filterSearchStart={applicantProfiles.filterSearchStart}
          editingViewColumns={applicantProfiles.editingViewColumns}
          dispatch={this.props.dispatch}
          totalNum={applicantProfiles.totalNum}
          page={applicantProfiles.page}
          search_type={applicantProfiles.search_type}
          search_data={applicantProfiles.search_data}
          startSearch={applicantProfiles.startSearch}
        />
      </div>
    );
  }

});

export default connect(({ applicantProfiles, currentUser, region, header }) => ({
  applicantProfiles,
  currentUser,
  region,
  header,
}))(ApplicantProfilePage);
