import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Table, Input, Button } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

import FilterDropdown from './FilterDropdown';
import EnableEditItem from './EnableEditItem';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const getTime = (time) => {
  return time ? time.split('T')[1].split('.')[0].split(':').slice(0, 2).join(':') : '';
};

const getDay = (date) => {
  const [yy, mm, dd] = date.split('/');
  const tmpDate = new Date(yy, mm - 1, dd);
  switch (tmpDate.getDay()) {
    case 0:
      return 'Sun';

    case 1:
      return 'Mon';

    case 2:
      return 'Tue';

    case 3:
      return 'Wed';

    case 4:
      return 'Thu';

    case 5:
      return 'Fri';

    case 6:
      return 'Sat';
    default:
      return;
  }
};

const getLeaveType = (leaveType) => {
  switch (leaveType) {
    case 'annual_leave':
      return '年假';

    case 'personal_leave':
      return '事假';

    case 'offical_leave':
      return '公休';

    default:
      return;
  }
};

const TableDetail = ({ rosterDetail, dispatch, editable, ...props }) => {
  const { formatMessage } = props.intl;

  const positions = rosterDetail.positions;

  const shifts = rosterDetail.shifts;
  const rosterId = rosterDetail.basicInfo.id;

  const filteredInfo = rosterDetail.dataTable.filteredInfo || {};
  const sortedInfo = rosterDetail.dataTable.sortedInfo || {};

  const searchText = rosterDetail.dataTable.searchText;
  const filterDropdownVisible = rosterDetail.dataTable.filterDropdownVisible;

  const columnFields = rosterDetail.columnFields;
  const completedColumnFields = editable === false ?
                                columnFields.map(column => {
                                  return Object.assign({}, column, {
                                    title: (
                                      <div>
                                        <div>
                                          {getDay(column.dataIndex)}
                                        </div>
                                        {column.dataIndex}
                                      </div>
                                    ),
                                    render: (text, record, index) => {
                                      const type = record[column.dataIndex]['leave_type'] ? 'leave' : 'shift';
                                      const tmp = type === 'shift' ?
                                                  shifts.filter(s => s.id === record[column.dataIndex]['shift_id'])[0] :
                                                  getLeaveType(record[column.dataIndex]['leave_type']);

                                      /* console.log('record', record, column, record[column.dataIndex]['shift_id'], shifts, tmpShift); */
                                      /* console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', tmp); */
                                      const shift = type === 'shift' && tmp ? tmp:
                                                    {
                                                      chinese_name: '',
                                                      start_time: '',
                                                      end_tiem: '',
                                                    };
                                      return (
                                        <div>
                                          <div>
                                            {
                                              type === 'shift' ?
                                              `${shift['chinese_name']} (${getTime(shift['start_time'])} - ${getTime(shift['end_time'])})` :
                                              (
                                                <div className={classNames({ 'offical': ( type === 'leave' &&
                                                                                          record[column.dataIndex]['leave_type'] === 'offical_leave' ),
                                                                             'other': (type === 'leave' &&
                                                                                       record[column.dataIndex]['leave_type'] !== 'offical_leave')
                                                  })}>
                                                  {tmp}
                                                </div>
                                              )
                                            }
                                          </div>
                                        </div>
                                      );
                                    },
                                  });
                                }) :
                                columnFields.map(column => {
                                  return Object.assign({}, column, {
                                    title: (
                                      <div>
                                        <div>
                                          {getDay(column.dataIndex)}
                                        </div>
                                        {column.dataIndex}
                                      </div>
                                    ),

                                    className: 'enableEdit',

                                    render: (text, record, index) => (
                                      <EnableEditItem
                                        rosterDetail={rosterDetail}
                                        dispatch={dispatch}
                                        text={text}
                                        record={record}
                                        index={index}
                                        columnTitle={column.dataIndex}
                                        dataIndex={column.dataIndex}
                                      />
                                    ),
                                  });
                                });

  const getPosition = (record, positions) => {
    const position = positions.filter(p => p.id === record['position_id'])[0];
    return position ? position['chinese_name'] : '';
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);

    dispatch({
      type: 'rosterDetail/startFetchRosterTable',
      payload: {
        rosterId,
        page: pagination.current,
      }
    });

    dispatch({
      type: 'rosterDetail/tableChange',
      payload: {
        filteredInfo: filters,
        sortedInfo: sorter,
      }
    });
  };

  const columns = [
    {
      title: '入職日期',
      dataIndex: 'date',
      key: 'date',
      width: 123,
      fixed: 'left',
    },
    {
      title: '員工編號',
      dataIndex: 'empoid',
      key: 'empoid',
      width: 123,
      fixed: 'left',

      filterDropdown: (<FilterDropdown
                         rosterDetail={rosterDetail}
                         dispatch={dispatch}
                         type={"empoid"}
                       />),
      filterDropdownVisible: filterDropdownVisible['empoid'],
      onFilterDropdownVisibleChange: visible => {
        console.log('do work!');
        dispatch({
          type: 'rosterDetail/filterDropdownVisibleChange',
          payload: {
            visible,
            type: 'empoid',
          }
        });
      },
    },

    {
      title: '職位',
      dataIndex: 'position_id',
      key: 'position_id',
      width: 123,
      fixed: 'left',

      sorter: (a, b) => getPosition(a, positions).length - getPosition(b, positions).length,
      sortOrder: sortedInfo.columnKey === 'position_id' && sortedInfo.order,

      filters: rosterDetail.dataTable.filtersForPosition,

      filteredValue: filteredInfo.position_id || [],
      onFilter: (value, record) => getPosition(record, positions).includes(value),

      render: (text, record) => (
        <span>
          {getPosition(record, positions)}
        </span>
      ),
    },

    {
      title: '姓名',
      dataIndex: 'chinese_name',
      key: 'chinese_name',
      width: 123,
      fixed: 'left',

      sorter: (a, b) => a['chinese_name'].length - b['chinese_name'].length,
      sortOrder: sortedInfo.columnKey === 'chinese_name' && sortedInfo.order,

      filterDropdownVisible: filterDropdownVisible['name'],
      onFilterDropdownVisibleChange: visible => {
        dispatch({
          type: 'rosterDetail/filterDropdownVisibleChange',
          payload: {
            visible,
            type: 'name',
          }
        });
      },

      filterDropdown: (<FilterDropdown
                         rosterDetail={rosterDetail}
                         dispatch={dispatch}
                         type={"name"}
                       />),
    },
    ...completedColumnFields,
  ];

  const completedCurrentPagination = {
    size: 'small',
    pageSize: 20,
    total: rosterDetail.totalPages,
  };

  return (
    <div className={styles.tableDetail}>
      <Row>
        <Col md={24}>
          <Table
            columns={columns}
            dataSource={rosterDetail.detailData}
            onChange={handleChange}
            pagination={completedCurrentPagination}
            scroll={{ x: 6000 }}
            rowClassName={(record, index) => "rowStyle" }
          />
        </Col>
      </Row>

    </div>
  );
};

export default injectIntl(TableDetail);
