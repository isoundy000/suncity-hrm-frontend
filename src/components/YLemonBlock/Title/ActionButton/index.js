import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classes from './index.less';

class YLemonBlockTitleActionButton extends React.Component{
  render() {
    if (this.props.onClick) {
      return (
        <div onClick={this.props.onClick} className={classes.actionButton}>
          <img src={this.props.icon} role="presentation" className={classes.headerIcon} />
          {this.props.title}
        </div>
      );
    }

    if (this.props.link) {
      return (
        <Link to={this.props.link} className={classes.actionButton}>
          <img src={this.props.icon} role="presentation" className={classes.headerIcon} />
          {this.props.title}
        </Link>
      );
    }
  }
}

YLemonBlockTitleActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  link: PropTypes.string,
};

export default YLemonBlockTitleActionButton;
