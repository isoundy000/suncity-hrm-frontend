import React, { PropTypes } from 'react';
import { Radio, Form } from 'antd';
import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

function RegionFilter({ role, region, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  const handleRegionChange = (e) => {
    dispatch({
      type: 'role/switchRegion',
      payload: {
        permissionsRegion: e.target.value,
      }
    })
  };

  return (
    <div>
      <Form inline>
        <FormItem label="Region">
          <RadioGroup
            size="all"
            value={role.permissionsRegion}
            onChange={handleRegionChange}
          >
            <RadioButton value="all">All</RadioButton>
            <RadioButton value="macau">Macau</RadioButton>
            <RadioButton value="manila">Manila</RadioButton>
          </RadioGroup>
        </FormItem>
      </Form>
    </div>
  );
}

RegionFilter.propTypes = {
};

export default injectIntl(RegionFilter);
