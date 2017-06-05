import React, {PropTypes} from 'react';
import {Card, Button, Modal} from 'antd';
import styles from '../jobApplication.less';

import {HOST} from 'constants/APIConstants';

import {injectIntl} from 'react-intl';
import {definedMessages as messages} from '../../../locales/messages';

import classNames from 'classnames';


/* const InputGroup = Input.Group; */

import word from '../assets/word.png';
import people from '../assets/people.png';
import wait from '../assets/wait.png';

import DeleteContractModal from '../Modals/deleteContractModal';

function Contract({...props}) {
  const {formatMessage} = props.intl;
  const {contractList, deleteContractModalVisible, dispatch, currentUser, region, readonly} = props;
  console.log(currentUser);

  const exportButton = formatMessage(messages['app.job_application.contract.export_button']);
  const operator = formatMessage(messages['app.job_application.contract.operator']);
  const createdAt = formatMessage(messages['app.job_application.contract.created_at']);


  const downloadContractFile = (contract_id, applicant_position_id)=> {
    dispatch({
      type: 'jobApplication/downloadContractFile',
      payload: {
        contract_id: contract_id,
        applicant_position_id: applicant_position_id
      }
    });
  }

  const cardTitle = (titleDetail) => {
    return (
      <div className={styles.cardTitle}>
        <img alt="contractIcon" src={word}/>
        <span className={styles.detail}>{titleDetail}</span>
      </div>
    );
  }

  const preFillWith = (str, chr, len) => {
    const tmpStr = new Array(len).join(chr).concat(str);
    return tmpStr.substring(tmpStr.length - len);
  }

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();

    const month = preFillWith(date.getMonth() + 1, '0', 2);
    const day = preFillWith(date.getDate(), '0', 2);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  return (
    <div className={styles.contractCards}>

      {
        contractList.map((contract, index) => {
          const formatTime = formatCreatedAt(contract.created_at);

          const id = contract.id;
          const applicantPositionId = contract.applicant_position_id;
          const downloadUrl = `${HOST}/applicant_positions/${applicantPositionId}/agreement_files/${id}/download`
          const creator = contract.creator;
          const title = contract.title;

          return (
            <Card title={cardTitle(title)} className={styles.card} key={index}>

              <div className={styles.creator}>
                <img alt="creatorIcon" src={people}/>
                <span>{operator}：{creator.chinese_name}</span>
              </div>

              <div className={styles.time}>
                <img alt="timeIcon" src={wait}/>
                <span>{createdAt}：{formatTime}</span>
              </div>

              <div className={classNames({ 'shouldNotShow':readonly })}>

              <div className={styles.buttonGroup}>
                <span
                  className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                             currentUser.can.destroyAgreementFileInMACAU !== true)
                                                         || (region === 'manila' &&
                                                             currentUser.can.destroyAgreementFileInMANILA !== true)) })}
                >
                  <DeleteContractModal
                    id={contract.id}
                    title={contract.title}
                    applicantPositionId={contract.applicant_position_id}
                    modalVisible={deleteContractModalVisible}
                    dispatch={dispatch}
                  />
                </span>

                <span
                  className={classNames({ 'shouldNotShow': ((region === 'macau' &&
                                                             currentUser.can.downloadAgreementFileInMACAU !== true)
                                                         || (region === 'manila' &&
                                                             currentUser.can.downloadAgreementFileInMANILA !== true)) })}
                >
                  <Button onClick={()=>downloadContractFile(id, applicantPositionId)} className={styles.exportBtn}>
                    <span>
                      {exportButton}
                    </span>
                  </Button>
                </span>
              </div>

              </div>
            </Card>
          );
        })
      }

    </div>
  );
}

Contract.propTypes = {
  contractList: PropTypes.array.isRequired,
  deleteContractModalVisible: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(Contract);
