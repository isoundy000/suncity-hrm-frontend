import React, { PropTypes } from 'react';
import { Spin } from 'antd';

import classes from './index.less';
class ImageDisplayer extends React.Component {
  static propTypes = {
    fileUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      imageStatus: 'loading'
    };
  }

  handleImageLoaded() {
    this.setState({
      imageStatus: 'loaded'
    })
  }

  handleImageErrored() {
    this.setState({
      imageStatus: 'failed'
    });
  }
  render() {
    const { imageStatus } = this.state;

    return (
      <div className={classes.imageContainer}>
        {
          imageStatus == 'loading'
          ? <Spin
              height={600}
              className={classes.spin}
            />
          : null
        }
        <img
          src={this.props.fileUrl}
          height={600}
          onLoad={::this.handleImageLoaded}
          onError={::this.handleImageErrored}
        />

      </div>
    );
  }
}

export default ImageDisplayer;
