/**
 * Created by meng on 16/9/14.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link, Lifecycle } from 'dva/router';
import { Spin } from 'antd';

import classes from './index.less';
import FilterBlock from './FilterBlock';
import ProfilesBlock from './ProfilesBlock';

const Profiles = React.createClass({
  mixins: [ Lifecycle ],

  routerWillLeave(nextLocation) {
    this.props.dispatch({
      type: 'header/searchTextChanged',
      payload: '',
    })
  },

  render() {
    return (
      <Spin spinning={this.props.profiles.exporting}>
        <div className={classes.container}>
          <FilterBlock {...this.props} />
          <ProfilesBlock {...this.props.profiles } dispatch={ this.props.dispatch }/>
        </div>
      </Spin>
    );
  }
})

Profiles.propTypes = {

};

export default connect(({ profiles, currentUser, region, header }) => ({
  profiles,
  currentUser,
  region,
  header,
}))(Profiles);
