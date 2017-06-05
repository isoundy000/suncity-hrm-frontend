import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import {
  fetchRole,
  fetchRoleDataBy,
  updateRole,
  fetchAllPermissions,
  fetchAllPermissionsTranslation,

  addPermission,
  addUser,
  addDataAbout,

  removePermission,
  removeUser,
  removeDataAbout,
  fetchPermissionDetail,

  fetchEmails,
} from '../services/role';

const DATA_TYPES = ['permissions', 'users'];

export default {
  namespace: 'role',

  state: {
    modalVisible: {
      addPermissionModal: -1,
      removePermissionModal: -1,
      showPermissionModal: -1,
      addUserModal: -1,
      removeUserModal: -1,
      updateRoleModal: -1,
    },

    roleDataAbout: {
      permissions: [],
      users: [],
    },

    role: null,
    allPermissions: [],
    allPermissionsTranslation: [],

    allEmails: [],

    permission: null,
    permissionsRegion: 'macau', // 'all'

    loading: {
      all: false,
      detail: false
    },

    error: null,
  },

  subscriptions: {
    rolePermissionsSubscriber({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/login') {
          dispatch({ type: 'emptyList', payload: null });
        }

        const match = pathToRegexp('/roles/:id').exec(location.pathname);

        if (match) {
          const roleId = match[1];

          for (const dataType of DATA_TYPES) {
            dispatch({ type: 'startFetchRoleDataBy', payload: { roleId, dataType } });
          }
          dispatch({ type: 'startFetchRole', payload: { roleId } });
          dispatch({ type: 'startFetchAllPermissionsTranslation', payload: null });
        }
      });
    },
  },

  effects: {
    *startFetchRole({ payload }, { call, put, select }) {
      yield put({ type: 'loading', payload: { ans: true, type: 'all' }})

      const { roleId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const currentUser = yield select(state => _.get(state, 'currentUser', null));
      console.log(currentUser);

      const { data, err } = yield call(fetchRole, {
        id: roleId,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'fetchRoleSuccess', payload: { roleData: data.data } });
        /* yield put({ type: 'fetchRolePermissionsSuccess', payload: { rolePermissionsData: data.data.permissions } }); */
      }
    },

    *startFetchRoleDataBy({ payload }, { call, put, select }) {
      const { roleId, dataType } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchRoleDataBy, {
        id: roleId,
        dataType,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'fetchRoleDataBySuccess', payload: { roleData: data.data, dataType } });
      }
    },

    *startUpdateRole({ payload }, { call, put, select }) {
      const { id, patchData } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(updateRole, {
        id,
        patchData: patchData,
        token,
        region,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {

        yield put({
          type: 'updateRoleSuccess',
          payload: {
            patchData: patchData,
          } });
      }
    },

    *startFetchAllPermissions ({ payload }, { call, put, select }) {

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchAllPermissions, {
        token,
        region,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'fetchAllPermissionsSuccess', payload: { allPermissionsData: data.data } });
      }
    },

    *startFetchAllPermissionsTranslation ({ payload }, { call, put, select }) {

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchAllPermissionsTranslation, {
        token,
        region,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'fetchAllPermissionsTranslationSuccess', payload: { allPermissionsTranslation: data.data } });
      }
    },

    *startFetchPermissionDetail ({ payload }, { call, put, select }) {
      yield put({ type: 'loading', payload: { ans: true, type: 'detail' }});

      const { id } = payload;

      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(fetchPermissionDetail, {
        id,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'fetchPermissionDetailSuccess', payload: { permissionData: data.data } });
      }
    },

    *startAddPermission({ payload }, { call, put, select }) {
      const { pData } = payload;

      const permissions = pData.permissions;

      /* const region = yield select(state => state.region); */
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roleId = yield select(state => _.get(state, 'role.role.id', null));

      const postPermissions = permissions.map(permission => {
        const permissionArray = permission.split('-');
        return Object.assign({}, {}, {
          action: permissionArray[0],
          resource: permissionArray[1],
          region: permissionArray[2],
        })
      })

      const postData = Object.assign({}, {}, {
        permissions: postPermissions,
      })

      const { data, err } = yield call(addPermission, {
        id: roleId,
        postData,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'addPermissionSuccess', payload: { newAllPermissions: data.data } });
        yield put({ type: 'currentUser/startSetCurrentUserPermissions', payload: { currentUser: null } });
      }
    },

    *startAddUser({ payload }, { call, put, select }) {
      const { pData, dataType } = payload;

      const users = pData.users;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roleId = yield select(state => _.get(state, 'role.role.id', null));

      const postData = Object.assign({}, {}, {
        emails: users,
      })

      const { data, err } = yield call(addDataAbout, {
        id: roleId,
        dataType,
        postData,
        token,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        console.log('addUserSuccess!!!!!!!!!!!!!!!!!!!!!', data.data);
        yield put({ type: 'addUserSuccess', payload: { newAllUsers: data.data } });
        yield put({ type: 'currentUser/startSetCurrentUserPermissions', payload: { currentUser: null } });
      }
    },

    *startRemoveDataAbout({ payload }, { call, put, select }) {
      const { dataId, dataType } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roleId = yield select(state => _.get(state, 'role.role.id', null));

      const postData = dataType === 'user' ?
                       Object.assign({}, {}, {
                         user_ids: [dataId],
                       }) :
                       Object.assign({}, {}, {
                         permission_ids: [dataId],
                       }) ;

      const { data, err } = yield call(removeDataAbout, {
        id: roleId,
        dataType,
        postData,
        token,
      });


      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'removeDataAboutSuccess', payload: { dataId, dataType } });
        yield put({ type: 'currentUser/startSetCurrentUserPermissions', payload: { currentUser: null } });
      }
    },

    *startRemovePermission({ payload }, { call, put, select }) {
      const { permissionId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roleId = yield select(state => _.get(state, 'role.role.id', null));

      const postData = Object.assign({}, {}, {
        permission_ids: [permissionId],
      });

      const { data, err } = yield call(removePermission, {
        id: roleId,
        postData,
        token,
      });


      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        yield put({ type: 'removePermissionSuccess', payload: { permissionId } });
        yield put({ type: 'currentUser/startSetCurrentUserPermissions', payload: { currentUser: null } });
      }
    },

    *startRemoveUser({ payload }, { call, put, select }) {
      const { userId } = payload;

      const region = yield select(state => state.region);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const roleId = yield select(state => _.get(state, 'role.role.id', null));

      const postData = Object.assign({}, {}, {
        user_ids: [userId],
      });

      const { data, err } = yield call(removeUser, {
        id: roleId,
        postData,
        token,
      });


      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (data) {
        console.log('removeUser', data.data);
        yield put({ type: 'removeUserSuccess', payload: { userId } });
        yield put({ type: 'currentUser/startSetCurrentUserPermissions', payload: { currentUser: null } });
      }
    },

    *startFetchEmails({ payload }, { call, put, select }) {
      const { value } = payload;

      const { data, err } = yield call(fetchEmails, {
        email: value,
      });

      if (err) {
        yield put({ type: 'hasError', payload: { error: err } });
      }

      if (!err) {
        yield put({
          type: 'fetchEmailsSuccess',

          payload: {
            newEmails: data.data,
          }
        });
      }
    },
  },

  reducers: {
    loading(state, { payload }) {
      const { ans, type } = payload;
      return { ...state, loading: { ...state.loading, [type]: ans } };
    },

    toggleModal(state, { payload }) {
      const { id, type } = payload;
      return { ...state, modalVisible: { ...state.modalVisible, [type]: id } };
    },

    emptyList(state, { payload }) {
      return { ...state, roles: []};
    },

    fetchRoleSuccess(state, { payload }) {
      const { roleData } = payload;
      return { ...state,
               role: roleData,
               loading: { ...state.loading, ['all']: false },
      };
    },

    updateRoleSuccess(state, { payload }) {
      const { patchData } = payload;
      return { ... state, role: { ...state.role, ...patchData } };
    },

    fetchRoleDataBySuccess(state, { payload }) {
      const { roleData, dataType } = payload;
      return { ...state, roleDataAbout: { ...state.roleDataAbout, [dataType]: roleData } };
    },

    fetchAllPermissionsSuccess(state, { payload }) {
      const { allPermissionsData } = payload;

      const formatAllPermissionsData = allPermissionsData.reduce(( result, obj) => {
        const resource = Object.keys(obj)[0];
        const actions = obj[resource];
        let newRegionPermissions = [];

        for (const region of ['macau']) { // for different region
          let newPermissions = actions.map(action => {
            return Object.assign({}, {}, {
              resource,
              action,
              region,
            })
          });
          newRegionPermissions = [...newRegionPermissions, ...newPermissions];
        }
        return [...result, ...newRegionPermissions];
      }, []);
      return { ...state, allPermissions: formatAllPermissionsData };
    },

    fetchAllPermissionsTranslationSuccess(state, { payload }) {
      const { allPermissionsTranslation } = payload;

      const formatAllPermissionsTranslation = allPermissionsTranslation.reduce((result, obj) => {
        const resource = Object.keys(obj)[0];
        const translations = obj[resource];
        result[resource] = translations;
        return result;
      }, {});

      return { ...state, allPermissionsTranslation: formatAllPermissionsTranslation };
    },

    fetchPermissionDetailSuccess(state, { payload }) {
      const { permissionData } = payload;
      return { ...state,
               permission: permissionData,
               loading: { ...state.loading, ['detail']: false },
      };
    },

    emptyPermissionDetail(state, { payload }) {
      return { ...state, permission: null };
    },

    addPermissionSuccess(state, { payload }) {
      const { newAllPermissions } = payload;

      /* const permission_ids = newPermissions.permission_ids;
         const allPermissions = state.allPermissions;

         const completedNewPermissions = permission_ids.map(permissionId => {
         return allPermissions.find(permission => `${permission.id}` === permissionId);
         });
       */

      /* const completedNewPermissions = allPermissions.filter(permission => {
         return permission_ids.includes(permission.id);
         });
       */
      return { ...state,
               roleDataAbout: { ...state.roleDataAbout,
                                permissions: newAllPermissions,
               },
      };
    },

    addUserSuccess(state, { payload }) {
      const { newAllUsers } = payload;
      return { ...state,
               roleDataAbout: { ...state.roleDataAbout,
                                users: newAllUsers,
               },
      };
    },

    removeDataAboutSuccess(state, { payload }) {
      const { dataId, dataType } = payload;
      const formatType = `${dataType}s`;
      const oldRoleData = state.roleDataAbout[formatType];
      const newRoleData = oldRoleData.filter(data => {
        return (data.id !== dataId);
      });

      return { ...state, roleDataAbout: { ...state.roleDataAbout,
                                          [formatType]: newRoleData,
      } };
    },

    removePermissionSuccess(state, { payload }) {
      const { permissionId } = payload;
      const oldRolePermissions = state.roleDataAbout['permissions'];
      const newRolePermissions = oldRolePermissions.filter(permission => {
        return (permission.id !== permissionId);
      });

      return { ...state, roleDataAbout: { ...state.roleDataAbout,
                                          permissions: newRolePermissions,
      } };
    },

    removeUserSuccess(state, { payload }) {
      const { userId } = payload;
      const oldRoleUsers = state.roleDataAbout['users'];
      const newRoleUsers = oldRoleUsers.filter(user => {
        return (user.id !== userId);
      });

      return { ...state, roleDataAbout: { ...state.roleDataAbout,
                                          users: newRoleUsers,
      } };
    },

    fetchEmailsSuccess(state, { payload }) {
      const { newEmails } = payload;
      return { ...state, allEmails: newEmails };
    },

    switchRegion(state, { payload }) {
      const { permissionsRegion } = payload;
      return { ...state, permissionsRegion };
    },

    hasError(state, { payload }) {
      const { error } = payload;
      return { ...state, error };
    },
  },
}
