/**
 * Created by meng on 16/9/14.
 */
import React from 'react';

export const LoginLayout = ({ children }) => (
  <div className="container text-center">
    <div>
      {children}
    </div>
  </div>
);

LoginLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default LoginLayout;
