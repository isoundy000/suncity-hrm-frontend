import { Modal, message } from "antd";
import {
  createAudience,
  createInterview,
  createSign,
  deleteContractById,
  downloadContractFile,
  fetchAgreementFiles,
  fetchAllApplicantPositionsStatues,
  fetchApplicantPositionDetail,
  fetchEmailTemplates,
  fetchInterviewLogs,
  fetchSignLogs,
  fetchSmsTemplates,
  getApplicantProfiles,
  queryContractsById,
  queryLogs,
  removeInterviewers,
  sendSms,
  startCreateContract,
  startFetchAllInterview,
  startFetchSearchResult,
  startFetchEmailList,
  startSendEmail,
  updateInterview,
  updateSchedule,
  updateSign,
} from "../services/jobApplication";

import _ from "lodash";
import pathToRegexp from "path-to-regexp";

const emailType = ['audience', 'interview'];
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ')
  }
}
var oldElementHeight;

export default {
  namespace: 'jobApplication',

  state: {
    readonly: false,
    agreement_files: null,
    currentInterviewModalData: null,
    applicantLoading: false,
    optionsSelect: 1,
    logsList: [],  //历史记录
    applicantProfiles: null,          //求职者档案详情
    ApplicantPositionDetail: null,   //职位申请详情
    allApplicantPositionDetailStatuses: [], //职位申请的所有状态
    optionLoading: false,
    interviewOrSignList: [], //面試或签约
    allInterviews: [],
    contractList: [],//合约
    contractCount: 0,
    deleteContractModalVisible: -1,
    peopleDetails: [], //面試者详情
    loading: false, // 控制加载状态
    modalVisible: false, // 弹出窗的显示状态
    modalType: 'create', // 弹出窗的类型（添加用户，编辑用户）
    smsTemplates: null, //短信模板
    smsModalToPeopleType: 'all',
    error: null,
    emailTemplates: {
      audience: null,
      interview: null,
    },
    emailList: [],
    initialEmail: [],
    validatedEmail: [],

    searchResult: [],
    initialSearchResult: [],
    validatedSearchResult: [],

    scheduleModalStatus: false,
    appointInterviewModalStatus: false,
    appointSignModalStatus: false,
    interviewModalStatus: false,
    signModalStatus: false,
    smsModalStatus: false,
    emailModalStatus: false,
    contractModalStatus: false,
    alterInterviewResultModalStatus: false,
    alterSignModalStatus: false,
    inputInterviewResultModalStatus: false,
    alterInterviewModalStatus: false,
    confirmCancelInterviewModalStatus: false,
    finishInterviewModalStatus: false,
    confirmCancelSignModalStatus: false,
    activeTabId: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, query } = location;
        const match = pathToRegexp('/applicant_profiles/:id').exec(pathname);
        if (match) {
          const id = match[1];
          if (id == 'new') {
            return;
          }
          const activeTab = location.query.tab;
          if (activeTab === 'jobapplication') {
            dispatch({ type: 'selectActiveTabId', payload: { activeTabId: '1' } });
          } else {
            dispatch({ type: 'selectActiveTabId', payload: { activeTabId: '0' } });
          }
          dispatch({ type: 'init', payload: { id: id } });

          console.log(query.readonly);
          if (query.readonly) {
            dispatch({ type: 'setReadOnly', payload: true });
          } else {
            dispatch({ type: 'setReadOnly', payload: false });
          }
        }
      });
    },
  },

  effects: {
    * downloadContractFile({ payload }, { select, call, put }){
      const id = payload.contract_id;
      const applicantPositionId = payload.applicant_position_id;
      yield put({
        type: 'showLoading',
        payload: {
          loading: 'applicantLoading'
        }
      });
      // const hide = message.loading('正在為您生成文件..', 0);
      yield call(downloadContractFile, id, applicantPositionId);
      // message.destroy();
      yield put({
        type: 'overLoading',
        payload: {
          loading: 'applicantLoading'
        }
      });
    },

    * fetchInterviewOrSignList({ payload }, { select, call, put }){
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const applicantPositionId = payload.applicantPositionId;
      const fetchAllInterviewsResult = yield call(startFetchAllInterview, applicantPositionId, token);
      if (!fetchAllInterviewsResult.err) {
        if (fetchAllInterviewsResult.data) {
          yield put({
            type: 'fetchAllInterviewsSuccess',
            payload: {
              allInterviews: fetchAllInterviewsResult.data.data,
            }
          });
        }
      }
      var interviewLogsObj = yield call(fetchInterviewLogs, applicantPositionId, token);
      var signLogsObj = yield call(fetchSignLogs, applicantPositionId, token);
      if (!interviewLogsObj.err && !signLogsObj.err) {
        if (interviewLogsObj.data.data && signLogsObj.data.data) {
          var interviewLogs = interviewLogsObj.data.data;
          var signLogs = signLogsObj.data.data;
          for (let i = 0; i < interviewLogs.length; i++) {
            interviewLogs[i].logType = 'interview';
            if (interviewLogs[i].time != null) {
              interviewLogs[i].timeSort = parseInt(interviewLogs[i].time.replace(/[^0-9]/g, ""));
            }
          }
          for (let i = 0; i < signLogs.length; i++) {
            signLogs[i].logType = 'sign';
            if (signLogs[i].time != null) {
              signLogs[i].timeSort = parseInt(signLogs[i].time.replace(/[^0-9]/g, ""));
            }
          }
          var allLogs = interviewLogs.concat(signLogs);
          // 一个对数组对象进行排序的函数
          var by = function (name) {
            return function (o, p) {
              var a, b;
              if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                  return 0;
                }
                if (typeof a === typeof b) {
                  return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
              }
              else {
                throw ("error");
              }
            }
          };
          allLogs = allLogs.sort(by("created_at")).reverse();
          yield put({
            type: 'setInterviewOrSignList',
            payload: {
              data: allLogs
            }
          });
          const logs = yield call(queryLogs, applicantPositionId, token);
          if (!logs.err) {
            yield put({
              type: 'queryLogsSuccess',
              payload: {
                logsList: logs.data.data.reverse(),
              }
            });
          }
        }
      }
    },

    * fetchAgreementFiles({ payload }, { select, call, put }){
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      //todo get region
      const params = { region: 'macau' };
      const { data, err } = yield call(fetchAgreementFiles, params, token);
      if (!err) {
        yield put({
          type: 'fetchAgreementFilesSuccess',
          payload: {
            data: data.data
          }
        });
      }
    },

    * finishInterview({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'finishInterviewModal'
        }
      });
      const params = payload.data;
      const id = params.interview_id;
      const applicant_position_id = params.applicant_position_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(updateInterview, applicant_position_id, id, params, token);
      if (!err) {
        if (data.hasOwnProperty('state') && data.state == 'success') {
          message.success('面試已设置为完成');
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicant_position_id
            }
          });
          yield put({
            type: 'updateAllInterviews',
            payload: {
              newInterview: params,
            }
          });
        } else {
          message.error('面試完成设置失败');
        }
      } else {
        message.error('面試完成设置失败');
      }
    },

    * cancelInterview({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'confirmCancelInterviewModal'
        }
      });
      const params = payload.data;
      const id = params.interview_id;
      const applicant_position_id = params.applicant_position_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const result = yield call(updateInterview, applicant_position_id, id, params, token);
      if (!result.err) {
        if (result.data.hasOwnProperty('state')) {
          if (result.data.state == 'success') {
            message.success('面試取消成功');
            yield put({
              type: 'fetchInterviewOrSignList',
              payload: {
                applicantPositionId: applicant_position_id
              }
            });
          }
        } else {
          message.error('面試取消失败');
        }
      } else {
        message.error('面試取消失败');
      }
    },

    * alterInterview({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'alterInterviewModal'
        }
      });
      const params = payload.data;
      const id = params.interview_id;
      const applicant_position_id = params.applicant_position_id;
      const newEmails = params.interviewer_emails;
      const oldEmails = params.old_interviewer_emails;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      console.log('**********', newEmails, oldEmails);
      const emailArray = oldEmails.filter(email => {
        return (newEmails.findIndex(newEmail => newEmail === email) < 0);
      });

      console.log('^^^^^^^^^', emailArray);

      if (emailArray.length > 0) {
        const emailParams = Object.assign({}, {}, {
          applicant_position_id,
          id,
          interviewer_emails: emailArray,
        });
        const { data, err } = yield call(removeInterviewers, applicant_position_id, id, emailParams, token);
        if (data.state === 'success') {
          console.log('remove interviewers successfully');
        } else {
          console.log(err);
        }
      }

      const { data, err } = yield call(updateInterview, applicant_position_id, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('面試修改成功');
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicant_position_id
            }
          });
          if (params.need_sms === true) {
            yield put({
              type: 'showModal',
              payload: {
                modalType: 'smsModal',
              }
            });
          }
        } else {
          message.error('面試修改失败')
        }
      } else {
        message.error('面試修改失败')
      }

    },

    * cancelSign({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'confirmCancelSignModal'
        }
      });
      const params = payload.data;
      const id = params.interview_id;
      const applicant_position_id = params.applicant_position_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(updateSign, applicant_position_id, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('取消签约成功');
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicant_position_id
            }
          });
        } else {
          message.error('取消签约失败')
        }
      } else {
        message.error('取消签约失败')
      }
    },

    * alterSign({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'alterSignModal'
        }
      });
      const params = payload.data;
      const id = params.sign_id;
      const applicant_position_id = params.applicant_position_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(updateSign, applicant_position_id, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('签约修改成功');
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicant_position_id
            }
          });
        } else {
          message.error('签约修改失败')
        }
      } else {
        message.error('签约修改失败')
      }
    },

    * alterInterviewResult({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          modalType: 'alterInterviewResultModal'
        }
      });
      const params = payload.data;
      const id = params.interview_id;
      const applicant_position_id = params.applicant_position_id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(updateInterview, applicant_position_id, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('面試修改成功');
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicant_position_id
            }
          });
          yield put({
            type: 'updateAllInterviews',
            payload: {
              newInterview: params,
            }
          });
        } else {
          message.error('面試修改失败')
        }
      } else {
        message.error('面試修改失败')
      }
    },

    * showModal({ payload }, { select, call, put }){
      const modalType = payload.modalType;
      yield put({
        type: 'showModalView',
        payload: { modalType: modalType }
      });
      //设置当前弹窗的数据，主要用于 修改 取消 完成 面試等动作
      if (modalType == 'confirmCancelSignModal' || modalType == 'confirmCancelInterviewModal' || modalType == 'alterInterviewModal' || modalType == 'alterInterviewResultModal' || modalType == 'finishInterviewModal' || modalType == 'alterSignModal') {
        yield put({
          type: 'setCurrentInterviewModalData',
          payload: {
            data: payload.data
          }
        });
      }

      if (modalType == "scheduleModal") {
        const token = yield select(state => _.get(state, 'currentUser.token', null));
        const { data, err } = yield call(fetchAllApplicantPositionsStatues, token);
        if (!err) {
          if (data) {
            yield put({
              type: 'updateAllApplicantPositionsStatues',
              payload: {
                allApplicantPositionDetailStatuses: data.data,
              }
            });
          }
        }
      }

      if (modalType == "smsModal") {
        yield put({
          type: 'initSmsModal',
          payload: {}
        });
        yield put({
          type: 'clearSmsTemplates',
          payload: {}
        })
        const smst = yield select(({ jobApplication })=>jobApplication.smsTemplates);

        console.log('qingkong', smst)
        const department = yield select(({ jobApplication })=>_.get(jobApplication.ApplicantPositionDetail.department,'chinese_name'));
        const position_name = yield select(({ jobApplication })=>_.get(jobApplication.ApplicantPositionDetail.position,'chinese_name'));
        const applicant_no = yield select(({ jobApplication })=>jobApplication.applicantProfiles.applicant_no);
        const name = yield select(({ jobApplication })=>_.get(jobApplication.applicantProfiles,'chinese_name'));
        var allInterviews = [];
        const token = yield select(state => _.get(state, 'currentUser.token', null));
        const ApplicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
        const fetchAllInterviewsResult = yield call(startFetchAllInterview, ApplicantPositionId, token);
        if (!fetchAllInterviewsResult.err) {
          if (fetchAllInterviewsResult.data) {
            allInterviews = fetchAllInterviewsResult.data.data;
          }
        }
        let allFirstInterviewTime = [];
        let allSecondInterviewTime = [];
        let allThirdInterviewTime = [];
        allInterviews.map(item => {
          item.mark == '第一次面試' ? allFirstInterviewTime.push(item) : null;
          item.mark == '第二次面試' ? allSecondInterviewTime.push(item) : null;
          item.mark == '第三次面試' ? allThirdInterviewTime.push(item) : null;
        });

        var first = allFirstInterviewTime[0] != undefined ? allFirstInterviewTime.reverse()[0].time : null;
        var second = allSecondInterviewTime[0] != undefined ? allSecondInterviewTime.reverse()[0].time : null;
        var third = allThirdInterviewTime[0] != undefined ? allThirdInterviewTime.reverse()[0].time : null;

        const interviewsAndSigns = yield select(({ jobApplication })=>jobApplication.interviewOrSignList);
        const currentSign = interviewsAndSigns.find(item => (item.logType === 'sign' &&
        item.status !== 'cancelled'));
        const signTime = payload.signTime !== undefined ? payload.signTime : currentSign !== undefined ? currentSign.time : null;
        let params = {
          position_name: department + position_name,
          applicant_no: applicant_no,
          applicant_name: name,
          first_interview_time: first != null ? first.substring(0, 4) + '年' + first.substring(5, 7) + '月' + first.substring(8, 10) + '日' + first.substring(10, 12) + '時' + first.substring(13, 15) + '分' : null,
          second_interview_time: second != null ? second.substring(0, 4) + '年' + second.substring(5, 7) + '月' + second.substring(8, 10) + '日' + second.substring(10, 12) + '時' + second.substring(13, 15) + '分' : null,
          third_interview_time: third != null ? third.substring(0, 4) + '年' + third.substring(5, 7) + '月' + third.substring(8, 10) + '日' + third.substring(10, 12) + '時' + third.substring(13, 15) + '分' : null,
          contract_notice_time: signTime != null ? signTime.substring(0, 4) + '年' + signTime.substring(5, 7) + '月' + signTime.substring(8, 10) + '日' + signTime.substring(10, 12) + '時' + signTime.substring(13, 15) + '分' : null,
          change_contract_time: signTime != null ? signTime.substring(0, 4) + '年' + signTime.substring(5, 7) + '月' + signTime.substring(8, 10) + '日' + signTime.substring(10, 12) + '時' + signTime.substring(13, 15) + '分' : null,
        };
        const smsTemplates = yield call(fetchSmsTemplates, params, token);
        if (smsTemplates) {
          if (!smsTemplates.err) {
            yield put({
              type: 'querySmsTemplates',
              payload: {
                smsTemplates: smsTemplates.data.data
              }
            })
          }
        } else {
          message.error('獲取sms模板失敗')
        }
      }

      if (modalType == "emailModal") {
        const token = yield select(state => _.get(state, 'currentUser.token', null));
        for (const type of emailType) {
          let params = {};
          if (type === 'audience') {
            const ApplicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
            params = {
              email_type: 'audience_choose_needed_to_interviewer',
              applicant_position_id: ApplicantPositionId,
            };
          }

          if (type === 'interview') {
            let interviewId = undefined;
            const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
            const token = yield select(state => _.get(state, 'currentUser.token', null));
            const { data, err } = yield call(startFetchAllInterview, applicantPositionId, token);
            if (!err) {
              if (data) {
                const allInterviews = data.data.sort((card1, card2) => {
                  if (card1.created_at === undefined || card1.created_at >= card2.created_at) {
                    return -1;
                  }
                  if (card1.created_at < card2.created_at) {
                    return 1;
                  }
                });

                if (payload.interviewId) {
                  const interview = allInterviews.find(item => item.id === payload.interviewId);
                  interviewId = interview.id;
                } else {
                  const interview = allInterviews.find(item => item.result === 'needed');
                  interviewId = interview !== undefined ? interview.id : undefined;
                }

                yield put({
                  type: 'fetchAllInterviewsSuccess',
                  payload: {
                    allInterviews: data.data,
                  }
                });
              }
            }

            if (interviewId !== undefined) {
              params = {
                email_type: 'interview_to_interviewer',
                interview_id: interviewId,
              };
            }
          }
          let temp = {};
          if (params.email_type) {
            const emailTemplate = yield call(fetchEmailTemplates, params, token);
            if (!emailTemplate.err) {
              temp = emailTemplate.data.data;
            }
          } else {
            temp = {
              body: `No ${type}`,
            };
          }
          if(params.email_type =='interview_to_interviewer'){
          if (temp.body.indexOf('面試时间')) {
              const str1 = temp.body.substring(0, 16);
              const str2 = temp.body.substring(16);
              temp.body = str1 + "\u00a0\u00a0" + str2
            }
          }
          yield put({
            type: 'queryEmailTemplatesSuccess',
            payload: {
              emailTemplate: temp,
              type,
            }
          });
        }
      }
    },

    * changeOptions({ payload }, { select, call, put }){
      yield put({
        type: 'showLoading',
        payload: {
          loading: 'applicantLoading'
        }
      });
      var applicantPositionId = null;
      switch (payload.option) {
        case 1:
          applicantPositionId = payload.applicantPositionIds[0];
          break;
        case 2:
          applicantPositionId = payload.applicantPositionIds[1];
          break;
        case 3:
          applicantPositionId = payload.applicantPositionIds[2];
          break;
        default:
          applicantPositionId = payload.applicantPositionIds[0];
      }

      if (applicantPositionId == null) {
        Modal.warning({
          title: '暂未进行第' + payload.option + '选择'
        });
        applicantPositionId = payload.applicantPositionIds[0];

        yield put({
          type: 'overLoading',
          payload: {
            loading: 'applicantLoading'
          }
        });
        return;
      }

      yield put({
        type: 'changeOptionsView',
        payload: {
          option: payload.option,
        }
      });

      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const detail = yield call(fetchApplicantPositionDetail, applicantPositionId, token);
      if (!detail.err) {
        if (detail.data) {
          yield put({
            type: 'queryApplicantPositionDetail',
            payload: {
              ApplicantPositionDetail: detail.data.data,
            }
          });
        }
      }
      const sms_params = {};
      const smsTemplates = yield call(fetchSmsTemplates, sms_params, token);

      if (smsTemplates) {
        if (!smsTemplates.err) {
          console.log('this is sms', smsTemplates.data.data);
          yield put({
            type: 'querySmsTemplates',
            payload: {
              smsTemplates: smsTemplates.data.data
            }
          })
        }
      } else {
        message.error('獲取sms模板失敗')
      }

      const logs = yield call(queryLogs, applicantPositionId, token);
      if (!logs.err) {
        yield put({
          type: 'queryLogsSuccess',
          payload: {
            logsList: logs.data.data.reverse(),
          }
        });
      }

      const params = { id: applicantPositionId };
      const queryContractsResult = yield call(queryContractsById, params, token);

      if (!queryContractsResult.err) {
        const tmpContracts = queryContractsResult.data.data;

        //todo set region
        const params = { region: 'macau' };
        const token = yield select(state => _.get(state, 'currentUser.token', null));
        const result = yield call(fetchAgreementFiles, params, token);
        if (!result.err) {
          const file_list = result.data.data;
          const contracts = tmpContracts.map(contract => {
            return Object.assign({}, contract, {
              title: file_list[contract.file_key],
            });
          });
          yield put({
            type: 'queryContractsSuccess',
            payload: {
              contracts,
            },
          });
        }
      }

      yield put({
        type: 'fetchInterviewOrSignList',
        payload: {
          applicantPositionId: applicantPositionId
        }
      });
      yield put({
        type: 'overLoading',
        payload: {
          loading: 'applicantLoading'
        }
      });
    },

    * createContract({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'contractModal'
        }
      });

      const { formFields } = payload;

      for (let i = 0; i < formFields.file_keys.length; i++) {
        const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);

        const token = yield select(state => _.get(state, 'currentUser.token', null));
        const region = yield select(state => state.region);

        const params = Object.assign({}, { file_key: formFields.file_keys[i] }, {
          region,
          data: [],
        });
        const { data, err } = yield call(startCreateContract, params, applicantPositionId, token);

        if (!err) {
          if (data) {
            const creator = yield select(state => _.get(state, 'currentUser', null));
            const file_list = yield select(({ jobApplication })=>jobApplication.agreement_files);
            const title = file_list[params.file_key];

            const contract = Object.assign({}, data.data, {
              creator,
              title,
            });

            yield put({
              type: 'createContractSuccess',
              payload: {
                newContract: contract,
              }
            });
            const randomId = parseInt((Number.MIN_SAFE_VALUE) * Math.random());
            const newLog = {
              applicant_position_id: applicantPositionId,
              behavior: 'agreement_file_created',
              created_at: contract.created_at,
              id: randomId,
              info: {
                agreement_file: contract,
                change: {},
                title: '合約文件創建',
              },
              updated_at: contract.created_at,
              user: creator,
              user_id: creator.id,
            };

            yield put({
              type: 'updateLogsList',
              payload: {
                newLog,
              }
            });
          }
        }
        const logs = yield call(queryLogs, applicantPositionId, token);
        if (!logs.err) {
          yield put({
            type: 'queryLogsSuccess',
            payload: {
              logsList: logs.data.data.reverse(),
            }
          });
        }
      }
    },

    * sendEmail({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'emailModal'
        }
      });
      //todo
      const applicantPosition = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail);
      const applicantPositionId = applicantPosition.id;
      const tmpParams = payload.data;
      const interviewers = tmpParams.interviewers;
      const emailTemplates = yield select(({ jobApplication })=>jobApplication.emailTemplates);
      const audienceMailContent = emailTemplates.audience.body;
      const emailType = tmpParams.email_content === audienceMailContent ? 'audience' : 'interview';
      const mark = emailType === 'audience' ? '通知接見' : '通知面試';
      const myrecruitUrl = '#/recruit/myrecruit';
      const url = emailType === 'audience' ? myrecruitUrl : `${myrecruitUrl}?tab=interviewers`;
      const email = emailTemplates[emailType];
      const subject = email === null ? 'HELLO' : email.subject;
      const body = tmpParams.email_content;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      for (const interviewer of interviewers) {
        const params = Object.assign({}, {}, {
          to: interviewer, // todo: should be modify
          subject,
          body,
          the_object: 'applicant_position',
          the_object_id: applicantPositionId,
          mark: mark,
          url: url,
        });

        const { data, err } = yield call(startSendEmail, params, token);
        if (!err) {
          if (data.hasOwnProperty('state') && data.state == 'success') {
            message.success('Email发送成功')
          } else {
            message.error('Email 发送失败')
          }
        } else {
          message.error('Email 发送失败')
        }
      }

      const logs = yield call(queryLogs, applicantPositionId, token);
      if (!logs.err) {
        yield put({
          type: 'queryLogsSuccess',
          payload: {
            logsList: logs.data.data.reverse(),
          }
        });
      }

      if (emailType === 'audience') {
        const applicantPositionId = applicantPosition.id;

        for (const interviewer of interviewers) {

          const params = {
            applicant_position_id: applicantPositionId,
            user_email: interviewer,
            /* user_id: user.id, */
            status: 'choose_needed',
            /* interview_id: interviewId, */
          };

          const { data, err } = yield call(createAudience, params, applicantPositionId, token);
          if (!err) {
            if (data.hasOwnProperty('state') && data.state == 'success') {
              message.success('Email发送成功')
            } else {
              message.error('Email 发送失败')
            }
          } else {
            message.error('Email 发送失败')
          }
        }
        const logs = yield call(queryLogs, applicantPositionId, token);
        if (!logs.err) {
          yield put({
            type: 'queryLogsSuccess',
            payload: {
              logsList: logs.data.data.reverse(),
            }
          });
        }
      }
    },

    * sendSms({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'smsModal'
        }
      });
      const id = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const allInterviews = yield select(({ jobApplication })=>jobApplication.allInterviews);
      var interview_id = null;
      if (allInterviews[0] != undefined) {
        interview_id = allInterviews[allInterviews.length - 1].id;
      }
      var params = payload.data;
      if (params.who == 'all') {
        var params2 = {};
        params2.to = params.introducerMobileNumber;
        params2.title = params.introducerMobileNumber;
        params2.content = params.smsContentToIntroducer;
        params2.the_object = 'interview';
        params2.the_object_id = interview_id;
        params2.mark = 'to_introducer' + params.markTemplateToIntroducer + params.markTemplateToApplicantChanged;
        params.to = params.mobile_number;
        params.title = params.mobile_number;
        params.content = params.smsContentToApplicant;
        params.the_object = 'interview';
        params.the_object_id = interview_id;
        params.mark = 'to_applicant' + params.markTemplateToApplicant + params.markTemplateToApplicantChanged;
        delete params.mobile_number;
        delete params.smsContentToApplicant;
        delete params.introducerMobileNumber;
        delete params.smsContentToIntroducer;
        const sms = yield call(sendSms, params, token);
        if (!sms.err) {
          var data = sms.data;
          if (data.hasOwnProperty('state') && data.state == 'success') {
            message.success('短信发送成功')
          } else {
            message.error('短信发送失败')
          }
        } else {
          message.error('短信发送失败')
        }

        const sms2 = yield call(sendSms, params2, token);
        if (!sms2.err) {
          var data2 = sms.data;
          if (data2.hasOwnProperty('state') && data2.state == 'success') {
            message.success('短信发送成功');
            const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
            yield put({
              type: 'fetchInterviewOrSignList',
              payload: {
                applicantPositionId: applicantPositionId
              }
            });
          } else {
            message.error('短信发送失败')
          }
        } else {
          message.error('短信发送失败')
        }
      }
      if (params.who == 'applicant') {
        params.to = params.mobile_number;
        params.title = params.mobile_number;
        params.content = params.smsContentToApplicant;
        delete params.introducerMobileNumber;
        delete params.smsContentToIntroducer;
        params.the_object = 'interview';
        params.the_object_id = interview_id;
        params.mark = 'to_applicant' + params.markTemplateToApplicant + params.markTemplateToApplicantChanged;
        delete params.mobile_number;
        delete params.smsContentToApplicant;
        const sms = yield call(sendSms, params, token);

        if (!sms.err) {
          var data = sms.data;
          if (data.hasOwnProperty('state') && data.state == 'success') {
            message.success('短信发送成功');
            const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
            yield put({
              type: 'fetchInterviewOrSignList',
              payload: {
                applicantPositionId: applicantPositionId
              }
            });
          } else {
            message.error('短信发送失败')
          }
        } else {
          message.error('短信发送失败')
        }
      }
      if (params.who == 'sponsor') {
        params.to = params.introducerMobileNumber;
        params.title = params.mobile_number;
        params.content = params.smsContentToIntroducer;
        params.the_object = 'interview';
        params.the_object_id = interview_id;
        params.mark = 'to_introducer' + params.markTemplateToIntroducer + params.markTemplateToApplicantChanged;
        delete params.mobile_number;
        delete params.smsContentToApplicant;
        const sms = yield call(sendSms, params, token);
        if (!sms.err) {
          var data = sms.data;
          if (data.hasOwnProperty('state') && data.state == 'success') {
            message.success('短信发送成功');
            const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
            yield put({
              type: 'fetchInterviewOrSignList',
              payload: {
                applicantPositionId: applicantPositionId
              }
            });
          } else {
            message.error('短信发送失败')
          }
        } else {
          message.error('短信发送失败')
        }
      }
    },

    * appointSign({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'appointSignModal'
        }
      });

      const params = payload.data;
      const id = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(createSign, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('签约创建成功');
          const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicantPositionId
            }
          });
        } else {
          message.error('签约创建失败')
        }
      } else {
        message.error('签约创建失败')
      }
    },

    * createInterview({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'appointInterviewModal'
        }
      });
      const id = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
      const params = payload.data;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const result = yield call(createInterview, id, params, token);
      if (!result.err) {
        if (result.data.state == 'success') {
          message.success('面試创建成功');
          if (params.need_email == true) {
            yield put({
              type: 'jobApplication/showModal',
              payload: {
                'modalType': 'emailModal'
              }
            });
          }

          if (params.need_sms == true) {
            yield put({
              type: 'jobApplication/showModal',
              payload: {
                'modalType': 'smsModal'
              }
            });
          }

          const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicantPositionId
            }
          });

        } else {
          message.error('面試创建失败')
        }
      } else {
        message.error('面試创建失败')
      }
    },

    * updateSchedule({ payload }, { select, call, put }){
      yield put({
        type: 'hideModal',
        payload: {
          'modalType': 'scheduleModal'
        }
      });
      const params = payload.data;
      const id = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(updateSchedule, id, params, token);
      if (!err) {
        if (data.state == 'success') {
          message.success('更新進度成功');
          const applicantPositionId = yield select(({ jobApplication })=>jobApplication.ApplicantPositionDetail.id);
          yield put({
            type: 'fetchInterviewOrSignList',
            payload: {
              applicantPositionId: applicantPositionId
            }
          });
          const detail = yield call(fetchApplicantPositionDetail, applicantPositionId, token);
          if (detail.data) {
            yield put({
              type: 'queryApplicantPositionDetail',
              payload: {
                ApplicantPositionDetail: detail.data.data,
              }
            });
          }
        } else {
          message.error('更新進度失敗');
        }
      } else {
        message.error('更新進度失敗');
      }
    },

    * fetchAllInterview({ payload }, { select, call, put }){
      /* const params = {id: 1}; */
      const { applicantPositionId } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));

      const { data, err } = yield call(startFetchAllInterview, applicantPositionId, token);
      if (!err) {
        if (data) {
          yield put({
            type: 'fetchAllInterviewsSuccess',
            payload: {
              allInterviews: data.data,
            }
          });
        }
      }
    },

    * updateOptions({ payload }, { select, call, put }){
      const id = yield select(({ jobApplication })=>jobApplication.applicantProfiles.id);
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(getApplicantProfiles, { id }, token);

      if (!err) {
        if (data) {
          var applicantPositionId = data.data.first_applicant_position_id;
          yield put({
            type: 'queryApplicantProfiles',
            payload: {
              applicantProfiles: data.data,
            }
          });
        }
      }
      let first_applicant_position_id = yield select(({ jobApplication })=>jobApplication.applicantProfiles.first_applicant_position_id);
      let second_applicant_position_id = yield select(({ jobApplication })=>jobApplication.applicantProfiles.second_applicant_position_id);
      let third_applicant_position_id = yield select(({ jobApplication })=>jobApplication.applicantProfiles.third_applicant_position_id);

      yield put({
        type: 'changeOptions',
        payload: {
          option: yield select(({ jobApplication })=>jobApplication.optionsSelect),
          applicantPositionIds: [
            first_applicant_position_id,
            second_applicant_position_id,
            third_applicant_position_id,
          ]
        }
      });
    },

    * init({ payload }, { select, call, put }){
      yield put({
        type: 'changeOptionsView',
        payload: {
          option: 1
        }
      });
      yield put({
        type: 'showLoading',
        payload: {
          loading: 'applicantLoading'
        }
      });
      const id = payload.id;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(getApplicantProfiles, { id }, token);

      if (!err) {
        if (data) {
          var applicantPositionId = data.data.first_applicant_position_id;
          yield put({
            type: 'queryApplicantProfiles',
            payload: {
              applicantProfiles: data.data,
            }
          });

          const detail = yield call(fetchApplicantPositionDetail, data.data.first_applicant_position_id, token);
          if (!detail.err) {
            if (detail.data) {
              yield put({
                type: 'queryApplicantPositionDetail',
                payload: {
                  ApplicantPositionDetail: detail.data.data,
                }
              });
            }
          }

          const allApplicantPositionStatus = yield call(fetchAllApplicantPositionsStatues, token);
          if (!allApplicantPositionStatus.err) {
            yield put({
              type: 'updateAllApplicantPositionsStatues',
              payload: {
                allApplicantPositionDetailStatuses: allApplicantPositionStatus.data.data,
              }
            });
          }
          const sms_params = {};
          const smsTemplates = yield call(fetchSmsTemplates, sms_params, token);

          if (smsTemplates) {
            if (!smsTemplates.err) {
              console.log('this is sms', smsTemplates.data.data);
              yield put({
                type: 'querySmsTemplates',
                payload: {
                  smsTemplates: smsTemplates.data.data
                }
              })
            }
          } else {
            message.error('獲取sms模板失敗')
          }

          const logs = yield call(queryLogs, applicantPositionId, token);
          if (!logs.err) {
            yield put({
              type: 'queryLogsSuccess',
              payload: {
                logsList: logs.data.data.reverse(),
              }
            });
          }
          const params = { id: data.data.first_applicant_position_id };

          yield put({
            type: 'fetchAgreementFiles',
            payload: {}
          });

          const queryContractsResult = yield call(queryContractsById, params, token);
          if (!queryContractsResult.err) {
            const tmpContracts = queryContractsResult.data.data;

            //todo get region
            const params = { region: 'macau' };
            const token = yield select(state => _.get(state, 'currentUser.token', null));
            const result = yield call(fetchAgreementFiles, params, token);
            if (!result.err) {
              const file_list = result.data.data;
              const contracts = tmpContracts.map(contract => {
                return Object.assign({}, contract, {
                  title: file_list[contract.file_key],
                });
              });
              yield put({
                type: 'queryContractsSuccess',
                payload: {
                  contracts,
                },
              });
            }
          }
        }
      }

      if (err) {
        console.log('err', err);
      }
      yield put({
        type: 'fetchInterviewOrSignList',
        payload: {
          applicantPositionId: applicantPositionId
        }
      });
      yield put({
        type: 'overLoading',
        payload: {
          loading: 'applicantLoading'
        }
      })
    },

    * fetchApplicantProfiles({ payload }, { select, call, put }){
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(getApplicantProfiles, 1, token);
      if (!err) {
        if (data) {
          yield put({
            type: 'queryApplicantProfiles',
            payload: {
              applicantProfiles: data,
            }
          });
        }
      }
      if (err) {
        console.log('err', err);
      }
    },

    * fetchSearchResult({ payload }, { select, call, put }){
      const { value } = payload;

      const { data, err } = yield call(startFetchSearchResult, { key: value });
      if (!err) {
        console.log('searchResult', data.data.users);
        yield put({
          type: 'fetchSearchResultSuccess',
          payload: {
            newSearchResult: data.data.users,
          }
        });
      }
      if (err) {
        console.log('err', err);
      }
    },

    * fetchEmailList({ payload }, { select, call, put }){
      const { value } = payload;

      const { data, err } = yield call(startFetchEmailList, { email: value });
      if (!err) {
        yield put({
          type: 'fetchEmailListSuccess',
          payload: {
            newEmailList: data.data,
          }
        });
      }
      if (err) {
        console.log('err', err);
      }
    },
    *create(){
    },
    *'delete'(){
    },
    *update(){
    },

    *deleteContract({ payload }, { call, put, select }){
      const { id, applicantPositionId } = payload;
      const token = yield select(state => _.get(state, 'currentUser.token', null));
      const { data, err } = yield call(deleteContractById, { applicantPositionId, id, token });
      if (!err) {
        yield put({ type: 'deleteContractSuccess', payload: { id } });
      }
      const logs = yield call(queryLogs, applicantPositionId, token);
      if (!logs.err) {
        yield put({
          type: 'queryLogsSuccess',
          payload: {
            logsList: logs.data.data.reverse(),
          }
        });
      }
    },
  },

  reducers: {
    clearSmsTemplates(state){
      return { ...state, smsTemplates: null }
    },
    fetchAgreementFilesSuccess(state, action){
      return { ...state, agreement_files: action.payload.data };
    },
    initSmsModal(state, action){
      return { ...state, smsModalToPeopleType: 'all' };
    },
    setCurrentInterviewModalData(state, action){
      return { ...state, currentInterviewModalData: action.payload.data };
    },
    setInterviewOrSignList(state, action){
      return { ...state, interviewOrSignList: action.payload.data };
    },
    setSmsModalToPeopleType(state, action){
      return { ...state, smsModalToPeopleType: action.payload.type };
    },
    querySmsTemplates(state, action){
      return { ...state, smsTemplates: action.payload.smsTemplates };
    },
    changeOptionsView(state, action){
      return { ...state, optionsSelect: action.payload.option };
    },
    showLoading(state, action){
      // addClass(document.body, 'body-noscroll');
      return { ...state, [action.payload.loading]: true };
    },
    overLoading(state, action){
      // removeClass(document.body, 'body-noscroll');
      var el = document.getElementsByClassName("ant-spin-container")[0];
      if (el != null) {
        el.style.height = oldElementHeight + 'px';
      }
      return { ...state, [action.payload.loading]: false };
    },
    showOptionLoading(state, action){
      return { ...state, optionLoading: true }
    },

    showModalView(state, action){
      addClass(document.body, 'body-noscroll');
      const currentModal = action.payload.modalType + 'Status';
      return { ...state, [currentModal]: true };
    },

    hideModal(state, action){
      removeClass(document.body, 'body-noscroll');
      const currentModal = action.payload.modalType + 'Status';
      return { ...state, [currentModal]: false };
    },
    updateAllApplicantPositionsStatues(state, action){
      return { ...state, ...action.payload }
    },
    queryApplicantPositionDetail(state, action){
      return { ...state, ...action.payload, optionLoading: false }
    },
    queryLogsSuccess(state, action){
      return { ...state, ...action.payload, loading: false }
    },
    queryApplicantProfiles(state, action){
      return { ...state, ...action.payload, loading: false }
    },
    querySuccess(){
    },
    createSuccess(){
    },
    deleteSuccess(){
    },
    updateSuccess(){
    },

    fetchAllInterviewsSuccess(state, { payload }){
      const { allInterviews } = payload;
      return { ...state, allInterviews };
    },

    queryEmailTemplatesSuccess(state, { payload }) {
      const { emailTemplate, type } = payload;
      return {
        ...state,
        emailTemplates: { ...state.emailTemplates, [type]: emailTemplate }
      };

    },

    queryContractsSuccess(state, { payload }) {
      const { contracts } = payload;
      const contractCount = contracts.length;
      return { ...state, contractList: contracts, contractCount };

    },

    createContractSuccess(state, { payload }) {
      const { newContract } = payload;
      const newContractList = [...state.contractList, newContract];
      const newContractCount = state.contractCount + 1;
      return { ...state, contractList: newContractList, contractCount: newContractCount };
    },

    deleteContractSuccess(state, { payload }) {
      const { id } = payload;
      const oldContractList = state.contractList;
      const index = oldContractList.findIndex(contract => contract.id === id);
      const newContractList = [...oldContractList.slice(0, index),
        ...oldContractList.slice(index + 1)];
      const newContractCount = state.contractCount - 1;
      return { ...state, contractList: newContractList, contractCount: newContractCount };
    },

    fetchSearchResultSuccess(state, { payload }) {
      const { newSearchResult } = payload;
      return { ...state, searchResult: newSearchResult };
    },

    emptySearchResult(state, { payload }) {
      return { ...state, searchResult: [] };
    },

    fetchEmailListSuccess(state, { payload }) {
      const { newEmailList } = payload;
      return { ...state, emailList: newEmailList };
    },

    emptyEmailList(state, { payload }) {
      return { ...state, emailList: [] };
    },

    toggleDeleteContractModal(state, { payload }) {
      const { id } = payload;
      return { ...state, deleteContractModalVisible: id };
    },

    updateLogsList(state, { payload }) {
      const { newLog } = payload;
      return { ...state, logsList: [...state.logsList, newLog] };
    },

    updateInitialSearchResult(state, { payload }) {
      const { result } = payload;
      return { ...state, initialSearchResult: result };
    },

    updateValidatedSearchResult(state, { payload }) {
      const { result } = payload;
      return { ...state, validatedSearchResult: [...state.validatedSearchResult, ...result] };
    },

    emptyValidatedSearchResult(state, { payload }) {
      return { ...state, validatedSearchResult: [] };
    },

    updateInitialEmail(state, { payload }) {
      const { emails } = payload;
      return { ...state, initialEmail: emails };
    },

    updateValidatedEmail(state, { payload }) {
      const { emails } = payload;
      return { ...state, validatedEmail: [...state.validatedEmail, ...emails] };
    },

    emptyValidatedEmail(state, { payload }) {
      return { ...state, validatedEmail: [] };
    },


    updateAllInterviews(state, { payload }) {
      const { newInterview } = payload;
      const oldAllInterviews = state.allInterviews;
      const newAllInterviews = oldAllInterviews.map(interview => {
        if (interview.id === newInterview.interview_id) {
          return Object.assign({}, interview, {
            score: newInterview.score,
            result: newInterview.result,
            evaluation: newInterview.evaluation,
          });
        }
        return interview;
      });
      return { ...state, allInterviews: newAllInterviews };
    },

    selectActiveTabId(state, { payload }) {
      const { activeTabId } = payload;
      return { ...state, activeTabId };
    },

    setReadOnly(state, { payload: readonly }) {
      return {
        ...state,
        readonly
      }
    },
  }
};
