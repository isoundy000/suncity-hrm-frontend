import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';

import styles from '../jobApplication.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

/* let trueId; */

function DeleteContractModal({ id, title, applicantPositionId, modalVisible, dispatch, ...props }) {
  const { formatMessage } = props.intl;
  const deleteButton = formatMessage(messages['app.job_application.contract.delete_button']);
  const modalTitle = formatMessage(messages['app.job_application.contract.modal_title']);
  const modalContent = formatMessage(messages['app.job_application.contract.modal_content']);
  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);

  const handleOnClick = () => {
    /* trueId = id; */

    dispatch({
      type: 'jobApplication/toggleDeleteContractModal',
      payload: {
        id,
        /* status: true, */
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'jobApplication/toggleDeleteContractModal',
      payload: {
        id: -1,
        /* status: false, */
      },
    });
  };

  const handleOk = () => {
    dispatch({
      type: 'jobApplication/deleteContract',
      payload: {
        id,
        applicantPositionId,
        /* id: trueId, */
      },
    });

    dispatch({
      type: 'jobApplication/toggleDeleteContractModal',
      payload: {
        id: -1,
        /* status: false, */
      },
    });
  };

  return (
    <span>
      <Button
        onClick={handleOnClick}
        className={styles.deleteBtn}
      >
        <span>{deleteButton}</span>
      </Button>

      <Modal
        title={modalTitle}
        wrapClassName={styles.verticalCenterModal}
        visible={id === modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
      >

        <div>{`${modalContent}: ${title}`}</div>

      </Modal>

    </span>
  );
}

DeleteContractModal.propTypes = {
  id: PropTypes.number.isRequired,
  modalVisible: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(DeleteContractModal);
