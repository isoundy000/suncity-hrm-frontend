import React from 'react';
import { Modal, Form, Input } from 'antd';
import SunCityAPISelect from 'components/SunCityAPISelect';
import _ from 'lodash';

const FormItem = Form.Item;

class JobForm extends React.Component {
  createFromItem(label, content, name, options={}) {
    options = _.merge(options, {
      rules: [
        {
          required: true,
          message: `請填寫 ${label}`,
          pattern: /.+/
        }
      ]
    });

    return {
      label,
      content,
      name,
      options: {
        ...options,
        ...this.getFieldOptions(name)
      }
    }
  }

  getFieldInitialValue(field) {
    if(!this.props.job){
      return null;
    }else{
      return this.props.job[field];
    }
  }

  getFieldOptions(field){
    return {
      initialValue: this.getFieldInitialValue(field)
    };
  }

  formLabelAndContent() {
    const createFromItem = ::this.createFromItem;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
    };

    return [
      createFromItem(
        '所屬部門',
        <SunCityAPISelect
          type="departments"
          valueField="id"
        />,
        'department_id',
        {
          type: 'number'
        }
      ),
      createFromItem(
        '職位',
        <SunCityAPISelect
          type="positions"
          valueField="id"
        />,
        'position_id',
        {
          type: 'number'
        }
      ),
      createFromItem(
        '職級',
        <SunCityAPISelect
          type="grade"
          valueField="id"
        />,
        'grade',
        {initialValue: 6}
      ),
      createFromItem(
        '應有人數',
        <Input placeholder="應有人數" />,
        'number',
        {
          type: 'number'
        }
      ),
      createFromItem(
        '工作範圍(中文)',
        <Input placeholder="工作範圍（中文）" type="textarea" style={{height: '100px'}}/>,
        'chinese_range'
      ),
      createFromItem(
        '工作範圍（英文）',
        <Input placeholder="工作範圍（英文）" type="textarea" style={{height: '100px'}}/>,
        'english_range'
      ),
      createFromItem(
        '技能要求及工作經驗（中文）',
        <Input placeholder="技能要求及工作經驗（中文）" type="textarea" style={{height: '100px'}}/>,
        'chinese_skill'
      ),
      createFromItem(
        '技能要求及工作經驗（英文）',
        <Input placeholder="技能要求及工作經驗（英文）" type="textarea" style={{height: '100px'}}/>,
        'english_skill'
      ),
      createFromItem(
        '學歷要求（中文）',
        <Input placeholder="學歷要求（中文）" type="textarea" style={{height: '100px'}}/>,
        'chinese_education'
      ),
      createFromItem(
        '學歷要求（英文）',
        <Input placeholder="學歷要求（英文）" type="textarea" style={{height: '100px'}}/>,
        'english_education'
      ),

    ].map(item => {
      return (
        <FormItem
          {...formItemLayout}
          key={item.label}
          label={item.label}
        >
          {getFieldDecorator(item.name, item.options)(item.content)}
        </FormItem>
      );
    });
  }

  render() {
    return (
      <Form
        horizontal
      >
        {this.formLabelAndContent()}
      </Form>
    );
  }
}

export default JobForm;
