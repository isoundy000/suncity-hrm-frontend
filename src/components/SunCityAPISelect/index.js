import React from 'react';
import { Spin } from 'antd';
import YLemonSearchInput from 'components/YLemonSearchInput';
import selectData from 'services/selectData';
import classes from './index.less';

class SunCityAPISelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
    };
  }

  dataSourceWithDefaultOption(data) {
    return [this.defaultOption()].concat(data);
  }

  componentWillMount() {
    this.requestSelectData();
  }

  componentWillReceiveProps(props) {
    this.requestSelectData()
  }

  defaultOption() {
    return {
      id: null,
      chinese_name: '不限',
      english_name: 'NOT LIMITED',
    };
  }

  defaultValue() {
    const { value } = this.props;
    if(value) {
      if(typeof(value) == 'object') {
        return value;
      }else {
        return this.state.dataSource.find(data => {
          return data.id == value || data.key == value;
        });
      }
    }else {
      return this.defaultOption();
    }
  }

  handleChange(value) {
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }

  dataSource(data) {
    if(this.props.hasDefaultOption) {
      return this.dataSourceWithDefaultOption(data);
    }else {
      return data;
    }
  }

  requestSelectData() {
    selectData({
      endpoint: this.props.type,
      region: this.context.region
    }).then(({ data, meta }) => {
      this.setState({
        dataSource: this.dataSource(data)
      });
    })
  }

  render() {
    if(this.state.dataSource == null) {
      return (
        <div className={classes.fixSpin}>
          <Spin />
        </div>
      );
    }

    return (
      <YLemonSearchInput
        onChange={::this.handleChange}
        dataSource={this.state.dataSource}
        className="ant-select"
        defaultValue={this.defaultValue()}
        valueField={this.props.valueField}
        textField={this.props.textField}
      />
    );
  }
}

SunCityAPISelect.propTypes = {
  type: React.PropTypes.string.isRequired,
  hasDefaultOption: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  initSelectKey: React.PropTypes.string,
  valueField: React.PropTypes.any,
  textField: React.PropTypes.any,
  defaultValue: React.PropTypes.any,
}

SunCityAPISelect.contextTypes = {
  region: React.PropTypes.string
}

SunCityAPISelect.defaultProps = {
  hasDefaultOption: true
}
export default SunCityAPISelect;
