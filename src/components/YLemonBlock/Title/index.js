import React from 'react';
import classes from './index.less';

class YLemonBlockTitle extends React.Component{
  render() {
    let type = this.props.type;
    if(!type){
      type = 'blockTitle'
    }

    return (
      <div className={classes[type]}>

        <div className={classes.leftArea}>
          <img src={this.props.icon} role="presentation" className={classes.headerIcon} />
          <span>{this.props.title}</span>
        </div>

        <div className={classes.headerAction}>
          {this.props.actions}
        </div>
      </div>
    );
  }
}

export default YLemonBlockTitle;
