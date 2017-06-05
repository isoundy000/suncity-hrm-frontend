import React from 'react';
import YLemonBlock from 'components/YLemonBlock';
import SelectColumnsTemplate from 'components/SelectColumnsTemplate';
import Profiles from './Profiles';
import { fieldsToColumns } from 'helpers/profiles';
import _ from 'lodash';
import classes from './index.less';

class ProfilesBlock extends React.Component{

  titleActions(){
    if(this.props.pageType != 'subordinate'){
      return(
        <SelectColumnsTemplate
          {...this.props}
          handleAddColClick={() => {
          this.props.dispatch({
            type: 'profiles/toggleChangeColumnModal'
            });
          }}
          onChangeSelectedTemplate={(selectedTemplate) => {
            const columns = fieldsToColumns(selectedTemplate.select_columns);
            this.props.dispatch({
              type: 'profiles/setSelectedTableFields',
              payload: columns
            });
          }}

          onEditSelectedTemplate={(editedTemplate, currentTemplate) => {
            if (
                (currentTemplate == null && editedTemplate.default) ||
                (editedTemplate.id == _.get(currentTemplate, 'id'))
              ) {

              const columns = fieldsToColumns(editedTemplate.select_columns);

              this.props.dispatch({
                type: 'profiles/setSelectedTableFields',
                payload: columns
              });

              this.props.dispatch({
                type: 'profiles/startFilter'
              });
            }
          }}

          onChangeColumnSubmit={({ targetKeys, fields }) => {
            const TableFields = targetKeys.map((key) => {
              return fields.filter((field) => {
                if(field.key === key) return true;
              })[0];
            });

            this.props.dispatch({
              type: 'profiles/setSelectedTableFields',
              payload: TableFields
            });

            const { search_type, search_data, region, startSearch } = this.props;
            const params = { search_type, search_data, region, startSearch };

            this.props.dispatch({
              type: 'profiles/startFilter',
              payload: params
            });
          }}

          toggleChangeColumnModal={() => {
            this.props.dispatch({
              type: 'profiles/toggleChangeColumnModal'
            });
          }}

          type="profile"
        />
      );
    }

    else {
      return null;
    }
  }

  buildContent(){
    return(
      <Profiles
        {...this.props}
        handleRowDoubleClick={(record) => {
          this.props.dispatch({
            type: 'profiles/showProfile',
            payload: record.id
          });
        }}
        handleChangePage={page => {
          this.props.dispatch({
            type: 'profiles/startFilter',
            payload: {
              page: page
            }
          });
        }}
      />
    );
  }

  render() {
    const actions = this.titleActions();
    const content = this.buildContent();

    let title = '';
    if(this.props.pageType != 'search'){
      title = "人數" + this.props.totalNum;
    }else{
      title = "搜索結果共" + this.props.totalNum + "條";
      if(this.props.params.search_data !== undefined){
        title = `關鍵字"${this.props.params.search_data}"的${title}`;
      }
    }

    return (
      <div className={classes.listMiddle}>
        <YLemonBlock
          title={title}
          actions={actions}
          content={content}
          type="noneTitleBackground"
        />
      </div>
    )
  }
}

export default ProfilesBlock;
