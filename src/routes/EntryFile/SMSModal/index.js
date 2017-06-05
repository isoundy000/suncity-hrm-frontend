import React, { PropTypes, Component } from "react";
import { Spin, Modal, Button, Form, Input, Row, Col } from "antd";
import styles from "./index.less";
import { injectIntl } from "react-intl";
import { definedMessages as messages } from "../../../locales/messages";

const createForm = Form.create;
const FormItem = Form.Item;

class SMSModal extends Component {

  render() {
    const { entryFile, dispatch, record } = this.props;
    var props = this.props;
    const { formatMessage } = props.intl;
    const okText = formatMessage(messages['app.global.ok']);
    const cancelText = formatMessage(messages['app.global.cancel']);

    let mobileNumber = null;
    if (entryFile.profile != null) {
      const person_info = entryFile.profile.sections.find(section => section.key === 'personal_information');
      mobileNumber = person_info.fields.find(field => field.key === 'mobile_number').value;
    }

    const { getFieldDecorator, setFieldsValue } = props.form;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    const handleOnClick = () => {
      props.form.setFieldsValue({});
      dispatch({
        type: 'entryFile/fetchProfile',
        payload: {
          id: record.id,
        }
      })
      dispatch({
        type: 'entryFile/setSmsTemplate',
        payload: {
          havedTypes: record.filled_attachment_types,
          record: record
        }
      })

      dispatch({
        type: 'entryFile/toggleModal',
        payload: {
          id: record.id,
        },
      });
    }

    const handleOk = () => {
      props.form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }

        let formFields = props.form.getFieldsValue();

        formFields = Object.assign({}, formFields, {
          id: record.id,
        });

        dispatch({
          type: 'entryFile/sendSMS',
          payload: {
            id: record.id,
            patchData: formFields,
            record: record,
          },
        });

        dispatch({
          type: 'entryFile/toggleModal',
          payload: {
            id: -1,
          },
        });
      });
    }

    const handleCancel = () => {
      props.form.resetFields();
      dispatch({
        type: 'entryFile/toggleModal',
        payload: {
          id: -1,
        },
      });
    }

    return (
      <div className={styles.smsButton}>
        <Button onClick={handleOnClick}>SMS</Button>

        <Modal
          title='發送SMS'
          visible={record.id === entryFile.smsModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={okText}
          cancelText={cancelText}
          wrapClassName={styles.verticalCenterModal}
        >

          <div>
            <div className={styles.infos}>
              <Row>
                <Col span={5}>中文姓名: </Col>
                <Col span={6}>{record.chinese_name}</Col>
                <Col span={5} offset={2}>英文姓名: </Col>
                <Col span={6}>{record.english_name}</Col>
              </Row>
            </div>

            <Form horizontal form={props.form}>
              <div className={styles.formBody}>
                <FormItem
                  {...formItemLayout}
                  label='流動電話'
                >
                  <Spin spinning={entryFile.profile != null ? false : true}>
                    {getFieldDecorator('mobile', { initialValue: mobileNumber })(
                      <Input autoComplete="off"/>
                    )}
                  </Spin>
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label='SMS內容'
                >
                  {getFieldDecorator('sms', { initialValue: entryFile.smsTemplate })(
                    <Input type="textarea" rows={5} autoComplete="off"/>
                  )}
                </FormItem>
              </div>
            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}

SMSModal.propTypes = {};

SMSModal = createForm()(SMSModal);

/* const mapStateToProps = ({ entryFile }) => ({
 entryFile,
 });
 */
export default injectIntl(SMSModal);
/* export default connect(mapStateToProps)(injectIntl(SMSModal)); */
