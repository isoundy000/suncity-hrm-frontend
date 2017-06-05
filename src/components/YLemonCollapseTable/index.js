/**
 * Created by meng on 16/9/1.
 */

import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Table, Button, Icon, Modal } from 'antd';
import classNames from 'classnames';

import { getLocaleText } from 'locales/messages';
import RowDeleteModal from './RowDeleteModal';
import RowEditModal from './RowEditModal';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';

import classes from './index.less';

import EDIT_ICON from './assets/bianji.png';
import DELETE_ICON from './assets/shanchu.png';

const DEFAULT_COL_WIDTH = 150;
const OPERATION_COL_WIDTH = 100;


const columnTitle = (field, locale) => (
  <span>{getLocaleText(field, locale)}</span>
);

const columnRender = schemaField => (
  (colItem, rowRecord, rowIndex) => {
    const field = _.clone(schemaField);
    field.value = colItem;

    //NOTE 特殊处理 档案页中学历信息中的 是否毕业
    if (field.key == 'graduated') {
      field.value = colItem == 'true' ? '是' : '否';
      return <YLemonFieldText field={field}/>
    }

    return <YLemonFieldText field={field} />
  }
);

class YLemonCollapseTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getTableColumns(props),
      rows: this.getTableRows(props),
      isCollapsed: true,
      isEditModalVisible: false,
      isDeleteModalVisible: false,
      isCreateModalVisible: false,
      currentRowIndex: null,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      rows: this.getTableRows(props)
    });
  }

  getTableRows(props) {
    if (props.sectionTemplate.rows) {
      return props.sectionTemplate.rows;
    } else {
      return [];
    }
  }

  getTableColumns(props) {
    const columns = props.sectionTemplate.schema.map(
      field => ({
        key:       field.key,
        dataIndex: field.key,
        width:     props.colWidth,
        title:     columnTitle(field, props.intl.locale),
        render:    columnRender(field),
      })
    );

    const buttonProps = {
      size:  'small',
      type:  'dashed',
      shape: 'circle',
      className: classes.operationButton,
    };


    if(!props.readonly) {
      columns.push({
        key:    'operation',
        width:  OPERATION_COL_WIDTH,
        render: (item, row, index) => (
          <div>
            <span
              className={classNames({ 'shouldNotShow': ((props.tableType === 'applicantProfile' &&
                                                         props.region === 'macau' &&
                                                         props.currentUser.can.updateApplicantProfileInMACAU !== true)
                                                     || (props.tableType === 'applicantProfile' &&
                                                         props.region === 'manila' &&
                                                         props.currentUser.can.updateApplicantProfileInMANILA !== true)
                                                     || (props.tableType === 'profile' &&
                                                         props.region === 'macau' &&
                                                         props.currentUser.can.updateProfileInMACAU !== true)
                                                     || (props.tableType === 'profile' &&
                                                         props.region === 'manila' &&
                                                         props.currentUser.can.updateProfileInMANILA !== true)) })}
            >
              <Button {...buttonProps} onClick={() => this.handleEdit(index)}>
                <img alt="edit" src={EDIT_ICON} />
              </Button>
            </span>

            <span
              className={classNames({ 'shouldNotShow': ((props.tableType === 'applicantProfile' &&
                                                         props.region === 'macau' &&
                                                         props.currentUser.can.updateApplicantProfileInMACAU !== true)
                                                     || (props.tableType === 'applicantProfile' &&
                                                         props.region === 'manila' &&
                                                         props.currentUser.can.updateApplicantProfileInMANILA !== true)
                                                     || (props.tableType === 'profile' &&
                                                         props.region === 'macau' &&
                                                         props.currentUser.can.updateProfileInMACAU !== true)
                                                     || (props.tableType === 'profile' &&
                                                         props.region === 'manila' &&
                                                         props.currentUser.can.updateProfileInMANILA !== true)) })}
            >
              <Button {...buttonProps} onClick={() => this.handleDelete(index)}>
                <img alt="delete" src={DELETE_ICON} />
              </Button>
            </span>
          </div>
        ),
      });
    }

    return columns;
  }

  getDataSource() {
    let lastRow = _.last(this.state.rows);
    const collapsedRows = lastRow ? [lastRow] : [];
    return this.state.isCollapsed ? collapsedRows : this.state.rows;
  }

  render() {
    const { intl, sectionTemplate, colWidth } = this.props;
    const totalWidth = (this.state.columns.length - 1) * colWidth + OPERATION_COL_WIDTH;
    return (
      <div className={classes.container}>
        <div className="panel panel-collapse">
          <div className="panel-heading" onClick={this.handleCollapsedToggle.bind(this)} >
            <div className="panel-title">
              <span>{getLocaleText(sectionTemplate, intl.locale)}</span>
              <small>({this.state.rows.length})</small>
              {
                this.state.rows.length > 1 ?
                (
                  <span className={classes.collapseIndicator}>
                    <Icon type={`caret-${this.state.isCollapsed ? 'left' : 'down'}`} />
                  </span>
                ) :
                null
              }
            </div>
          </div>
          <div className="panel-body">
            <Table
              locale={{emptyText:"暫無數據"}}
              columns={this.state.columns}
              dataSource={this.getDataSource()}
              pagination={false}
              scroll={{ x: totalWidth }}
            />

            {
              (this.props.isCreateButtonVisible && !this.props.readonly )?
              (

                <span
                  className={classNames({ 'shouldNotShow': ((this.props.tableType === 'applicantProfile' &&
                                                             this.props.region === 'macau' &&
                                                             this.props.currentUser.can.updateApplicantProfileInMACAU !== true)
                                                         || (this.props.tableType === 'applicantProfile' &&
                                                             this.props.region === 'manila' &&
                                                             this.props.currentUser.can.updateApplicantProfileInMANILA !== true)
                                                         || (this.props.tableType === 'profile' &&
                                                             this.props.region === 'macau' &&
                                                             this.props.currentUser.can.updateProfileInMACAU !== true)
                                                         || (this.props.tableType === 'profile' &&
                                                             this.props.region === 'manila' &&
                                                             this.props.currentUser.can.updateProfileInMANILA !== true)) })}
                >
                  <Button
                    className="btn-add"
                    type="primary"
                    size="large"
                    onClick={this.handleCreate.bind(this)}
                  >
                    <Icon type="plus" />
                    <span>增加一行</span>
                  </Button>
                </span>
              ) :
              null
            }
          </div>
        </div>

        <RowEditModal
          key="edit modal"
          visible={this.state.isEditModalVisible}
          onConfirm={this.handleEditOK.bind(this)}
          onCancel={this.handleEditCancel.bind(this)}
          sectionTemplate={sectionTemplate}
          defaultRowData={this.state.rows[this.state.currentRowIndex]}
        />

        <RowDeleteModal
          visible={this.state.isDeleteModalVisible}
          onConfirm={this.handleDeleteOK.bind(this)}
          onCancel={this.handleDeleteCancel.bind(this)}
        />

        <RowEditModal
          key="create modal"
          visible={this.state.isCreateModalVisible}
          onConfirm={this.handleCreateOK.bind(this)}
          onCancel={this.handleCreateCancel.bind(this)}
          sectionTemplate={sectionTemplate}
        />
      </div>
    );
  }

  handleEdit(rowIndex) {
    const lastIndex = this.state.rows.length - 1;
    const realIndex = this.state.isCollapsed ? lastIndex : rowIndex;
    this.setState({
      currentRowIndex: realIndex,
      isEditModalVisible: true,
    });
  }

  handleEditOK(rowData) {
    const row = this.state.rows[this.state.currentRowIndex]
    const rows = _.clone(this.state.rows);
    rows[this.state.currentRowIndex] = rowData;
    this.setState({
      rows,
      currentRowIndex: null,
      isEditModalVisible: false,
    });
    this.props.onUpdateRow(this.props.sectionTemplate.key, rowData, this.state.currentRowIndex, row);
  }

  handleEditCancel() {
    this.setState({
      currentRowIndex: null,
      isEditModalVisible: false,
    });
  }

  handleDelete(rowIndex) {
    const lastIndex = this.state.rows.length - 1;
    const realIndex = this.state.isCollapsed ? lastIndex : rowIndex;
    this.setState({
      currentRowIndex: realIndex,
      isDeleteModalVisible: true,
    });
  }

  handleDeleteOK() {
    const row = this.state.rows[this.state.currentRowIndex]
    const rows = _.clone(this.state.rows);
    rows.splice(this.state.currentRowIndex, 1);
    this.setState({
      rows,
      currentRowIndex: null,
      isDeleteModalVisible: false,
    });

    this.props.onDeleteRow(this.props.sectionTemplate.key, this.state.currentRowIndex, row);
  }

  handleDeleteCancel() {
    this.setState({
      currentRowIndex: null,
      isDeleteModalVisible: false,
    });
  }

  handleCreate() {
    this.setState({
      isCreateModalVisible: true,
    });
  }

  handleCreateOK(rowData) {
    const rows = _.clone(this.state.rows);
    rows.push(rowData);
    this.setState({
      rows,
      isCreateModalVisible: false,
    });

    this.props.onCreateRow(this.props.sectionTemplate.key, rowData);
  }

  handleCreateCancel() {
    this.setState({
      isCreateModalVisible: false,
    });
  }

  handleCollapsedToggle() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }
}

YLemonCollapseTable.propTypes = {
  sectionTemplate: PropTypes.shape({
    key: PropTypes.string.isRequired,
    chinese_name: PropTypes.string.isRequired,
    english_name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    schema: PropTypes.array.isRequired,
  }).isRequired,
  colWidth: PropTypes.number,
  onUpdateRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onCreateRow: PropTypes.func.isRequired,
};

YLemonCollapseTable.defaultProps = {
  isCreateButtonVisible: true,
  colWidth: DEFAULT_COL_WIDTH,
};

export default injectIntl(YLemonCollapseTable);
