import React from 'react';
import classes from './index.less';

class Content extends React.Component{
  render() {
    let type = this.props.type;
    if(!type){
      type = 'content'
    }

    return (
      <div className={classes[type]}>
        {this.props.content}
      </div>
    )
  }
}

export default Content;
