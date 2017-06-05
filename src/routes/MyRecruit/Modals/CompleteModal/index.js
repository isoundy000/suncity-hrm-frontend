import React, { PropTypes } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Button, Form, Input, Select, Checkbox, Rate, Modal } from 'antd';

import InfoOfApplicant from '../InfoOfApplicant';
import InfoOfInterview from '../InfoOfInterview';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

function CompleteModal({ myRecruit, dispatch, content, cardData, nth, ...props }) {
  const { formatMessage } = props.intl;

  const interviewResultText = formatMessage(messages['app.my_recruit.card_content.interview_result']);
  const interviewScoreText = formatMessage(messages['app.my_recruit.card_content.interview_score']);
  const interviewEvaluationText = formatMessage(messages['app.my_recruit.card_content.interview_evaluation']);

  const completeText = formatMessage(messages['app.my_recruit.card_modal.complete_interview']);
  const needMoreText = formatMessage(messages['app.my_recruit.card_modal.need_more']);
  const pleaseChooseText = formatMessage(messages['app.my_recruit.card_modal.please_choose']);
  const fillInResultText = formatMessage(messages['app.my_recruit.card_modal.fill_in_result']);
  const absentText = formatMessage(messages['app.my_recruit.card_modal.absent']);
  const notSuitableText = formatMessage(messages['app.my_recruit.card_modal.not_suitable']);
  const passPt1Text = formatMessage(messages['app.my_recruit.card_modal.pass_pt1']);
  const passPt2Text = formatMessage(messages['app.my_recruit.card_modal.pass_pt2']);

  const okText = formatMessage(messages['app.global.ok']);
  const cancelText = formatMessage(messages['app.global.cancel']);
  const remarkText = formatMessage(messages['app.global.remark']);

  const { getFieldDecorator, setFieldsValue } = props.form;

  const interviews = props.interviews;
  const currentInterview = interviews.filter(interview => interview.id === cardData.interview_id)[0];
  const interviewersEmail = currentInterview.interviewer_users.map(user => user.email);

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const modalType = 'completeModal';

  const handleOk = () => {
    props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        /* console.log('Errors in form!!!'); */
        return;
      }

      let formFields = props.form.getFieldsValue();

      formFields = Object.assign({}, formFields, {
        /* time: currentInterview.time, */
        score: formFields.score * 2,
        /* interviewer_emails: interviewersEmail, */
        need_again: formFields.need_again === true ? 1 : 0,
      });

      /* console.log(formFields); */

      dispatch({
        type: 'myRecruit/updateInterview',
        payload: {
          applicantPositionId: currentInterview.applicant_position_id,
          id: currentInterview.id,
          patchData: formFields,
        },
      });

      dispatch({
        type: 'myRecruit/updateStatus',
        payload: {
          patchData: {
            status: 'interview_completed',
          },
          id: cardData.id,
          type: content,
        },
      });

      const { result } = formFields;

      const status = result === 'failed' ? 'discard' : `${nth}_interview_${result}`;

      dispatch({
        type: 'myRecruit/startUpdateSchedule',
        payload: {
          status,
          applicantPositionId: currentInterview.applicant_position_id,
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
    });
  }

  const handleCancel = () => {
    props.form.resetFields();
    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: -1,
        type: modalType,
      },
    });
  }

  const handleOnClick = () => {
    const result = (currentInterview.result !== 'needed' &&
                    currentInterview.result !== 'cancelled') ? currentInterview.result : null;

    props.form.setFieldsValue({
      evaluation: currentInterview.evaluation,
      need_again: currentInterview.need_again === 1,
      result: null,
      score: currentInterview.score / 2,
    });

    dispatch({
      type: 'myRecruit/toggleModal',
      payload: {
        id: cardData.id,
        type: modalType,
      },
    });
  }


  return (
    <div className={styles.completeButton} >
      <Button onClick={handleOnClick}>{completeText}</Button>
      <Modal
        title={fillInResultText}
        visible={cardData.id === myRecruit.modalVisible[modalType]}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
        wrapClassName={styles.completeModal}
      >

        <div>
          <InfoOfApplicant {...props} />

          <InfoOfInterview
            cardData={cardData}
            {...props}
          />

          <Form horizontal form={props.form}>
            <div className={styles.formTitle}>
              {interviewResultText}
            </div>

            <div className={styles.formBody}>

              <FormItem
                {...formItemLayout}
                label={interviewResultText}
              >
                {getFieldDecorator('result', {
                   rules: [{ required: true }]
                 })(
                   <Select
                     placeholder={pleaseChooseText}
                     styles={{ width: '100%' }}
                   >

                     <Option className={styles.option} value="absent">{absentText}</Option>
                     <Option className={styles.option} value="succeed">
                       {passPt1Text}{currentInterview.mark}
                     </Option>
                     <Option className={styles.option} value="failed">{notSuitableText}</Option>
                   </Select>
                 )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label={interviewScoreText}
              >
                {getFieldDecorator('score', {
                   rules: [{ required: true }]
                 })(
                   <Rate
                     allowHalf
                   />
                 )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={interviewEvaluationText}
              >
                {getFieldDecorator('evaluation', {
                   rules: [{ required: true }]
                 })(
                   <Input type="textarea" autoComplete="off" />
                 )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={needMoreText}
              >
                {getFieldDecorator('need_again', { valuePropName: 'checked' })(
                   <Checkbox />
                 )}
              </FormItem>
            </div>
          </Form>
        </div>

      </Modal>
    </div>
  );
}

CompleteModal.propTypes = {
};

CompleteModal = createForm()(CompleteModal);

const mapStateToProps = ({ myRecruit }) => ({
  myRecruit,
});

export default connect(mapStateToProps)(injectIntl(CompleteModal));
