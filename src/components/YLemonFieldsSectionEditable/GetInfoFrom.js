import React, { PropTypes } from 'react';

import { injectIntl } from 'react-intl';
import { Row, Col, Form, Checkbox, Input } from 'antd';

import { getLocaleText } from 'locales/messages';

import styles from './index.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const options = [
  {
    key: "macao_daily_news",
    chinese_name: "澳門日報",
    english_name: "Macao Daily News"
  },
  {
    key: "power_daily",
    chinese_name: "力報",
    english_name: "Power Daily"
  },
  {
    key: "campus_web",
    chinese_name: "校內網頁",
    english_name: "Campus Web"
  },
  {
    key: "friends",
    chinese_name: "朋友",
    english_name: "Friends"
  },
  {
    key: "the_labour_affairs_bureau",
    chinese_name: "勞工事務局",
    english_name: "the Labour Affairs Bureau"
  },
  {
    key: "leaflets",
    chinese_name: "宣傳單",
    english_name: "Leaflets"
  },
  {
    key: "recommender_program",
    chinese_name: "推薦人計畫",
    english_name: "Recommender program"
  },
  {
    key: "internet",
    chinese_name: "互聯網（請列明）",
    english_name: "Internet （please specify）"
  },
  {
    key: "others",
    chinese_name: "其他（請列明）",
    english_name: "Others（please specify）"
  }
];

class GetInfoFrom extends React.Component {

  state = {
    get_info_from: {
      selected: this.props.getInfoFrom ? this.props.getInfoFrom.selected : [],
      internet_detail: this.props.getInfoFrom ? this.props.getInfoFrom.internet_detail : '',
      others_detail: this.props.getInfoFrom ? this.props.getInfoFrom.others_detail : '',
    },

    check_internet: this.props.getInfoFrom ? this.props.getInfoFrom.selected.filter(s => s === 'internet').length > 0 : false,
    check_others: this.props.getInfoFrom ? this.props.getInfoFrom.selected.filter(s => s === 'others').length > 0 : false,
  };

  handleCheckboxGroupChange = (checkedValue) => {
    const getInfoFrom = this.state.get_info_from;

    this.setState({
      get_info_from: { ...getInfoFrom, selected: checkedValue },
    });

    this.props.onSave(this.props.getInfoFrom, {
      edit_action_type: 'edit_get_info_from',
      params: { ...getInfoFrom, selected: checkedValue },
    })

  };

  handleCheckInternet = (e) => {

    const state = this.state;
    const getInfoFrom = this.state.get_info_from;
    const internet_detail = e.target.checked ? getInfoFrom.internet_detail : '';

    const selected = e.target.checked ?
                     [ ...getInfoFrom.selected, 'internet' ] : getInfoFrom.selected.filter(s => s !== 'internet') ;

    this.setState({
      ...state,
      get_info_from: { ...state.get_info_from, selected },
      check_internet: e.target.checked,
    });

    this.props.onSave(this.props.getInfoFrom, {
      edit_action_type: 'edit_get_info_from',
      params: {
        ...getInfoFrom,
        selected,
        internet_detail,
      },
    })
  };

  handleCheckOthers = (e) => {
    const state = this.state;
    const getInfoFrom = this.state.get_info_from;

    const selected = e.target.checked ?
                     [ ...getInfoFrom.selected, 'others' ] : getInfoFrom.selected.filter(s => s !== 'others') ;

    const others_detail = e.target.checked ? getInfoFrom.others_detail : '';

    this.setState({
      ...state,
      get_info_from: { ...state.get_info_from, selected },
      check_others: e.target.checked,
    });

    this.props.onSave(this.props.getInfoFrom, {
      edit_action_type: 'edit_get_info_from',
      params: {
        ...getInfoFrom,
        selected,
        others_detail },
    })

  };

  handleInternetInputChange = (e) => {
    const getInfoFrom = this.state.get_info_from;
    this.setState({
      get_info_from: { ...getInfoFrom, internet_detail: e.target.value },
    });

    this.props.onSave(this.props.getInfoFrom, {
      edit_action_type: 'edit_get_info_from',
      params: { ...getInfoFrom, internet_detail: e.target.value },
    })
  };

  handleOthersInputChange = (e) => {

    const getInfoFrom = this.state.get_info_from;

    this.setState({
      get_info_from: { ...getInfoFrom, others_detail: e.target.value },
    });

    this.props.onSave(this.props.getInfoFrom, {
      edit_action_type: 'edit_get_info_from',
      params: { ...getInfoFrom, others_detail: e.target.value },
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const checkboxOptions = options.filter(opt => opt.key !== 'internet' && opt.key !== 'others')
                                   .map(opt => (
                                     {
                                       ...opt,
                                       label: opt.chinese_name,
                                       value: opt.key,
                                     }
                                   ));

    return (
      <div className={styles.wrapper}>

        <Row className={styles.title}>
          得知招聘消息途徑：
        </Row>

        <Row className={styles.checkGroup}>
          <Col md={24}>
            <CheckboxGroup
              options={checkboxOptions}
              onChange={this.handleCheckboxGroupChange}
              value={this.state.get_info_from.selected}
            />
          </Col>
        </Row>

        <Row className={styles.checkItem}>
          <Col md={6}>
            <Checkbox
              onChange={this.handleCheckInternet}
              checked={this.state.check_internet}
            >
              { options.filter(opt => opt.key === 'internet')[0].chinese_name }
            </Checkbox>
          </Col>
          <Col md={18}>
            <Input
              placeholder="請列明"
              disabled={ !this.state.check_internet }
              onChange={ this.handleInternetInputChange }
              defaultValue={this.state.get_info_from.internet_detail}
            />
          </Col>
        </Row>

        <Row className={styles.checkItem}>
          <Col md={6}>
            <Checkbox
              onChange={this.handleCheckOthers}
              checked={this.state.check_others}
            >
              { options.filter(opt => opt.key === 'others')[0].chinese_name }
            </Checkbox>
          </Col>

          <Col md={18}>
            <Input
              placeholder="請列明"
              disabled={ !this.state.check_others }
              onChange={ this.handleOthersInputChange }
              defaultValue={ this.state.get_info_from.others_detail }
            />
          </Col>
        </Row>

      </div>
    );
  }
}

GetInfoFrom = Form.create({})(GetInfoFrom);

export default GetInfoFrom;
