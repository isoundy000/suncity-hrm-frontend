import React from 'react';
import { routerRedux } from 'dva/router';
import YLemonBlock from 'components/YLemonBlock';
import SelectColumnsTemplate from 'components/SelectColumnsTemplate';
import Profiles from 'routes/profiles/ProfilesBlock/Profiles';
import { fieldsToColumns } from 'helpers/profiles';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';


class ApplicantProfilesBlock extends React.Component {
  actions() {
    return(
      <SelectColumnsTemplate
        dispatch={this.props.dispatch}
        handleAddColClick={() => {
          this.props.dispatch({
            type: 'applicantProfiles/toggleChangeColumnModal'
          });
        }}
        onChangeSelectedTemplate={(selectedTemplate) => {
          const columns = fieldsToColumns(selectedTemplate.select_columns);
          this.props.dispatch({
            type: 'applicantProfiles/setTableFields',
            payload: columns
          });
          this.props.dispatch({
            type: 'applicantProfiles/fetchProfiles'
          });
        }}

        onEditSelectedTemplate={(editedTemplate, currentTemplate) => {
          if (
              (currentTemplate == null && editedTemplate.default) ||
              (editedTemplate.id == _.get(currentTemplate, 'id'))
            ) {

            const columns = fieldsToColumns(editedTemplate.select_columns);

            this.props.dispatch({
              type: 'applicantProfiles/setTableFields',
              payload: columns
            });
            this.props.dispatch({
              type: 'applicantProfiles/fetchProfiles'
            });
          }
        }}

        onChangeColumnSubmit={({ fields }) => {
          this.props.dispatch({
            type: 'applicantProfiles/setTableFields',
            payload: fields
          });

          this.props.dispatch({
            type: 'applicantProfiles/fetchProfiles'
          });
        }}

        type="applicantProfile"
        editingViewColumns={this.props.editingViewColumns}
        tableFields={this.props.tableFields}
        toggleChangeColumnModal={() => {
          this.props.dispatch({
            type: 'applicantProfiles/toggleChangeColumnModal'
          });
        }}
      />
    );
  }

  title() {
    const { formatMessage } = this.props.intl;
    const applicantProfileForScreening = formatMessage(messages['app.applicant_profile.block.applicant_number']);

    if(this.props.totalNum != null) {
      return applicantProfileForScreening + '：' + this.props.totalNum;
    }else {
      return '';
    }
  }

  content() {
    return (
      <Profiles
        type="applicantProfiles"
        totalNum={this.props.totalNum}
        tableData={this.props.tableData}
        tableFields={this.props.tableFields}
        loadingProfiles={this.props.loadingProfiles}
        filterSearchStart={this.props.filterSearchStart}
        dispatch={this.props.dispatch}
        page={this.props.page}
        search_type={this.props.search_type}
        search_data={this.props.search_data}
        startSearch={this.props.startSearch}
        handleRowDoubleClick={(record) => {
            this.props.dispatch({
              type: 'applicantProfiles/showProfile',
              payload: record.id
            });
          }}
        handleChangePage={page => {
          this.props.dispatch({
            type: 'applicantProfiles/fetchProfiles',
            payload: {
              page: page
            }
          });
        }}
        handleMergeButtonClick={(record) => {
          this.props.dispatch(routerRedux.push(`/applicant_profiles/new?profileTemplateId=${record.id}`));
        }}
      />
    );
  }

  render() {
    const title = this.title();
    const content = this.content();
    const actions = this.actions();

    return (
      <YLemonBlock
        title={title}
        actions={actions}
        content={content}
        type="noneTitleBackground"
      />
    );
  }
}

export default injectIntl(ApplicantProfilesBlock);
