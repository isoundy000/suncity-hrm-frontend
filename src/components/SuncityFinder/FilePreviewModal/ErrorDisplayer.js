
import React, { PropTypes } from 'react';
import { Spin } from 'antd';
import fetch from 'dva/fetch';

import classes from './index.less';
class ErrorDisplayer extends React.Component {
  static propTypes = {
    fileUrl: PropTypes.string.isRequired,
    refetchError: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      fetchingError: true,
      error: null,
    };

    this.fetchError(props.fileUrl);
  }

  fetchError(url) {
    fetch(url).then(response => {
      if(response.status == 422) {
        response.json().then(err => {
          this.setState({
            fetchingError: false,
            error: err.data[0].message
          })
        });
      }

      if(response.status == 200) {
        this.props.refetchError();
      }
    });
  }

  render() {
    const { fetchingError, error } = this.state;

    return (
      <div className={classes.errorContainer}>
        {
          fetchingError
          ? <Spin
              height={600}
              className={classes.spin}
            />
          : <h1 className={classes.errorMessage}>{error}</h1>
        }
      </div>
    );
  }
}

export default ErrorDisplayer;
