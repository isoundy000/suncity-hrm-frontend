import React, { PropTypes } from 'react';
import styles from './index.less';
import icon from './assets/paneltitle.png'

function PanelTitle({ name }) {
  return (
    <div>
      <div className={styles.titleBlock}>
        <img alt="" src={icon} />
      </div>
      <span className={styles.title}>
        {name}
      </span>
    </div>
  );
}

PanelTitle.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PanelTitle;
