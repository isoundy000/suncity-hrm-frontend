import React, { PropTypes } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Card } from 'antd';
import LinksGroup from '../LinksGroup';

export const HomePanel = ({ panelData, currentUser, region }) => {
  const { imgUrl, links, title, name} = panelData;
  return (
    <div>
      {(title ==='開發中，敬請期待...')
        ?<Card className={styles.homePanel} >
        <div className={styles.devBG} >
          <div className={styles.header}>
            <div className={styles.devimgCenter}>
              <img src={imgUrl} role="presentation" className={styles.scaleDevImg} />
            </div>
              <h2 className={styles.devtitle} >{title}</h2>
          </div>
          </div> 
         </Card>
        :<Card className={styles.homePanel} >
            <div className={styles.header}>
              <img src={imgUrl} role="presentation" className={styles.scaleImg} /> 
              <h2 className={classNames(styles.title, `${name}Color`)} >{title}</h2>
            </div>
            <div>
              <LinksGroup links={links} currentUser={currentUser} region={region} name={name}/>
            </div>
          </Card>
      }
    </div>
  );
};

HomePanel.propTypes = {
  panelData: PropTypes.object.isRequired,
};

export default HomePanel;
