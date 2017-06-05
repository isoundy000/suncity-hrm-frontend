import React, { PropTypes } from 'react';
import styles from './index.less';

import { Row, Col } from 'antd';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

function InfoOfApplicant({ profile, departmentName, positionName, ...props }) {
  const { formatMessage } = props.intl;

  const applicantInfoText = formatMessage(messages['app.my_recruit.card_content.applicant_info']);
  const applicantChineseNameText = formatMessage(messages['app.my_recruit.card_content.applicant_chinese_name']);
  const applicantEnglishNameText = formatMessage(messages['app.my_recruit.card_content.applicant_english_name']);

  const applyDepartmentText = formatMessage(messages['app.my_recruit.tag_card.apply_department']);
  const applyPositionText = formatMessage(messages['app.my_recruit.tag_card.apply_position']);
  const applicantNoText = formatMessage(messages['app.my_recruit.tag_card.applicant_no']);
  const sexText = formatMessage(messages['app.my_recruit.tag_card.sex']);

  const tmpGender = profile.data.personal_information.field_values.gender;

  const gender = tmpGender === 'male' ? '男' : '女';

  return (
    <div className={styles.applicant}>
      <div className={styles.title}>
        {applicantInfoText}
      </div>

      <div className={styles.infos}>
        <Row>
          <Col span={5}>{applicantNoText}</Col>
          <Col span={6}>{profile.applicant_no}</Col>
          <Col span={5} offset={2} >{sexText}</Col>
          <Col span={6}>{gender}</Col>
        </Row>

        <Row>
          <Col span={5}>{applicantChineseNameText}</Col>
          <Col span={6}>{profile.chinese_name}</Col>
          <Col span={5} offset={2} >{applyDepartmentText}</Col>
          <Col span={6}>{departmentName}</Col>
        </Row>

        <Row>
          <Col span={5}>{applicantEnglishNameText}</Col>
          <Col span={6}>{profile.english_name}</Col>
          <Col span={5} offset={2} >{applyPositionText}</Col>
          <Col span={6}>{positionName}</Col>
        </Row>

      </div>

    </div>
  );
}

InfoOfApplicant.propTypes = {
  profile: React.PropTypes.object.isRequired,
  departmentName: React.PropTypes.string.isRequired,
  positionName: React.PropTypes.string.isRequired,
};

export default injectIntl(InfoOfApplicant);
