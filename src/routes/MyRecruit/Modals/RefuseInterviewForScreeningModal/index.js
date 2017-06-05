import React, { PropTypes } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Button, Form, Input, Modal } from 'antd';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

function RefuseInterviewForScreeningModal({ myRecruit, dispatch, cardData, ...props }) {
  const { formatMessage } = props.intl;

  const chooseRefusedText = formatMessage(messages['app.my_recruit.tag_card.choose_refused']);

  const refuseChooseText = formatMessage(messages['app.my_recruit.card_modal.refuse_choose']);
  const refuseReasonText = formatMessage(messages['app.my_recruit.card_modal.refuse_reason']);

  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const remarkText = formatMessage(messages['app.global.remark']);

  const { getFieldDecorator, setFieldsValue } = props.form;

  const interviews = props.interviews;
  const currentInterview = interviews[interviews.length - 1];

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const modalType = 'refuseInterviewForScreeningModal';

  const handleOnClick = () => {
    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: cardData.id,
        type: modalType,
      },
    });

    dispatch({
      type: 'myRecruit/fetchEmailTemplates',
      payload: {
        audienceId: cardData.id,
        type: 'audienceRefused',
        applicantPositionId: cardData.applicant_position_id,
      },
    });
  };

  const handleCancel = () => {
    props.form.resetFields();
    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  };

  const handleOk = () => {
    let formFields = props.form.getFieldsValue();
    formFields = Object.assign({}, formFields, {
      status: 'rejected',
    });

    dispatch({
      type: 'myRecruit/updateStatus',
      payload: {
        patchData: formFields,
        applicantPositionId: cardData.applicant_position_id,
        id: cardData.id,
        type: props.content,
        hrEmail: cardData.creator.email,
        applicantProfileId: cardData.applicant_profile.id,
      },
    });

    dispatch({
      type: 'myRecruit/startUpdateSchedule',
      payload: {
        applicantPositionId: cardData.applicant_position_id,
        status: 'choose_failed',
      }
    });

    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });

    let body = document.getElementsByTagName('body')[0];
    body.style.cssText = "";
  };

  return (
    <div className={styles.refuseButton} >
      <Button onClick={handleOnClick}>{refuseChooseText}</Button>
      <Modal
        title={chooseRefusedText}
        wrapClassName={styles.verticalCenterModal}
        visible={cardData.id === myRecruit.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
      >

        <Form horizontal form={props.form}>
          <FormItem
            {...formItemLayout}
            label={remarkText}
          >
            {getFieldDecorator('comment', {})(
               <Input
                 placeholder={refuseReasonText}
                 type="textarea"
                 autoComplete="off"
               />
             )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

RefuseInterviewForScreeningModal.propTypes = {
  cardData: React.PropTypes.object.isRequired,
};

RefuseInterviewForScreeningModal = createForm()(RefuseInterviewForScreeningModal);

const mapStateToProps = ({ myRecruit }) => ({
  myRecruit,
});

export default connect(mapStateToProps)(injectIntl(RefuseInterviewForScreeningModal));
