import { Button, Icon, Input, Table, message } from "antd";
import React, { Component, PropTypes } from 'react';

import moment from 'moment';
import styles from "../shiftUserSetting.less";

const confirm = () => {
  message.success('已刪除!')
};
const cancel = () => {
  message.success('取消')
};

let dispatch = null;

class TableBlock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
      searchText: '',
    };
    dispatch = props.dispatch;
    this.onInputChange = this.onInputChange.bind(this)
  }

  handleChangePage(page) {
    dispatch({
      type: 'shiftUserSetting/search',
      payload: {
        type: 'page',
        searchText: page
      }
    })
  }

  getPositionFilter() {
    const data = this.props.state.dataTable;
    let filter = [];
    const positions = this.props.state.positions;
    const shifts = this.props.state.shifts;
    if (positions != null) {
      data.map(col => {
        const text = positions.find(position => position.id == col.position_id).chinese_name;
        console.warn('tttttttt', text);
        let obj = { value: col.position_id, text: text }
        console.warn('ooooooooooo', obj);
        if (filter.indexOf(obj) == -1) {
          console.log('iiiiiid')
          filter.push(obj)
        }
      })
    }
    return filter;
  }

  handleClassSetModal(record) {
    dispatch({
      type: 'shiftUserSetting/showModal',
      payload: {
        modalType: 'classSetModal',
        modalData: record
      }
    })
  }

  handleHolidaySetModal(record) {
    dispatch({
      type: 'shiftUserSetting/showModal',
      payload: {
        modalType: 'holidaySetModal',
        modalData: record
      }
    })
  }

  onInputChange(e) {
    this.setState({ searchText: e.target.value });
  }

  onSearch(type) {
    console.log('type', type);
    dispatch({
      type: 'shiftUserSetting/search',
      payload: {
        type: type,
        searchText: this.state.searchText
      }
    })
  }


  render() {
    function handleRowClass(record) {
      if (record.DataErr) {
        return 'tableRowErr'
      }
      return 'tableRowNormal';
    }

    const pagination = {
      size: 'small',
      total: _.get(this.props.state.meta, 'total_count'),
      onChange: (current) => {
        this.handleChangePage(current);
      },
    };

    let data = null;
    const positions = this.props.state.positions;
    const departments = this.props.state.departments;
    const shifts = this.props.state.shifts;
    const rests = [
      { id: "1", value: "每週一" },
      { id: "2", value: "每週二" },
      { id: "3", value: "每週三" },
      { id: "4", value: "每週四" },
      { id: "5", value: "每週五" },
      { id: "6", value: "每週六" },
      { id: "7", value: "每週日" },
    ];
    if (positions != null && departments != null && shifts != null) {
      data = this.props.state.dataTable;
      data.map(col => {
        col.shift_interval = [];
        col.rest_interval = [];
        col.shift_special = [];
        col.rest_special = [];
        col.position = positions.find(position => position.id == col.position_id).chinese_name;
        col.department = departments.find(department => department.id == col.department_id).chinese_name;
        col.moment = moment(col.created_at).format('YYYY/MM/DD');
        const shift_user = col.shift_user_settings_of_roster;
        //表格中排班相关数据
        if (shift_user != null && shift_user.shift_interval != null) {
          for (let i = 0; i < shift_user.shift_interval.length; i++) {
            const shift_name = _.get(shifts.find(shift => shift.id == shift_user.shift_interval[i]), 'chinese_name');
            col.shift_interval.push(shift_name);
          }
        }

        //表格中公休相关数据
        if (shift_user != null && shift_user.rest_interval != null) {
          for (let i = 0; i < shift_user.rest_interval.length; i++) {
            const rest_name = rests.find(shift => shift.id == shift_user.rest_interval[i]).value;
            col.rest_interval.push(rest_name);
          }
        }

        //表格中排班相关数据
        if (shift_user != null && shift_user.hasOwnProperty('shift_special')) {
          for (let i = 0; i < shift_user.shift_special.length; i++) {
            col.shift_special.push(
              shift_user.shift_special[i].from + '——' + shift_user.shift_special[i].to
            );
            if (shift_user.shift_special[i].hasOwnProperty('shift_ids')) {
              for (let n = 0; n < shift_user.shift_special[i].shift_ids.length; n++) {
                const shift_name = _.get(shifts.find(shift => shift.id == parseInt(shift_user.shift_special[i].shift_ids[n])), 'chinese_name');
                col.shift_special[i] = col.shift_special[i] + shift_name
              }
            }
          }
        }

        //表格中公休相关数据
        if (shift_user != null && shift_user.hasOwnProperty('rest_special')) {
          for (let i = 0; i < shift_user.rest_special.length; i++) {
            col.rest_special.push(
              shift_user.rest_special[i].from + '——' + shift_user.rest_special[i].to
            );
            if (shift_user.rest_special[i].hasOwnProperty('wdays')) {
              for (let n = 0; n < shift_user.rest_special[i].wdays.length; n++) {
                const rest_name = rests.find(rests => rests.id == shift_user.rest_special[i].wdays[n]).value;
                col.rest_special[i] = col.rest_special[i] + rest_name
              }
            }
          }
        }

      });
    }
    const columns = [
      {
        title: '入職日期',
        dataIndex: 'moment',
        key: 'moment',
        width: 100,
      },
      {
        title: '員工編號',
        dataIndex: 'empoid',
        key: 'empoid',
        width: 100,
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Input
              key='empoid'
              placeholder="员工编号"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={() => this.onSearch('empoid')}
              />
            <Button type="primary" onClick={() => this.onSearch('empoid')}>搜索</Button>
          </div>
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
      },
      {
        title: '職位',
        dataIndex: 'position',
        key: 'position',
        width: 130,
        sorter: (a, b) => a.position.length - b.position.length,
        filters: this.getPositionFilter(),
        onFilter: (value, record) => record.position_id == value,
        filterDropdownVisible: this.state.filterDropdownVisible,
      },
      {
        title: '姓名',
        dataIndex: 'chinese_name',
        key: 'chinese_name',
        sorter: (a, b) => a.chinese_name.localeCompare(b.chinese_name),
        width: 100,
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Input
              placeholder="姓名"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={() => this.onSearch('chinese_name')}
              />
            <Button type="primary" onClick={() => this.onSearch('chinese_name')}>搜索</Button>
          </div>
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
      },
      {
        title: '可排班別',
        key: 'class',
        className: styles.tableClassSet,
        width: 200,
        render: (text, record) => {
          let shifts = [];
          record.shift_special.map(item => {
            shifts.push(item)
            shifts.push(<br />)
          })

          return (
            <div>
              本月排班 {record.shift_interval != undefined ? record.shift_interval.join('/') : null}
              <br />
              {shifts}
              <Icon type="edit" className={styles.edit} onClick={() => this.handleClassSetModal(record)} />
            </div>
          )
        }
      },
      {
        title: '公休设定',
        key: 'holiday',
        className: styles.tableClassSet,
        width: 200,
        render: (text, record) => {
          let rests = [];
          record.rest_special.map(item => {
            rests.push(item)
            rests.push(<br />)
          })

          return (
            <div>
              本月公休 {record.rest_interval != undefined ? record.rest_interval.join('/') : null}
              <br />
              {rests}
              <Icon type="edit" className={styles.edit} onClick={() => this.handleHolidaySetModal(record)} />
            </div>
          )
        }
      },
    ];

    return (
      <div className={styles.shiftUserTable}>
        <Table
          locale={{emptyText:"暫無數據"}}
          pagination={pagination}
          columns={columns}
          dataSource={data}
          rowClassName={(record) => handleRowClass(record)}
          />

      </div>
    );
  }
}

TableBlock.propTypes = {

};

export default TableBlock;
