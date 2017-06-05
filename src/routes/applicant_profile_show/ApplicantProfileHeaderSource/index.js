import React from 'react';
import classes from './index.less';

function ApplicantProfileHeaderSource({ source }) {
  const getSourceDisplay = function(source) {
    switch(source) {
      case 'ipad':
        return {
          text: '來自iPad',
          color: '#7ddead',
        };
      case 'website':
        return {
          text: '來自網站',
          color: '#7ad1fe',
        };
      default:
        return {
          text: '手動創建',
          color: '#fcc443',
        };
    }
  }

  const displayConfig = getSourceDisplay(source);

  return (
    <div className={classes.headerSource} style={{background: displayConfig.color}}>
      <p>{displayConfig.text}</p>
      <span className={classes.triangle}></span>
    </div>
  );
}

export default ApplicantProfileHeaderSource;