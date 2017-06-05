import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Input, Radio, Upload, Button, Icon } from 'antd';

import MaskedInput from 'react-text-mask';
import YSelect from 'components/ylemon-widgets/YSelect';
import { YLemonFieldTextWithoutIntl } from 'components/ylemon-widgets/YLemonFieldText';
import { getLocaleText } from 'locales/messages';
import { LOCALE } from 'constants/GlobalConstants';

import { AVATAR_UPLOAD_URL } from 'constants/APIConstants';
import classes from './index.less';

class Field extends Component {

  constructor(props) {
    super(props);
    const defaultValue = props.resetValue ? props.resetValue : props.field.default;
    this.state = {
      fieldValue: defaultValue,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fieldValue: nextProps.resetValue,
    });
  }

  render() {

    const {
      intl,
      field,
      schema,
    } = this.props;

    const { fieldValue } = this.state;

    const onChange = value => {
      this.props.onChange(value);
      this.setState({
        fieldValue: value,
      });
    };

    const renderText = () => (
      <Input
        value={fieldValue}
        onChange={e => onChange(e.target.value)}
      />
    );

    const renderRadio = () => {
      return (
        <Radio.Group
          value={`${fieldValue}`}
          onChange={e => onChange(e.target.value)}
          defaultValue={`${fieldValue}`}
        >
          {
            field.select.options.map(option => (
              <Radio key={`${option.key}`} value={`${option.key}`}>
                {getLocaleText(option, intl.locale)}
              </Radio>
            ))
          }
        </Radio.Group>
      )
    };

    const renderDate = () => (
      <MaskedInput
        type="text"
        className="y-form-control"
        value={_.isEmpty(fieldValue) ? '' : fieldValue}
        mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
        placeholderChar={'\u2000'}
        onChange={e => onChange(e.target.value)}
        disabled={this.props.disabled}
      />
    );

    const renderDateWithoutDay = () => (
      <MaskedInput
        type="text"
        className="y-form-control"
        value={_.isEmpty(fieldValue) ? '' : fieldValue}
        mask={[/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        onChange={e => onChange(e.target.value)}
      />
    );

    const renderSelect = () => (
      <YSelect
        value={fieldValue}
        select={field.select}
        onChange={onChange}
      />
    );

    const renderImage = () => {
      const imageOnChange = info => {
        if (info.file.status === 'done') {
          onChange(info.file.response.data.path);
        }
      };

      return (
        <Upload
          action={AVATAR_UPLOAD_URL}
          onChange={imageOnChange}
        >
          <Button type="ghost"><Icon type="upload" />上傳頭像</Button>
        </Upload>
      );
    };

    const renderAlias = () => {
      return <span></span>;
    };

    switch (field.type) {
      case 'image':
        return renderImage();

      case 'string':
      case 'number':
      default:
        return renderText();

      case 'radio':
        return renderRadio();

      case 'date':
        return renderDate();
      case 'date_without_day':
        return renderDateWithoutDay();

      case 'select':
        return renderSelect();

      case 'alias':
        return renderAlias();
    }
  }
}

Field.propTypes = {
  field: PropTypes.object.isRequired,
  fieldValue: PropTypes.any,
  resetValue: PropTypes.any,
  schema: PropTypes.array,
  data: PropTypes.object,
  onChange: PropTypes.func.isRequired, // 这里的`onChange`只接受`value`一个参数
};

export default injectIntl(Field);
