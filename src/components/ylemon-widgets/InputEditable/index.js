import React, { PropTypes, Component } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import classes from './index.less';

export default class InputEditable extends Component {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);

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

  getStateFromProps(props) {
    return {
      isEditing: false,
      pastValue: props.value,
      value: props.value,
    };
  }

  componentWillReceiveProps(props) {
    // this.setState(this.getStateFromProps(props));
  }

  handleFocus() {
    this.setState({
      isEditing: true,
    });
  }

  handleBlur(e) {
    if (!this.btns.contains(e.relatedTarget)) {
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
      this.input.refs.input.blur();
    });
  }

  handleCancel() {
    this.setState({
      isEditing: false,
      value: this.state.pastValue,
    });
  }

  handleChange() {
    this.setState({
      value: this.input.refs.input.value,
    });
  }

  handleClickDocument(e) {
    if (!this.btns.contains(e.target) && this.state.isEditing) {
      this.handleCancel();
    }
  }

  handleClickInput(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickDocument, false);
    this.input.refs.input.addEventListener('click', this.handleClickInput, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickDocument, false);
    this.input.refs.input.removeEventListener('click', this.handleClickInput, false);
  }

  render() {
    const { isEditing, value } = this.state;

    return (
      <div className={classNames(classes.wrapper, this.props.className)}>
        <Input
          value={this.state.value}
          className={classes.yInput}
          disabled={this.props.disabled}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={c => this.input = c}
          onPressEnter={() => {
            this.handleSubmit()
          }}
        />

        <div
          className={classNames('editButtonGroup', classes.btnGroup, {
            // FIXME: state.value !== props.value, props.value不会更新
            [classes.active]: isEditing, // && value !== this.props.value,
          })}
          ref={c => this.btns = c}
        >
          <button className={classes.btnSubmit} type="button" onClick={this.handleSubmit} />
          <button className={classes.btnCancel} type="button" onClick={this.handleCancel} />
        </div>
      </div>
    );
  }
}

InputEditable.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  onSave: PropTypes.func.isRequired
};
