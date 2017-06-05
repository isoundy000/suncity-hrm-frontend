import React, { PropTypes } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Button, Form, Input, Modal } from 'antd';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;

function AgreeInterviewForScreeningModal({ myRecruit, dispatch, cardData, ...props }) {
  const { formatMessage } = props.intl;

  const sureToChooseText = formatMessage(messages['app.my_recruit.card_modal.sure_to_choose']);
  const suggestTimeText = formatMessage(messages['app.my_recruit.card_modal.suggest_time']);
  const agreeText = formatMessage(messages['app.my_recruit.card_modal.agree_choose']);
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

  const modalType = 'agreeInterviewForScreeningModal';

  const handleOnClick = () => {
    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: cardData.id,
        type: modalType,
      },
    });

    /* dispatch({ */
    /* type: 'myRecruit/fetchEmailTemplates', */
    /* payload: { */
    /* audienceId: cardData.id, */
    /* type: 'audienceAgreed', */
    /* applicantPositionId: cardData.applicant_position_id, */
    /* }, */
    /* }); */
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
      status: 'agreed',
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
        status: 'choose_succeed',
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
    <div className={styles.agreeButton} >
      <Button onClick={handleOnClick}>{agreeText}</Button>

      <Modal
        title={sureToChooseText}
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
                 placeholder={suggestTimeText}
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

AgreeInterviewForScreeningModal.propTypes = {
  cardData: React.PropTypes.object.isRequired,
};

AgreeInterviewForScreeningModal = createForm()(AgreeInterviewForScreeningModal);

const mapStateToProps = ({ myRecruit }) => ({
  myRecruit,
});

export default connect(mapStateToProps)(injectIntl(AgreeInterviewForScreeningModal));
