import React, { Component, } from 'react';
import _ from 'lodash';
import classes from './index.less';
import { Icon, Form, Modal, Button, Input } from 'antd';
import YLemonTransfer from 'components/YLemonTransfer';
import { fieldsToColumns }  from 'helpers/profiles';
import { getAllSelectableColumns } from 'services/profiles';
import { Set, Map, List, OrderedSet } from 'immutable';

import editImage from 'components/SelectColumnsTemplate/assets/bianji.png';
import defaultImg from 'components/SelectColumnsTemplate/assets/moren.png';
import setDefaultImg from 'components/SelectColumnsTemplate/assets/sheweimoren.png';
import deleteImg from 'components/SelectColumnsTemplate/assets/shanchu.png';
const FormItem = Form.Item;

class ChangeColumnsModal extends Component {
  static defaultProps = {
    title: '添加項目',
    onChange: () => {},
    targetKeys: [],
    confirmButtonTitle: '保存',
  }

  constructor(props) {
    super(props);

    this.state = {
      targetKeys: props.targetKeys,
      dataSource: [],
      dataSourceReady: false,
      editingTemplate: props.editingTemplate,
      editingTemplateTitle: props.editingTemplate ? props.editingTemplate.name : null,
    };
  }

  componentWillMount() {
    this.requestAllFieldData();
  }

  requestAllFieldData() {
    getAllSelectableColumns(
      this.context.region,
      this.props.type
    ).then(json => {
      const fields = json.data.data;

      this.setState({
        dataSource: fieldsToColumns(fields),
        dataSourceReady: true
      }, () => {
        this.props.onChange(this.state);
      });
    });
  }

  handleUpDown({ id, up }) {
    const targetKeysList = List(this.state.targetKeys);

    const changeItemIndex = targetKeysList.findIndex((key) => {
      return key === id;
    });

    let newIndex = 0;
    if(up){
      newIndex = changeItemIndex - 1;
    }else{
      newIndex = changeItemIndex + 1;
    }

    const targetKeysListRemoveItem = targetKeysList.remove(changeItemIndex);
    const newTragetKeysList = targetKeysListRemoveItem.insert(newIndex, id);

    this.setState({
      targetKeys: newTragetKeysList.toArray()
    });
  }

  handleChange(targetKeys, direction, moveKeys) {
    let newTragetKeys = [];
    const targetKeysSet = OrderedSet(targetKeys);

    if(direction === 'left'){
      //sub moveKeys from targetKey
      newTragetKeys = targetKeysSet.subtract(moveKeys);
    }

    if(direction === 'right'){
      //merge moveKeys to targetKeys
      newTragetKeys = targetKeysSet.union(moveKeys);
    }

    this.setState({
      'targetKeys': newTragetKeys.toArray()
    });
  }

  handleSubmit () {
    if(this.onEditing()) {
      this.props.form.validateFields((error, value) => {
        if(error) {
          return;
        } else {
          this.setState({
            editingTemplateTitle: value.templateTitle
          }, () => {
            this.submit();
          })
        }
      });
    }else {
      this.submit();
    }
  }

  submit() {
    const newTableFields = this.state.dataSource.filter((field) => {
      if(this.state.targetKeys.indexOf(field.key) != -1){
        return true;
      }
    });

    this.props.handleSubmit({
      targetKeys: this.state.targetKeys,
      fields: newTableFields,
      title: this.state.editingTemplateTitle,
      editingTemplate: this.state.editingTemplate
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  onEditing() {
    return this.props.creatingNewTemplate || this.props.editingTemplate;
  }

  editingHeader() {
    if(!this.onEditing()){
      return null;
    }

    const deleteButton = (
      <div
        className={classes.deleteSec}
        onClick={this.props.handleDelete}
      >
        <img src={deleteImg}/>
        <span>刪除</span>
      </div>
    );

    const changeDefaultButton = (
        _.get(this.props.editingTemplate, 'default')?
        <div className={classes.defaultSec}>
          <img src={defaultImg}/>
          <span>已默認</span>
        </div>
        :
        <div
          className={classes.setDefault}
          onClick={this.props.handleSetDefault}
        >
            <img src={setDefaultImg}/>
            <span>設為默認</span>
        </div>
    );

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={classes.modalBodyHeader}>
        <div className={classes.nameSec}>
          <Form inline style={{width: '100px'}}>
            <FormItem
              label="模板名稱"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 5 }}
            >
              {getFieldDecorator('templateTitle', {
                 initialValue: this.state.editingTemplateTitle,
                 rules: [{ required: true, message: '請輸入模板名稱' }],
               })(
                 <Input
                   placeholder=""
                 />
               )}
            </FormItem>
          </Form>
        </div>

        <div className={classes.actionSec}>
          { this.props.editingTemplate? deleteButton : null }

          { this.props.editingTemplate? changeDefaultButton : null}
        </div>

      </div>
    );
  }

  render () {
    if(!this.state.dataSourceReady){
      return(
        null
      );
    }

    return (
      <Modal
        title={this.props.editingTemplate ? '編輯模版' : '新建模板'}
        className={classes.modalMain}
        visible={true}
        onCancel={::this.handleCancel}
        maskClosable={false}
        closable={true}
        footer={[
          <Button key="cancel" type="default" size="large"
                 onClick={::this.handleCancel}
         >
           取消
          </Button>,
          <Button
          key="submit"
          type="primary"
          size="large"
          onClick={::this.handleSubmit}
          disabled={this.state.targetKeys.length == 0}
                   >
                   {this.props.confirmButtonTitle}
          </Button>
        ]}
      >

          { this.editingHeader() }

          <p className={classes.modalTitle}>
            {this.props.title}
          </p>

          <YLemonTransfer
            dataSource={this.state.dataSource}
            targetKeys={this.state.targetKeys}
            onChange={::this.handleChange}
            handleUpDown={::this.handleUpDown}
            onEditing={this.onEditing()? true : false}
          />

      </Modal>
    );
  }
}

ChangeColumnsModal.contextTypes = {
  region: React.PropTypes.string
}

ChangeColumnsModal.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  confirmButtonTitle: React.PropTypes.string,
  handleUpDown: React.PropTypes.func,
  handleSetDefault: React.PropTypes.func,
  handleDelete: React.PropTypes.func,
  handleChange: React.PropTypes.func,
  onChange: React.PropTypes.func,
  targetKeys: React.PropTypes.array,
};

export default Form.create()(ChangeColumnsModal);
