/**
 * Created by meng on 16/9/4.
 */

import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Spin } from 'antd';

import { getLocaleText } from 'locales/messages';
import { HOST as BASE_URL } from 'constants/APIConstants';
import { getEndpoint } from 'services/endpoints';

import defaultHead from 'components/ylemon-widgets/assets/765-default-avatar.png';
import YLemonImage from '../YLemonImage';

class YLemonFieldText extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: (props.field.select && props.field.select.options !== undefined) ?
        props.field.select.options : [],
      optionsLoadingFinished: false,
    }
  }

  isApiSelect() {
    const { field } = this.props;
    return field.type === 'select' && field.select.endpoint;
  }

  needLoadingOptionsFromApi() {
    const { disableLoadingOptions } = this.props;
    return this.isApiSelect() && !disableLoadingOptions;
  }

  componentDidMount() {
    const { field } = this.props;
    if (this.needLoadingOptionsFromApi()) {
      const that = this;
      (async function() {
        const { data, err } = await getEndpoint(field.select.endpoint, that.context.region);
        if (data) {
          that.setState({
            options: data.data,
            optionsLoadingFinished: true
          });
        }

        // TODO: handle err
      })();
    }
  }

  render() {
    const field = this.props.field;
    switch (field.type) {
      case 'image':
        return this.renderImage(field);
      case 'select':
        return this.renderSelect(field);
      case 'radio':
        return this.renderRadio(field);
      case 'object':
        return this.renderObject(field);
      case 'date':
      case 'string':
      case 'number':
      default:
        return this.renderText(field);
    }
  }

  renderObject(field) {
    let text = field.value.english_name;
    if(this.context.lang == 'zh-TW'){
      text = field.value.chinese_name;
    }

    return this.renderSpan(text);
  }

  renderImage(field) {
    const urlRegex = new RegExp('https?');
    const url = field.value;
    const imgURL = url ? (url.match(urlRegex) ? url : `${BASE_URL}${url}`) : defaultHead;
    return <YLemonImage
             imgURL={imgURL}
             className={this.props.className}
           />;
  }

  renderSelect(field) {
    if (this.needLoadingOptionsFromApi() && !this.state.optionsLoadingFinished) {
      return (
        <span className={this.props.className}>
          <Spin size="small" />
        </span>
      )
    }

    return this.renderRadio(field);
  }

  renderRadio(field) {
    const option = this.state.options.find(opt => opt.key == field.value);

    console.log('^^^^^^^^^^^^', field.key);

    if (option) {
      console.log('^^^^^^^^^^^^', field.key);
      if (field.key === 'position') {
        // NOTE: 特殊处理职位信息
        const positionText = getLocaleText(option, this.props.intl.locale);

        return (
          <span className={this.props.className}>
            {positionText.replace(/^\d+\s+/, '')}
          </span>
        );
      } else {
        return (
          <span className={this.props.className}>
            {getLocaleText(option, this.props.intl.locale)}
          </span>
        );
      }
    } else {
      if (field.value === 'true') {
        return <span className={this.props.className}>是</span>
      } else if (field.value === 'false') {
        return <span className={this.props.className}>否</span>
      }
      return <span className={this.props.className}>{field.value}</span>
    }
  }

  renderText(field) {

    return this.renderSpan(field.value);
  }

  renderSpan(value){
    return <span className={this.props.className}>{value}</span>
  }
}

YLemonFieldText.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
};

YLemonFieldText.contextTypes = {
  region: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
}

export const YLemonFieldTextWithoutIntl = YLemonFieldText;

export default injectIntl(YLemonFieldText);
