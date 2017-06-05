/**
 * Created by meng on 16/9/2.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class ContextProvider extends Component {
  getChildContext() {
    return {
      region: this.props.region,
      lang: this.props.lang,
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

ContextProvider.childContextTypes = {
  region: PropTypes.string,
  lang: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    region: state.region,
    lang: state.locales.lang,
  }
}

export default connect(mapStateToProps)(ContextProvider);
