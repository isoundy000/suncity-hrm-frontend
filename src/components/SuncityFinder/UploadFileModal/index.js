import React, { PropTypes } from 'react';
import { Modal, Upload, Icon, message, Form, Input, Select, Spin } from 'antd';
import { FILE_UPLOAD_URL } from 'constants/APIConstants';
import _ from 'lodash';
import classNames from 'classnames';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;

import classes from './index.less';

class UploadFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFileId: null,
      uploadedFileName: null,
      uploading: false,
      uploaded: false,
      uploadWarnning: false,
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal
        okText="確認"
        visible={this.props.showModal}
        title="上傳文件"
        onCancel={() => {
          this.setState({
            uploadedFileId: null,
            uploadedFileName: null,
            uploading: false,
            uploaded: false,
          });
          this.props.onCloseModal();
        }}
        onOk={() => {
          this.props.form.validateFields((err, values) => {
            if (this.state.uploaded) {
              if(!err) {
                this.props.onSubmit({
                  ...values,
                  uploadedFileId: this.state.uploadedFileId
                });
              }
            } else {
              {/* message.warning('請上傳文件'); */}
              this.setState({
                uploadWarnning: true,
              });
            }
          });
          }}
      >
        <div style={{ marginTop: 16, height: 180 }}>
          <Spin tip="uploading" spinning={this.state.uploading}>
            <Dragger
              action={FILE_UPLOAD_URL}
              onChange={(info) => {
                  if (info.file.status === 'done') {
                    const response = info.file.response.data;
                    this.setState({
                      uploadedFileId: response.id,
                      uploadedFileName: response.file_name,
                      uploading: false,
                      uploaded: true,
                      uploadWarnning: false,
                    });

                    const { fileName } = this.props.form.getFieldsValue();
                    if(!fileName) {
                      this.props.form.setFieldsValue({
                        fileName: response.file_name
                      });
                    }
                  }

                  if(info.file.status == 'uploading') {
                    this.setState({
                      uploading: true
                    });
                  }

                  if (info.file.status == 'error') {
                    this.setState({
                      uploading: false,
                    });
                  }
                }}
              showUploadList={false}
            >
              <div className={classes.uploadTips}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">點擊或將文件拖拽到這裏上傳</p>
                <p className="ant-upload-hint">支持擴展名：.rar .zip .doc .docx .pdf .jpg...</p>
                {
                  (!this.state.uploading && this.state.uploadedFileName)
                  ? <p className="ant-upload-hint">已上传{this.state.uploadedFileName}</p>
                  : null
              }
            </div>


            </Dragger>
          </Spin>
          {
            this.state.uploadWarnning === true ?
            <div className={classes.uploadWarnning}>請上傳文件</div> : null
          }
        </div>

        <Form horizontal>
          <FormItem
            {...formItemLayout}
            label="文件名"
          >
            {getFieldDecorator('fileName', {
              rules: [{
                required: true,
                message: "請填寫文件名",
              }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="類別"
          >
            {getFieldDecorator('categoryId', {
              initialValue: _.get(this.props.currentCategory, 'id', null) ? `${this.props.currentCategory.id}` : null,
              rules: [{
                required: true,
                message: "請選擇文件類別",
              }],
            })(
              <Select>
                {
                  this.props.categories.map(category => (
                    <Select.Option
                      value={`${category.id}`}
                      key={category.id}
                    >
                      {category.chinese_name}
                    </Select.Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="備註"
          >
            {getFieldDecorator('comment')(
              <Input type="textarea"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

UploadFileModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default Form.create()(UploadFileModal);
