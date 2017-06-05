import React, { PropTypes, Component } from 'react';
import MaskedInput from 'react-text-mask';
import { Input } from 'antd';

import classNames from 'classnames';
import classes from './index.less';

export default class DateEditable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      pastValue: props.value,
      value: props.value,
    };

    [
      'handleFocus',
      'handleBlur',
      'handleSubmit',
      'handleCancel',
      'handleChange',
      'handleClickDocument',
      'handleClickInput',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleFocus() {
    this.setState({
      isEditing: true,
    });
  }

  handleBlur(e) {
    if (!this.btns.contains(e.relatedTarget) && this.state.isEditing) {
      this.handleCancel();
    }
  }

  handleSubmit() {
    const {value} = this.state;
    this.props.onSave(value); // FIXME async
    this.setState({
      isEditing: false,
      pastValue: value,
    }, () => {
      this.input.inputElement.blur()
    });
  }

  handleCancel() {
    this.setState({
      isEditing: false,
      value: this.state.pastValue,
    });
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  handleClickDocument(e) {
    if (!this.btns.contains(e.target)) {
      this.handleCancel();
    }
  }

  handleClickInput(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    if (!this.props.disabled) {
      document.addEventListener('click', this.handleClickDocument, false);
      this.input.inputElement.addEventListener('click', this.handleClickInput, false);
    }
  }

  componentWillUnmount() {
    if (!this.props.disabled) {
      document.removeEventListener('click', this.handleClickDocument, false);
      this.input.inputElement.removeEventListener('click', this.handleClickInput, false);
    }
  }

  renderDisabled() {
    const {isEditing, value} = this.state;

    return <Input disabled={true} value={value} />
  }

  renderInput() {
    const {isEditing, value} = this.state;

    return (
      <div>
        <MaskedInput
          className={classNames('y-form-control', classes.yInput)}
          type="text"
          value={value}
          mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
          placeholderChar={'\u2000'}
          ref={c => this.input = c}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={(e) =>{
            if(e.keyCode == 13){
              this.handleSubmit();
            }
          }}
        />

        <div
          className={classNames(classes.btnGroup, {
              // FIXME: state.value !== props.value, props.value不会更新
              [classes.active]: isEditing, // && value !== this.props.value,
            })}
          ref={c => this.btns = c}
        >
          <button className={classes.btnSubmit} type="button" onClick={this.handleSubmit}/>
          <button className={classes.btnCancel} type="button" onClick={this.handleCancel}/>
        </div>
      </div>
    );
  }

  render() {
    let body = '';
    if (this.props.disabled) {
      body = this.renderDisabled();
    } else {
      body = this.renderInput();
    }

    return (
      <div className={classes.wrapper}>
        {body}
      </div>
    );
  }
}

DateEditable.propTypes = {
  onSave: PropTypes.func.isRequired,
  value: PropTypes.string,
};
