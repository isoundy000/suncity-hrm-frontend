import React, { PropTypes } from 'react';
import styles from './index.less';
import icon from './assets/paneltitle.png'

function TabsTitle({ name }) {
  return (
    <div>
      <div className={styles.titleBlock}>
        <img alt="paneltitle" src={icon} />
      </div>
      <span className={styles.title}>
        {name}
      </span>
    </div>
  );
}

TabsTitle.propTypes = {
  name: PropTypes.string.isRequired,
}

export default TabsTitle;
