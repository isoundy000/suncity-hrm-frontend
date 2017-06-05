import React, { PropTypes } from 'react';
import styles from './index.less';
import icon from './assets/panelTitle.png'

const propTypes = {
  name: PropTypes.string.isRequired,
};

function PanelTitle({ name }) {
  return (
    <div>
      <div className={styles.titleBlock}>
        <img alt="icon" src={icon} />
      </div>
      <span className={styles.title}>
        {name}
      </span>
    </div>
  );
}

PanelTitle.propTypes = propTypes;

export default PanelTitle;
