import React from 'react';

import classes from './index.less';
import classNames from 'classnames';

class JobsStatisticsItem extends React.Component{
  render () {
    return (
      <div className={classNames(classes.statisticeItem, this.props.className)}>
        <div className={classes.cursor} onClick={this.props.onClick}>
          <img className={classes.ico} src={this.props.icon}/>
          <div className={classes.content}>
            <div className={classes.number}>
              {this.props.number}
            </div>
            <div className={classes.itemName}>
              {this.props.itemName}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

JobsStatisticsItem.propTypes = {
  icon: React.PropTypes.string.isRequired,
  number: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired,
  itemName: React.PropTypes.string.isRequired,
}

export default JobsStatisticsItem;
