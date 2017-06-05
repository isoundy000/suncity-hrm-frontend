import React from 'react';
import { connect } from 'dva';
import classes from './index.less';
import LoginForm from './loginForm';
import { injectIntl } from 'react-intl';

function Login(props) {
  return (
     <div className={classes.Login}>
       <LoginForm {...props} />
     </div>
  );
}

const mapStateToProps = ({ login }) => ({
  login
});

export default connect(mapStateToProps)(injectIntl(Login));
