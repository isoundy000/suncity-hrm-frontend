import React from 'react';
import classes from './index.less';
import classNames from 'classnames';
import { Spin } from 'antd';

class YlemonImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoading: false,
      imgWidth: 0,
      imgHeight: 0,
    };
  }

  toggleImgLoading() {
    const gravatar = new Image();
    gravatar.src = `${this.props.imgURL}`;
    gravatar.onload = () => {
      this.setState({
        imgLoading: false,
        imgWidth: gravatar.width,
        imgHeight: gravatar.height,
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.imgURL !== this.props.imgURL) {
      this.setState({
        imgLoading: true,
      });
    }
  }

  render() {
    const imgSize = this.state.imgWidth >= this.state.imgHeight ? 'width-larger' : 'height-larger';
    return (
      <div className={this.props.className}>
        <img
          className={classNames(imgSize, this.state.imgLoading ? classes.imgHide : classes.imgPos)}
          onLoad={::this.toggleImgLoading}
          onError={::this.toggleImgLoading}
          src={this.props.imgURL}
        />

        {
          this.state.imgLoading ?
            <span className={classes.imgSpin}>
              <Spin size="large"/>
            </span>
            : null
        }

      </div>
    );
  }
}

export default YlemonImage;
