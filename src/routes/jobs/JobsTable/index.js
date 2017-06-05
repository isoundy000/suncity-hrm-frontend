import React from 'react';
import { Table, Icon } from 'antd';
import YLemonBlock from 'components/YLemonBlock';
import classes from './index.less';
import classNames from 'classnames';

class JobsTable extends React.Component {
  columns() {
    return [
      {
        title: '職位',
        dataIndex: 'position.chinese_name',
        key: 'position',
        width: 100,
      },
      {
        title: '所屬部門',
        dataIndex: 'department.chinese_name',
        key: 'department',
        width: 100,
      },
      {
        title: '直接上級',
        dataIndex: 'superior_email',
        key: 'superior_email',
        width: 100,
      },
      {
        title: '職級',
        dataIndex: 'grade',
        key: 'grade',
        width: 50
      },
      {
        title: '應有人數',
        dataIndex: 'number',
        key: 'number',
        width: 80
      },
      {
        title: '在職人數',
        dataIndex: 'position_profiles_count',
        key: 'position_profiles_count',
        width: 80
      },
      {
        title: '空缺人數',
        key: 'need_number',
        dataIndex: 'need_number',
        width: 80
      },
      {
        title: '工作範圍',
        key: 'chinese_range',
        width: 200,
        render: (text, record) => {
          return (
            <span>{record.chinese_range}</span>
          );
        }
      },
      {
        title: '技能要求及工作經驗',
        key: 'chinese_skill',
        width: 200,
        render: (text, record) => {
          return (
            <span>{record.chinese_skill}</span>
          );
        }
      },
      {
        title: '學歷要求',
        key: 'chinese_education',
        width: 100,
        render: (text, record) => {
          return (
            <span>{record.chinese_education}</span>
          );
        }
      },
      {
        title: '狀態',
        key: 'status',
        width: 100,
        render: (text, record) => {
          return (
            <span>
              {
                record.status == 'enabled'
                ? '正在招聘'
                : '停止招聘'}</span>
          );
        }
      },
      {
        title: '',
        key: 'actions',
        render: (text, record) => {
          return (
            <div
              className={classNames({ 'shouldNotShow': ((this.props.region === 'macau' &&
                                                         this.props.currentUser.can.updateJobInMACAU !== true)
                                                     || (this.props.region === 'manila' &&
                                                         this.props.currentUser.can.updateJobInMANILA !== true))})}
            >
              <Icon
                className={classes.editJob}
                type="edit"
                onClick={() => {
                    this.props.dispatch({
                      type: 'jobs/editingJob',
                      payload: record
                    });
                  }}
              />
            </div>
          );
        }
      }
    ];
  }

  content() {
    const jobs = this.props.jobs.jobs;

    return (
      <div className={classes.jobsTable}>
        <Table
          locale={{emptyText:"暫無數據"}}
          scroll={{ x: 1500 }}
          dataSource={jobs}
          columns={this.columns()}
          pagination={false}
        />
      </div>
    );
  }

  render() {
    return (
      <YLemonBlock
        title="職位列表"
        type="noneTitleBackground"
        content={this.content()}
      />
    );
  }
}

export default JobsTable;
