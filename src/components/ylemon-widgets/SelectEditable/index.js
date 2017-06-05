import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Spin } from 'antd';
import { getLocaleText } from 'locales/messages';
import { getEndpoint } from 'services/endpoints';

import classNames from 'classnames';
import classes from './index.less';

class SelectEditable extends Component {
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(props);

    [
      'handleSelect',
      'handleSubmit',
      'handleCancel',
      'handleChange',
      'handleClickDocument',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getStateFromProps(props) {
    return {
      isEditing: false,
      options: props.select.options || [], // NOTE: 传入整个`select`
      pastValue: props.value,
      value: props.value,
      readOnly: [],
    };
  }

  hasReadOnlyEndPoints() {
    return ['/jobs'];
  }
  // componentWillReceiveProps(props) {
  //   this.setState(this.getStateFromProps(props));
  // }

  componentDidMount() {
    document.addEventListener('click', this.handleClickDocument, false);

    if (!this.state.options.length) {
      const that = this;
      (async function() {
        const { data, err } = await getEndpoint(that.props.select.endpoint, that.context.region);

        if (data) {
          that.setState({
            options: data.data,
          });
        }

        // TODO: handle err
      })();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickDocument, false);
  }

  render() {
    const { isEditing, value, options } = this.state;

    if (options.length > 0) {
      let readOnly = [];
      if(this.hasReadOnlyEndPoints().indexOf(this.props.select.endpoint) != -1) {
        readOnly = this.state.options.filter(item => item.status == 'disabled').map(item => `${item.key}`);
      }

      return (
        <div className={classNames(classes.selectWrapper, this.props.className)}>
          <Select
            value={_.isEmpty(value) ? null : `${value}`}
            onSelect={this.handleSelect}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          >
            {
              options.map((option) => (
                <Select.Option
                  key={`${option.key}`}
                  value={`${option.key}`}
                  disabled={readOnly.indexOf(`${option.key}`) != -1}
                >
                  {getLocaleText(option, this.props.intl.locale)}
                </Select.Option>
              ))
            }
          </Select>
          <div
            className={classNames('editButtonGroup', classes.btnGroup, { [classes.active]: isEditing })}
            ref={c => this.btns = c}
          >
            <button className={classes.btnSubmit} type="button" onClick={this.handleSubmit} />
            <button className={classes.btnCancel} type="button" onClick={this.handleCancel} />
          </div>
        </div>
      );
    } else {
      return (
        <span className={classes.fixSpin}>
          <Spin size="small" />
        </span>
      );
    }
  }

  handleSelect(value) {
    if (value !== this.state.pastValue) {
      this.setState({
        isEditing: true,
      });
    } else {
      this.setState({
        isEditing: false,
      });
    }
  }

  handleSubmit() {
    const { value } = this.state;
    this.props.onSave(value);
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

  handleChange(value) {
    this.setState({
      value: value,
    });
  }

  handleClickDocument(e) {
    const target = e.target;
    if (this.btns.contains(target) ||
      target.classList.contains('ant-select-dropdown-menu-item')) {
      return;
    }

    this.handleCancel();
  }
}

SelectEditable.propTypes = {
  select: PropTypes.shape({
    options: PropTypes.array,
    type: PropTypes.string,
    endpoint: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

SelectEditable.contextTypes = {
  region: PropTypes.string.isRequired,
}

export default injectIntl(SelectEditable);
