/**
 * Created by meng on 16/9/14.
 */

import React from 'react';
import { connect } from 'dva';
import SuncityHeader from 'components/SuncityHeader';
import ActionCableApp from 'components/ActionCableApp';
import classes from './MainLayout.less';

const MainLayout = ({ children, myMessages, dispatch }) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <SuncityHeader />

        <ActionCableApp
          myMessages={myMessages}
          dispatch={dispatch}
        />
      </div>

      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
}

const mapStateToProps = ({ myMessages }) => ({
  myMessages,
});

export default connect(mapStateToProps)(MainLayout);
