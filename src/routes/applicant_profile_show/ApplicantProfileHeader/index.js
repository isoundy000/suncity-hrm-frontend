import React from 'react';
import ProfileAvatar from 'components/ProfileDetail/ProfileAvatar';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';
import ApplicantProfileHeaderSource from '../ApplicantProfileHeaderSource';

import classes from './index.less';

function ApplicantProfileHeader({ profile, onImageChange, readonly, width, height, dispatch, intl }) {

  const personalSection = profile.sections.find((section) => {
    return section.key === 'personal_information';
  });

  console.log('ps', personalSection);

  const chineseName = personalSection.field_values.chinese_name;
  const englishName = personalSection.field_values.english_name;
  const mobileField = personalSection.field_values.mobile_number;
  const applyId = profile.applicant_no;

  const tmpNickName = personalSection.field_values.nick_name;
  const nickName = tmpNickName ? tmpNickName : '...';

  const photoField = personalSection.fields.find(field => field.key === 'photo');

  return (
    <div className={classes.container}>
      <ProfileAvatar
        photoField={photoField}
        readonly={readonly}
        imageOnChange={(value) => {
          onImageChange(value);
        }}
      />

      <ApplicantProfileHeaderSource source={profile.source}/>

      <div className={classes.header}>
        <span className="personal-summary-name-english">
          {chineseName}
        </span>
        <span className="personal-summary-name-english">
          {englishName}
        </span>
        <span className={classes.nickName}>
          {` (${nickName})`}
        </span>
      </div>

      <div className={classes.detail}>
        <div className={classes.detailItem}>
          <span className={`icon icon-no`} />
          <span className={classes.lableTip}>求職編號</span>
          <span>{applyId}</span>
        </div>

        <div className={classes.detailItem}>
          <span className={`icon icon-mobile`} />
          <span className={classes.lableTip}>手提電話</span>
          <span>{mobileField}</span>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfileHeader;
