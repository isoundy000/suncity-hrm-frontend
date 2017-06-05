import React, { PropTypes } from 'react';
import styles from '../../index.less';
import { Button, Row, Col, Rate } from 'antd';

import ViewButton from '../../../ViewButton';

import beizhu from '../../assets/beizhu.png';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

function ChooseAgreed({ content, cardData, interviewHistory, ...props }) {
  const { formatMessage } = props.intl;

  const agreeRemarkText = formatMessage(messages['app.my_recruit.card_content.choose_agree_remark']);

  return (
    <div>
      <div className={styles.cardBody}>
        <div className={styles.interviewInfo}>
          <Row type="flex">
            <Col span={3}>
              <div className={styles.item}>
                <span className={styles.icons}><img alt="" src={beizhu} /></span>
                <span>
                  {agreeRemarkText}
                </span>
              </div>
            </Col>
            <Col span={21}>
              <span className={styles.result}>
                <p>
                  {cardData.comment}
                </p>
              </span>
            </Col>
          </Row>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <ViewButton
          cardDataId={cardData.id}
          applicantProfileId={cardData.applicant_profile.id}
        />
      </div>
    </div>
  );
}


ChooseAgreed.propTypes = {
  content: React.PropTypes.string.isRequired,
  cardData: React.PropTypes.object.isRequired,
  interviewHistory: React.PropTypes.array.isRequired,
};

export default injectIntl(ChooseAgreed);
