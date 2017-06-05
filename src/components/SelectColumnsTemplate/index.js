import React from 'react';
import { OrderedSet } from 'immutable';
import { Spin } from 'antd';
import ChangeColumnsModal from './ChangeColumnsModal';
import TemplatesDropdown from './TemplatesDropdown';
import classes from './index.less';

class SelectColumnsTemplate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  toggleLoadingState(setLoading){
    this.setState({
      isLoading: setLoading? true : false,
    });
  }

  handleAddColClick(){
    this.toggleLoadingState(true);
    this.props.handleAddColClick();
  }

  getChangeColumnsModalTargetKeys(){
    const targetKeys = this.props.tableFields.map((field) => {
      return field.key;
    });
    return targetKeys;
  }

  handleChangeColumnsModalCancel() {
    this.toggleChangeColumnModal();
  }

  handleChangeColumnsModalSubmit({ targetKeys, fields }) {
    this.props.onChangeColumnSubmit({
      targetKeys,
      fields
    });
    this.toggleChangeColumnModal();
  }

  toggleChangeColumnModal(){
    this.props.toggleChangeColumnModal();
  }

  changeColumnsModal() {
    const targetKeysSet = OrderedSet(this.getChangeColumnsModalTargetKeys());
    const targetKeys = targetKeysSet.subtract(['photo', 'apply_position', 'apply_department', 'apply_source', 'apply_date', 'apply_status']);

    return (
      <ChangeColumnsModal
        visible={true}
        targetKeys={targetKeys.toArray()}
        dispatch={this.props.dispatch}
        type={this.props.type}
        handleCancel={::this.handleChangeColumnsModalCancel}
        handleSubmit={::this.handleChangeColumnsModalSubmit}
        onChange={({ dataSourceReady }) => {
          if(dataSourceReady) {
            this.setState({
              isLoading: false
            });
          }
        }}
      />
    );
  }

  render() {

    return (
      <div>
        <Spin spinning={this.state.isLoading} >
          <TemplatesDropdown
            dispatch={this.props.dispatch}
            onChangeSelectedTemplate={this.props.onChangeSelectedTemplate}
            onEditSelectedTemplate={this.props.onEditSelectedTemplate}
            toggleLoadingState={::this.toggleLoadingState}
            type={this.props.type}
          />

          {
            this.props.editingViewColumns? this.changeColumnsModal() : null
          }

          <div
            className={classes.addColumnButton}
            onClick={::this.handleAddColClick}
            >
            <p>
              <strong> + </strong>添加項目
            </p>
          </div>
        </Spin>
      </div>
    );
  }
}

SelectColumnsTemplate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  onChangeSelectedTemplate: React.PropTypes.func,
  onChangeColumnSubmit: React.PropTypes.func,
  onEditSelectedTemplate: React.PropTypes.func,
};

export default SelectColumnsTemplate;
