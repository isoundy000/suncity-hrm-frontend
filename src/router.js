import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
import createRoutes from './routes';
import ConnectedIntlProvider from './components/ConnectedIntlProvider';
import ConnectedContextProvider from './components/ConnectedContextProvider';

export default function({ app, history }) {
  const appRoutes = createRoutes(app);

  return (
    <ConnectedIntlProvider>
      <ConnectedContextProvider>
        <Router history={history} children={appRoutes} />
      </ConnectedContextProvider>
    </ConnectedIntlProvider>
  );
};
