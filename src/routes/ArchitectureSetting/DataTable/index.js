import React, { PropTypes } from 'react';
import { Table, Spin } from 'antd';

import OperationButton from '../OperationButton';
import OperationList from '../OperationList';
import AddLocationButton from '../AddLocationButton';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import styles from './index.less';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    const defaultExpandedRowKeys = props.data.map(item => item.id);

    this.state = {
      expandedRowKeys: defaultExpandedRowKeys,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.region !== this.props.region) {
      for (const type of ['departments', 'positions', 'locations']) {
        this.props.dispatch({
          type: 'architectureSetting/fetchList',
          payload: {
            type,
          },
        });
      }
      return true;
    }
    return (nextProps !== this.props || nextState !== this.state);
  }

  getColumns(columnsArray, type) {
    switch (type) {
      case 'departments':
        return columnsArray.forDepartments;
      case 'positions':
        return columnsArray.forPositions;
      case 'locations':
        return columnsArray.forLocations;
      default:
        throw new Error('Undefined content');
    }
  }

  handleClick(record) {
    let keysArray = this.state.expandedRowKeys;
    const key = record.key;

    if (keysArray.includes(key)) {
      const index = keysArray.findIndex(value => value === key);

      keysArray = [...keysArray.slice(0, index),
                   ...keysArray.slice(index + 1)];
    } else {
      if (record.children && record.children.length > 0) {
        keysArray = [...keysArray, record.key];
      }
    }

    this.setState({ expandedRowKeys: keysArray });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const departmentLevel = formatMessage(messages['app.arch.datatable.department_level']);
    const header = formatMessage(messages['app.arch.datatable.header']);
    const employeesCount = formatMessage(messages['app.arch.datatable.employees_count']);
    const positionLevel = formatMessage(messages['app.arch.datatable.position_level']);
    const department = formatMessage(messages['app.arch.datatable.department']);
    const locationName = formatMessage(messages['app.arch.datatable.location_name']);

    // TODO: refactor
    const columnsArray = {
      forDepartments: [
        {
          title: departmentLevel,
          dataIndex: 'chinese_name',
          key: 'chinese_name',
          width: 579,

        },
        {
          title: header,
          dataIndex: 'header_name',
          key: 'header_name',
          width: 200,
        },
        {
          title: employeesCount,
          dataIndex: 'employees_count',
          key: 'employees_count',
          width: 180,
        },
        {
          title: '',
          dataIndex: 'operation',
          key: 'operation',
          width: 166,
          render: (text, record) =>
            <OperationButton
              content={'departments'}
              record={record}
              {...this.props}
            />,
        },
      ],

      forPositions: [
        {
          title: positionLevel,
          dataIndex: 'chinese_name',
          key: 'chinese_name',
          width: 639,
        },
        {
          title: department,
          dataIndex: 'department_names',
          key: 'department_names',
          width: 320,
        },
        {
          title: '',
          dataIndex: 'operation',
          key: 'operation',
          width: 166,
          render: (text, record) =>
            <OperationButton
              content={'positions'}
              record={record}
              {...this.props}
            />,
        },
      ],

      forLocations: [
        {
          title: locationName,
          dataIndex: 'chinese_name',
          key: 'chinese_name',
          width: 1039,
        },
        {
          title: <AddLocationButton {...this.props} />,
          dataIndex: 'operation',
          key: 'operation',
          width: 89,
          className: 'locationTh',
          render: (text, record) =>
            <OperationList
              content={'locations'}
              record={record}
              {...this.props}
            />,
        },
      ],
    };

    let columns = this.getColumns(columnsArray, this.props.content);

    return (
      <Spin spinning={this.props.loading}>
        <div className={styles.archTable}>
          <Table
            locale={{emptyText:"暫無數據"}}
            columns={columns}
            indentSize={0}
            pagination={false}
            defaultExpandedRowKeys={this.state.defaultExpandedRowKeys}
            expandedRowKeys={this.state.expandedRowKeys}
            onRowClick={(record) => { this.handleClick(record); }}
            rowClassName={(record) => record.status}
            dataSource={this.props.data}
            {...this.props}
          />
        </div>
      </Spin>
    );
  }
}

DataTable.propTypes = {
};

export default injectIntl(DataTable);
