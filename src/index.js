import './index.html';
import './index.less';
import dva from 'dva';
import { getPersistedState, persistedStateListener } from './persistedState';

// 1. Initialize
const app = dva({
  initialState: getPersistedState(),
});

// 2. Plugins
app.use({
  onStateChange: () => {
    const state = app._store.getState();
    const currentUser = state.currentUser;
    const region = state.region;

    localStorage.setItem('reduxState', JSON.stringify({
      currentUser,
      region
    }));
  }
});


// 3. Model
[
  'locales',
  'login',
  'region',
  'lang',
  'currentUser',
  'header',
  'advancedSearch',
  'endpoints',
  'profiles',
  'profileDetail',
  'architectureSetting',
  'myRecruit',
  'jobs',
  'applicantProfiles',
  'newApplicantProfile',
  'myMessages',
  'jobApplication',
  'roleList',
  'role',
  'entryFile',
  'rosters',
  'rosterDetail',
  'scheduleRuleDetail',
  'shiftUserSetting',
].forEach(model => {
  app.model(require(`./models/${model}`));
});

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
