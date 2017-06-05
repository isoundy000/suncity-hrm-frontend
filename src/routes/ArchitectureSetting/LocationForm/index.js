import React, { PropTypes } from 'react';
import { Form, Input, Select } from 'antd';
import style from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const FormItem = Form.Item;
const Option = Select.Option;

function LocationForm({ ...props }) {
  const { getFieldProps, getFieldError, isFieldValidating } = props.form;
  const { formatMessage } = props.intl;
  const form = props.form;

  const locationChineseName = formatMessage(messages['app.arch.form.location_chinese_name']);
  const locationEnglishName = formatMessage(messages['app.arch.form.location_english_name']);
  const supLocation = formatMessage(messages['app.arch.form.sup_location']);
  const noSupLocation = formatMessage(messages['app.arch.form.no_sup_location']);
  const pleaseChooseLocation = formatMessage(messages['app.arch.form.please_choose_location']);

  const chineseNameProps = getFieldProps('chinese_name', {
    rules: [
      { required: true, min: 1, message: '場館名不可爲空' },
    ],
  });

  const englishNameProps = getFieldProps('english_name', {
    rules: [
      { required: true, min: 1, message: '場館名不可爲空' },
    ],
  });

  return (
    <Form horizontal form={form} >
      <FormItem
        id="control-input"
        label={locationChineseName}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        hasFeedback
        help={isFieldValidating('chinese_name') ?
              '校验中...' : (getFieldError('chinese_name') || []).join(', ')}
      >
        <Input {...chineseNameProps} id="control-input" />
      </FormItem>

      <FormItem
        id="control-textarea"
        label={locationEnglishName}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        hasFeedback
        help={isFieldValidating('english_name') ?
              '校验中...' : (getFieldError('english_name') || []).join(', ')}
      >
        <Input {...englishNameProps} id="control-input" />
      </FormItem>
    </Form>
  );
}

LocationForm.propTypes = {
  form: PropTypes.object.isRequired,
};

export default injectIntl(LocationForm);
