import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Spin } from 'antd';
import { getLocaleText } from 'locales/messages';
import { getEndpoint } from 'services/endpoints';

class YSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.select.options || [],
    };
  }

  hasReadOnlyEndPoints() {
    return ['/jobs'];
  }

  componentDidMount() {
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

  render() {
    if(this.state.options) {
      let readOnly = [];
      if(this.hasReadOnlyEndPoints().indexOf(this.props.select.endpoint) != -1) {
        readOnly = this.state.options.filter(item => item.status == 'disabled').map(item => `${item.key}`);
      }

      return (
        <Select
          value={_.isEmpty(this.props.value) ? this.props.value : `${this.props.value}`}
          onChange={(value) => this.props.onChange(value)}
          dropdownMatchSelectWidth={false}
        >
          {
            this.state.options.map((option) => (
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
      );
    }else {
      return (
        <span>
          <Spin size="small" />
          <Spin size="small" />
          <Spin size="small" />
        </span>
      );
    }
  }
}

YSelect.propTypes = {
  select: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};

YSelect.contextTypes = {
  region: PropTypes.string.isRequired,
};

export default injectIntl(YSelect);
