import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';
import { Select, Spin } from 'antd';
import { getLocaleText } from '../../locales/messages';

class AsyncSelect extends Component {
  constructor(props) {
    super(props);

    const { options, endpoint } = props.select;

    if (options) {
      this.state = {
        options,
      };
    } else if (endpoint) {
      if (props.endpoints.data[endpoint]) {
        this.state = {
          options: props.endpoints.data[endpoint],
        };
      } else {
        this.state = {
          options: null,
        };
      }
    } else {
      this.state = {
        options: [],
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options, endpoint } = nextProps.select;
    if (options) {
      this.setState({
        options,
      });
    } else if (endpoint) {
      if (nextProps.endpoints.data[endpoint]) {
        this.setState({
          options: nextProps.endpoints.data[endpoint],
        });
      } else {
        this.setState({
          options: null,
        });
      }
    }
  }

  componentDidMount() {
    if (this.state.options === null) {
      this.props.dispatch({
        type: 'endpoints/get',
        payload: this.props.select.endpoint,
      });
    }
  }

  render() {
    const { intl, value, onChange } = this.props;
    return this.state.options ? (
      <Select
        value={_.isEmpty(value) ? value : `${value}`}
        onChange={onChange}
        dropdownMatchSelectWidth={false}
        style={{ width: 100 }}
      >
        {
          this.state.options.map((option) => (
            <Select.Option key={`${option.key}`} value={`${option.key}`}>
              {getLocaleText(option, intl.locale)}
            </Select.Option>
          ))
        }
      </Select>
    ) : (
      <span>
        <Spin size="small" />
        <Spin size="small" />
        <Spin size="small" />
      </span>
    );
  }
}

AsyncSelect.propTypes = {
  select: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ endpoints, currentUser }) => ({
  endpoints,
  token: currentUser ? currentUser.token : null,
});

export default connect(mapStateToProps)(injectIntl(AsyncSelect));
