import React from 'react';
import { Spin } from 'antd';
import ListTable from '../ListTable';
import classNames from 'classnames';
import GreenPagination from '../GreenPagination';
import classes from './index.less';

class Profiles extends React.Component{
  render() {
    return (
      <Spin spinning={this.props.loadingProfiles}>
        <div className={classes.tableContainer}>
          <ListTable
            {...this.props}
            handleRowDoubleClick={this.props.handleRowDoubleClick}
          />

          {
            this.props.totalNum > 0
              ?
              <div className={classes.pagination}>
                <GreenPagination
                  className={classNames('ant-pagination', classes.pager)}
                  defaultCurrent={1}
                  current={this.props.page}
                  total={this.props.totalNum}
                  onChange={this.props.handleChangePage}
                />
              </div>
              :
              <section />
          }
        </div>
      </Spin>
    )
  }
}

export default Profiles;
