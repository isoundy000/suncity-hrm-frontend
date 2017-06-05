import React from 'react';
import { Form, Input, Button, Checkbox, Alert} from 'antd';
import { getMessage } from '../../../locales/messages';
import classes from './index.less';

import LogoImage from './assets/logo.png';
import PasswordImage from './assets/password.png';
import IdentityImage from './assets/identity.png';

const FormItem = Form.Item;

class LoginForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;

    const t_account = formatMessage(getMessage('app.global.account'));
    const t_password = formatMessage(getMessage('app.user.password'));
    const t_please_input = formatMessage(getMessage('app.helper.pleaseinput'));
    const t_login = formatMessage(getMessage('app.helper.login'));
    const t_login_error = formatMessage(getMessage('app.api.login_error'));

    let alert = null;
    if(this.props.login.error){
      alert = <Alert message={t_login_error} type="error" showIcon />
    }

    return (
      <div className={classes.LoginForm}>
        <img src={LogoImage} className={classes.logo}/>

        {alert}

        <Form onSubmit={e => {
          e.preventDefault();
          
          const { userName, password, } = this.props.form.getFieldsValue();
          
          this.props.dispatch({
            type: 'login/login',
            payload: {
              identity: userName,
              password
            }
          });

        }}>
          <FormItem>
            {getFieldDecorator('userName', {})(
              <Input
                placeholder={t_please_input + t_account}
                addonBefore={<img src={IdentityImage} />}
              />
            )}
            
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {})(
              <Input
                type="password"
                placeholder={t_please_input + t_password}
                addonBefore={<img src={PasswordImage} />}
              />
            )}
          </FormItem>

          <Button loading={this.props.login.onLogin} className={classes['login-button']} disabled={this.props.onLogin} type="primary" htmlType="submit">{t_login}</Button>
        </Form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  form: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired
}

export default Form.create()(LoginForm);
