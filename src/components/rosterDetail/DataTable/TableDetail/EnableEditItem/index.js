import React from 'react';
import { Link } from 'react-router';
import { Select, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

const Option = Select.Option;

const getTime = (time) => {
  return time ? time.split('T')[1].split('.')[0].split(':').slice(0, 2).join(':') : '';
};

const EnableEditItem = ({ rosterDetail, dispatch, text, record, index, columnTitle, dataIndex, ...props }) => {
  const { formatMessage } = props.intl;

  const shifts = rosterDetail.shifts;

  const setSelectValue = (record) => {
    if (record[columnTitle]['shift_id']) {
      return shifts.findIndex(s => s.id === record[columnTitle]['shift_id']) < 0 ? 'no value' : `${record[columnTitle]['shift_id']}`;
    } else {
      return `${record[columnTitle]['leave_type']}`;
    }
  };


  const leaveType = [
    {
      opType: 'leaveType',
      value: 'offical_leave',
      'chinese_name': '公休',
    },

    {
      opType: 'leaveType',
      value: 'annual_leave',
      'chinese_name': '年假',
    },

    {
      opType: 'leaveType',
      value: 'personal_leave',
      'chinese_name': '事假',
    }
  ];

  const options = [ ...rosterDetail.shifts, ...leaveType ].map((op, index) => (
    op['opType'] === 'leaveType' ?
    (
      <Option key={index} value={`${op.value}`}>
        {`${op['chinese_name']}`}
      </Option>
    ):
    (
      <Option key={index} value={`${op.id}`}>
        {`${op['chinese_name']}`}
        {
          (op.id !== -1) &&
          <div>
            {`(${getTime(op['start_time'])} - ${getTime(op['end_time'])})`}
          </div>
        }
      </Option>
    )
  ));

  const handleChange = (value) => {
    // TODO
    /* dispatch({ */
    /* type: 'rosterDetail/itemChange', */
    /* payload: { */
    /* value, */
    /* record, */
    /* index, */
    /* columnTitle, */
    /* dataIndex, */
    /* } */
    /* }); */
    if (value !== text) {
      // For different dataIndex
      const valueType = isNaN(parseInt(value)) ? 'leaveType' : 'shift';
      dispatch({
        type: 'rosterDetail/itemChange',
        payload: {
          value,
          valueType,
          record,
          index,
          columnTitle,
          dataIndex,
        }
      });
    } else {
      console.log('No change');
    }
  };

  return (
    <div className={styles.enableEditItem}>

      {
        !! record.changeColumns &&
        record.changeColumns.length > 0 &&
        record.changeColumns.includes(columnTitle) ? //dataIndex TODO
        <div className={styles.changeNotice}></div> :
        <div className={styles.placeholder}></div>
      }
        <Select
          size="large"
          onChange={handleChange}
          value={setSelectValue(record)}
          defaultValue={record[columnTitle]['shift_id'] ? `${record[columnTitle]['shift_id']}` : 'no value'}
        >
          {options}
        </Select>

    </div>
  );
};

export default injectIntl(EnableEditItem);
