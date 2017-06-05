import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Modal,
  Radio,
  Rate,
  Row,
  Select,
  Spin,
  TimePicker,
  Tooltip,
  message,
} from 'antd';
import React, { Component } from 'react';

import _ from 'lodash';
import { getLocaleText } from '../../../../locales/messages';
import { injectIntl } from 'react-intl';
import style from '../../jobApplication.less';

const ApplicantInfo = ({
  applicantProfiles,
  ApplicantPositionDetail,
  intl
})=> {

  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
  };
  const formItemLayout2 = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };

  const person_info = applicantProfiles.sections.find(section => section.key === 'personal_information');
  const chineseName = person_info.fields.find(field => field.key === 'chinese_name').value;
  const englishName = person_info.fields.find(field => field.key === 'english_name').value;
  let genderObj = person_info.fields.find(field => field.key === 'gender');
  genderObj = genderObj.select.options.find(field =>field.key == genderObj.value);
  const gender = getLocaleText(genderObj, intl.local);

  return (
    <div>
      <div className={style.modalContentTitle}>
        求職者信息
      </div>
      <Row>
        <Col span={12}>
          <FormItem
            {...formItemLayout2}
            label="求職者編號"
          >
            <span>{applicantProfiles.applicant_no}</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}

            label="求職者姓名(中)"
          >
            <span>{chineseName}</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label="求職者姓名(英)"
          >
            <span>{englishName}</span>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...formItemLayout2}
            label="性別"
          >
            <span>{gender}</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label="應徵部門"
          >
            <span>{ApplicantPositionDetail == undefined ? null : _.get(ApplicantPositionDetail.department,'chinese_name','待定')}</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label="應徵職位"
          >
            <span>{ApplicantPositionDetail == undefined ? null : _.get(ApplicantPositionDetail.position,'chinese_name','待定')}</span>
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default injectIntl(ApplicantInfo);
