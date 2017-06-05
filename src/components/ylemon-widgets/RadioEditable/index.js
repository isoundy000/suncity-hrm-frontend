import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import { Radio } from 'antd';
import { getLocaleText } from 'locales/messages';

import classNames from 'classnames';
import classes from './index.less';

class RadioEditable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      pastValue: props.value,
      value: props.value,
    };

    [
      'handleChange',
      'handleSubmit',
      'handleCancel',
      'handleClickDocument',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleChange(e) {
    if (this.state.pastValue === e.target.value) return;

    this.setState({
      isEditing: true,
      value: e.target.value,
    });
  }

  handleSubmit() {
    const {value} = this.state;

    this.props.onSave(value); // FIXME: async
    this.setState({
      isEditing: false,
      pastValue: value,
    });
  }

  handleCancel() {
    this.setState({
      isEditing: false,
      value: this.state.pastValue,
    });
  }

  handleClickDocument(e) {
    const target = e.target;
    const radioWrapper = target;

    if (this.btns.contains(target) ||
      // FIXME
      target.classList.contains('ant-radio-input')) {
      return;
    }

    this.handleCancel();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickDocument, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickDocument, false);
  }

  render() {
    const {isEditing, value} = this.state;

    return (
      <div className={classes.radioWrapper}>
        <Radio.Group
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.props.disabled}
        >
          {
            this.props.options.map((option, index) => (
              <Radio key={`${option.key}`} value={`${option.key}`}>
                <span>{getLocaleText(option, this.props.locale)}</span>
                <div
                  className={
                    classNames(classes.btnGroup, {
                      // 必须是在编辑状态下, 并且`option`的值等于`onChange`之后`state`中的值
                      [classes.active]: (isEditing && value === `${option.key}`)
                    })
                  }
                  ref={c => this.btns = c}
                >
                  <button className={classes.btnSubmit} type="button" onClick={this.handleSubmit}/>
                  <button className={classes.btnCancel} type="button" onClick={this.handleCancel}/>
                </div>
              </Radio>
            ))
          }
        </Radio.Group>
      </div>
    );
  }
}

RadioEditable.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onSave: PropTypes.func.isRequired,
};

export default injectIntl(RadioEditable);
