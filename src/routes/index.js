/**
 * Created by meng on 16/9/14.
 */

import React from 'react';
import { Route, IndexRoute } from 'dva/router';

import MainLayout from '../layouts/MainLayout';
import LoginLayout from '../layouts/LoginLayout';

import Home from './Home';
import Login from './login';

import Profiles from './profiles';
import ProfileDetail from './profileDetail';
import ProfileDetailCreate from './profileDetailCreate';
import ArchitectureSetting from './ArchitectureSetting';
import MyRecruit from './MyRecruit';
import JobsPage from './jobs';
import ApplicantProfilePage from './applicant_profiles';
import NewApplicantProfilePage from './applicant_profile_new';
import EditApplicantProfilePage from './applicant_profile_show';

import RoleList from './roleList';
import Role from './role';

import applicantAll from './applicantAll';
import scheduleRuleDetail from './scheduleRuleDetail';
import shiftUserSetting from './shiftUserSetting';

import MyMessages from './myMessages';
import JobApplication from './jobApplication';
import EntryFile from './EntryFile';

import Rosters from './rosters';
import RosterDetail from './rosterDetail';

import '../styles/antd-override.less';
import '../styles/common.less';

export default function(app) {
  return [
    <Route
      path="/login"
      component={LoginLayout}
      onEnter={(nextState, replace) => {
          if(app._store.getState().currentUser){
            return replace('/');
          }
        }}
    >
      <IndexRoute component={Login} />
    </Route>,

    <Route
      path="/"
      component={MainLayout}
      onEnter={(nextState, replace) => {
          if(!app._store.getState().currentUser){
            return replace('/login');
          }
        }}
    >
      <IndexRoute component={Home} />
      <Route path="/profile/:id" component={ProfileDetail} />

      <Route
        path="/profiles"
        component={Profiles}

        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can.manageProfileInMACAU !== true &&
                currentUser.can.createProfileInMACAU !== true &&
                currentUser.can.updateProfileInMACAU !== true)
            || (region === 'manila' &&
                currentUser.can.manageProfileInMANILA !== true &&
                currentUser.can.createProfileInMANILA !== true &&
                currentUser.can.updateProfileInMANILA !== true)) {
                  return replace('/');
            }
          }}
      />

      <Route
        path="/architecture"
        component={ArchitectureSetting}
        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can['access_company_structure_managementglobalInMACAU'] !== true)
            || (region === 'manila' &&
                currentUser.can['access_company_structure_managementglobalInMANILA'] !== true)) {
                  return replace('/');
            }
          }}
      />

      <Route path="/messages" component={MyMessages} />
      <Route path="/recruit/myrecruit" component={MyRecruit} />
      <Route path="/profiles/create" component={ProfileDetailCreate} />

      <Route
        path="/jobs"
        component={JobsPage}
        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can.createJobInMACAU !== true &&
                currentUser.can.updateJobInMACAU !== true)
            || (region === 'manila' &&
                currentUser.can.createJobInMANILA !== true &&
                currentUser.can.updateJobInMANILA !== true)) {
                  return replace('/');
            }
          }}
      />

      <Route
        path="/applicant_profiles"
        component={ApplicantProfilePage}
        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can.createApplicantProfileInMACAU !== true &&
                currentUser.can.updateApplicantProfileInMACAU !== true)
            || (region === 'manila' &&
                currentUser.can.createApplicantProfileInMANILA !== true &&
                currentUser.can.updateApplicantProfileInMANILA !== true)) {
                  return replace('/');
            }
          }}
      />

      <Route path="/applicant_profiles/new" component={NewApplicantProfilePage} />
      {/* <Route path="/applicant_profiles/:id" component={EditApplicantProfilePage} /> */}
      <Route path="/applicant_profiles/:id" component={applicantAll} />
      <Route
        path="/roles"
        component={RoleList}
        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can.indexRoleInMACAU !== true &&
                currentUser.can.updateRoleInMACAU !== true)
            || (region === 'manila' &&
                currentUser.can.indexRoleInMANILA !== true &&
                currentUser.can.updateRoleInMANILA !== true)) {
                  // Todo
                  {/* return replace('/'); */}
            }
          }}
      />
      <Route
        path="/roles/:id"
        component={Role}
        onEnter={(nextState, replace) => {
            const currentUser = app._store.getState().currentUser;
            const region = app._store.getState().region;
            if((region === 'macau' &&
                currentUser.can.indexRoleInMACAU !== true &&
                currentUser.can.updateRoleInMACAU !== true)
            || (region === 'manila' &&
                currentUser.can.indexRoleInMANILA !== true &&
                currentUser.can.updateRoleInMANILA !== true)) {
                  // Todo
                  {/* return replace('/'); */}
            }
          }}
      />
      <Route path="/entryfile" component={EntryFile} />
      <Route path="/rosters" component={Rosters} />
      <Route path="/rosters/:id" component={RosterDetail} />
      <Route path="/rosters/:id/edit" component={RosterDetail} />
      <Route path="/scheduleRuleDetail/:id" component={scheduleRuleDetail} />
      <Route path="/rosters/:id/shiftUserSetting" component={shiftUserSetting} />
    </Route>
  ];
}
