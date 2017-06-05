import { Col, Row, Tabs, message } from 'antd';
import React, { Component } from 'react';

import AlterInterviewModal from '../../components/JobApplication/Modals/alterInterviewModal';
import AlterInterviewResultModal from '../../components/JobApplication/Modals/alterInterviewResultModal';
import AlterSignModal from '../../components/JobApplication/Modals/alterSignModal';
import AppointInterviewModal from '../../components/JobApplication/Modals/appointInterviewModal';
import AppointSignModal from '../../components/JobApplication/Modals/appointSignModal';
import ConfirmCancelInterviewModal from '../../components/JobApplication/Modals/confirmCancelInterviewModal';
import ConfirmCancelSignModal from '../../components/JobApplication/Modals/confirmCancelSignModal';
import Contract from '../../components/JobApplication/Contract';
import ContractModal from '../../components/JobApplication/Modals/contractModal';
import EmailModal from '../../components/JobApplication/Modals/emailModal';
import FinishInterviewModal from '../../components/JobApplication/Modals/finishInterviewModal';
import { InterviewLogs } from '../../components/JobApplication/InterviewLogs';
import InterviewModal from '../../components/JobApplication/Modals/interviewModal';
import InterviewOrSign from '../../components/JobApplication/InterviewOrSign';
import JobOptions from '../../components/JobApplication/JobOptions';
import ScheduleModal from '../../components/JobApplication/Modals/scheduleModal';
import SignModal from '../../components/JobApplication/Modals/signModal';
import SmsModal from '../../components/JobApplication/Modals/smsModal';
import { Spin } from 'antd';
import { connect } from 'dva';
import style from '../../components/JobApplication/jobApplication.less';

const {TabPane} = Tabs;



class JobApplication extends Component {

  render() {

    const jobApplication = this.props.jobApplication;
    const newApplicantProfile = this.props.newApplicantProfile;
    const dispatch = this.props.dispatch;

    const {
      downloadContractFile,
      agreement_files,
      alterSignModalStatus,
      currentInterviewModalData,
      applicantLoading,
      finishInterviewModalStatus,
      confirmCancelInterviewModalStatus,
      alterInterviewResultModalStatus,
      alterInterviewModalStatus,
      smsModalToPeopleType,
      smsTemplates,
      optionsSelect,
      interviewOrSignList,
      logsList,
      ApplicantPositionDetail,
      optionLoading,
      scheduleModalStatus,
      appointInterviewModalStatus,
      appointSignModalStatus,
      interviewModalStatus,
      signModalStatus,
      smsModalStatus,
      emailModalStatus,
      emailTemplates,
      emailList,
      initialEmail,
      validatedEmail,
      searchResult,
      initialSearchResult,
      validatedSearchResult,
      contractModalStatus,
      contractList,
      contractCount,
      deleteContractModalVisible,
      allApplicantPositionDetailStatuses,
      confirmCancelSignModalStatus,
      allInterviews,
      readonly,
    } = jobApplication;

    var {applicantProfiles} = jobApplication;
    var jobApplication_applicantProfiles = applicantProfiles;

    const {profile} = newApplicantProfile;
    var applicantProfiles = profile;

    const handleEmptyValidatedEmail = () => {
      dispatch({
        type: 'jobApplication/emptyValidatedEmail',
        payload: null,
      });
    }

    const handleEmptyValidatedSearchResult = () => {
      dispatch({
        type: 'jobApplication/emptyValidatedSearchResult',
        payload: null,
      });
    }

    const handleEmptySearchResult = () => {
      dispatch({
        type: 'jobApplication/emptySearchResult',
        payload: null,
      });
    }

    const handleEmptyEmailList = () => {
      dispatch({
        type: 'jobApplication/emptyEmailList',
        payload: null,
      });
    }

    const handleEmptyInitialSearchResult = () => {
      dispatch({
        type: 'jobApplication/updateInitialSearchResult',
        payload: {
          result: [],
        },
      });
    }

    const handleEmptyInitialEmail = () => {
      dispatch({
        type: 'jobApplication/updateInitialEmail',
        payload: {
          emails: [],
        },
      });
    }


    const jobOptionsProps = {
      readonly,
      allApplicantPositionDetailStatuses,
      optionsSelect,
      applicantProfiles,
      ApplicantPositionDetail,
      optionLoading,
      allInterviews,
      currentUser: this.props.currentUser,
      region: this.props.region,
      onShowModal(modalType) {
        const currentStatus = ApplicantPositionDetail.status;
        if (currentStatus === "not_started" && modalType !== "scheduleModal") {
          message.warning('當前進度爲"未啓動"，該功能不可使用');
          return;
        }
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType
          }
        });
      },
      onChangeOptions(option) {
        const applicantPositionIds = [
          jobApplication_applicantProfiles.first_applicant_position_id,
          jobApplication_applicantProfiles.second_applicant_position_id,
          jobApplication_applicantProfiles.third_applicant_position_id
        ];

        dispatch({
          type: 'jobApplication/changeOptions',
          payload: {
            option: option,
            applicantPositionIds: applicantPositionIds
          }
        });
      }
    };

    const interviewLogsProps = {
      smsTemplates,
      agreement_files,
      logsList,
      allApplicantPositionDetailStatuses,
      applicantProfiles,
    };
    const interviewOrSignProps = {
      readonly,
      interviewOrSignList,
      currentUser: this.props.currentUser,
      region: this.props.region,
      onShowModal(modalType, data) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType,
            data: data
          }
        });
      },
    };
    const contractProps = {
      readonly,
      contractList,
      deleteContractModalVisible,
      dispatch,
      currentUser: this.props.currentUser,
      region: this.props.region,
    };
    const confirmCancelSignModalProps = {
      confirmCancelSignModalStatus,
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      onOk(data) {
        dispatch({
          type: 'jobApplication/cancelSign',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            modalType: 'confirmCancelSignModal'
          }
        });
      },
      showModal(modalType, time) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType,
            signTime: time,
          }
        });
      }
    };
    const finishInterviewModalProps = {
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      finishInterviewModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/finishInterview',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            modalType: 'finishInterviewModal'
          }
        });
      },
      changeSchedule(data) {
        dispatch({
          type: 'jobApplication/updateSchedule',
          payload: { data: data }
        });
      },
    };
    const confirmCancelInterviewModalProps = {
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      confirmCancelInterviewModalStatus,
      dispatch,
      onOk(data) {
        dispatch({
          type: 'jobApplication/cancelInterview',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            modalType: 'confirmCancelInterviewModal'
          }
        });
      },
      showModal(modalType, interviewId) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType,
            interviewId,
          }
        });
      }
    };

    const alterInterviewResultModalProps = {
      emailList,
      searchResult,
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      alterInterviewResultModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/alterInterviewResult',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'alterInterviewResultModal'
          }
        });
      },
      changeSchedule(data) {
        dispatch({
          type: 'jobApplication/updateSchedule',
          payload: { data: data }
        });
      },
      showModal(modalType) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType
          }
        });
      }
    };


    const alterInterviewModalProps = {
      dispatch,
      emailList,
      searchResult,
      validatedEmail,
      validatedSearchResult,
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      alterInterviewModalStatus,
      onOk(data) {
        console.log('here!!', data);
        dispatch({
          type: 'jobApplication/alterInterview',
          payload: { data: data }
        });

        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyValidatedEmail();
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'alterInterviewModal'
          }
        });

        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyValidatedEmail();
      },
      showModal(modalType, interviewId) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType,
            interviewId,
          }
        });
      }
    };

    const alterSignModalProps = {
      currentInterviewModalData,
      ApplicantPositionDetail,
      applicantProfiles,
      alterSignModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/alterSign',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'alterSignModal'
          }
        });
      },
      showModal(modalType, time) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            modalType: modalType,
            signTime: time,
          }
        });
      }
    };


    const scheduleModalProps = {
      ApplicantPositionDetail,
      scheduleModalStatus,
      allApplicantPositionDetailStatuses,
      onOk(data) {
        dispatch({
          type: 'jobApplication/updateSchedule',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'scheduleModal'
          }
        });
      }
    };

    const appointInterviewModalProps = {
      ApplicantPositionDetail,
      applicantProfiles,
      appointInterviewModalStatus,
      emailList,
      searchResult,
      validatedEmail,
      validatedSearchResult,
      dispatch,
      onOk(data) {
        dispatch({
          type: 'jobApplication/createInterview',
          payload: { data: data }
        });

        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyValidatedEmail();
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'appointInterviewModal'
          }
        });

        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyValidatedEmail();
      },

      showModal(modalType) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            'modalType': modalType
          }
        });
      }
    };
    const emailModalProps = {
      emailModalStatus,
      emailTemplates,
      emailList,
      initialEmail,
      validatedEmail,
      searchResult,
      initialSearchResult,
      validatedSearchResult,
      dispatch,
      onOk(data) {
        dispatch({
          type: 'jobApplication/sendEmail',
          payload: {
            data,
          }
        });


        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyInitialSearchResult();
        handleEmptyInitialEmail();
        handleEmptyValidatedEmail();
      },

      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'emailModal'
          }
        });

        handleEmptySearchResult();
        handleEmptyEmailList();
        handleEmptyInitialSearchResult();
        handleEmptyInitialEmail();
        handleEmptyValidatedEmail();
      }
    };
    const interviewModalProps = {
      interviewModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/createInterview',
          payload: data
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'interviewModal'
          }
        });
      }
    };
    const appointSignModalProps = {
      ApplicantPositionDetail,
      applicantProfiles,
      appointSignModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/appointSign',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'appointSignModal'
          }
        });
      },
      showModal(modalType, time) {
        dispatch({
          type: 'jobApplication/showModal',
          payload: {
            'modalType': modalType,
            signTime: time,
          }
        });
      }
    };
    const contractModalProps = {
      contractModalStatus,
      agreement_files,
      onOk(data) {
        dispatch({
          type: 'jobApplication/createContract',
          payload: {
            formFields: data,
          },
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'contractModal'
          }
        });
      }
    };
    const signModalProps = {
      signModalStatus,
      onOk(data) {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: { data: data }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'signModal'
          }
        });
      }
    };
    const smsModalProps = {
      smsTemplates,
      applicantProfiles,
      smsModalStatus,
      smsModalToPeopleType,
      onChangeSmsModalToPeopleType(e) {
        var type = e.target.value;
        dispatch({
          type: 'jobApplication/setSmsModalToPeopleType',
          payload: {
            type: type
          }
        });
      },
      onOk(data) {
        dispatch({
          type: 'jobApplication/sendSms',
          payload: {
            data: data
          }
        });
      },
      onCancel() {
        dispatch({
          type: 'jobApplication/hideModal',
          payload: {
            'modalType': 'smsModal'
          }
        });
      }
    };


    return (
      <div className={style.jobSpin}>
        <Spin spinning={applicantLoading}>
          <div className={style.jobApplicationContainer}>
            <section className={style.container}>
              <Row>
                <Col md={24}>
                  {applicantProfiles != null && ApplicantPositionDetail != null ?
                    <div>

                      <AppointInterviewModal {...appointInterviewModalProps} />
                      <ScheduleModal {...scheduleModalProps} />
                      <InterviewModal {...interviewModalProps} />
                      <SignModal {...signModalProps} />
                      <SmsModal {...smsModalProps} />
                      <EmailModal {...emailModalProps} />
                      <ContractModal {...contractModalProps} />

                      {allApplicantPositionDetailStatuses.length > 0 ?
                        <JobOptions {...jobOptionsProps} /> : null
                      }

                      <AppointSignModal {...appointSignModalProps} />
                      <AlterInterviewModal {...alterInterviewModalProps} />
                      <ConfirmCancelInterviewModal {...confirmCancelInterviewModalProps} />
                      <FinishInterviewModal {...finishInterviewModalProps} />
                      <AlterInterviewResultModal  {...alterInterviewResultModalProps} />
                      <AlterSignModal {...alterSignModalProps} />
                      <ConfirmCancelSignModal {...confirmCancelSignModalProps} />
                    </div>
                    : null
                  }
                </Col>
              </Row>
              <div className={style.content}>
                <Row>
                  <Col md={24}>
                    <Tabs>
                      <TabPane tab="歷史紀錄" key="1">
                        {applicantProfiles == null && ApplicantPositionDetail == null ? null :
                          <InterviewLogs {...interviewLogsProps} />
                        }
                      </TabPane>
                      <TabPane tab="面試／簽約" key="2">
                        {applicantProfiles == null && ApplicantPositionDetail == null ? null :
                          <InterviewOrSign {...interviewOrSignProps} />
                        }
                      </TabPane>
                      <TabPane tab={`合約 (${contractCount})`} key="3">
                        {applicantProfiles == null && ApplicantPositionDetail == null ? null :
                          <Contract {...contractProps} />
                        }
                      </TabPane>
                    </Tabs>
                  </Col>
                </Row>
              </div>
            </section>
          </div>
        </Spin>

      </div>
    );
  }


}
function mapStateToProps({ jobApplication, newApplicantProfile, currentUser, region }) {
  return {
    jobApplication,
    newApplicantProfile,
    currentUser,
    region,
  }
}
export default connect(mapStateToProps)(JobApplication);
