import React from 'react';
import { Select, Button } from 'antd';

import styles from './index.less';


import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const Option = Select.Option;

const dateToInt = (date) => {
  // date format: 'yyyy_mm'
  return parseInt(date.split('_').join(''));
};

const DateFilter = ({ rosterDetail, dispatch, ...props }) => {
  const { formatMessage } = props.intl;

  const selectValue = rosterDetail.dateFilter.value;
  const departmentRosters = rosterDetail.departmentRosters;
  const { year, month } = rosterDetail.basicInfo;

  const allOptions = departmentRosters.map(roster => (
    Object.assign({}, {}, {
      value: `${roster.year}_${roster.month}`,
      chinese_name: `${roster.year}年${roster.month}月`,
    })
  )).sort((item1, item2) => (
    dateToInt(item1.value) - dateToInt(item2.value)
  ));

  const options = allOptions.map((option, index) => (
    <Option key={index} value={option.value}>{option['chinese_name']}</Option>
  ))

  const inSpecialPosition = (all, option, position) => {
    return (all.findIndex(item => item.value === option) === position);
  };

  const forSpecialPosition = (allOptions, value) => {

    const isFirst = inSpecialPosition(allOptions, value, 0);
    const isLast = inSpecialPosition(allOptions, value, allOptions.length - 1);

    dispatch({
      type: 'rosterDetail/disabledButton',
      payload: {
        prev: isFirst,
        next: isLast,
      },
    });
  };

  const handleDateChange = (value) => {
    console.log(value);

    dispatch({
      type: 'rosterDetail/filterDateChange',
      payload: {
        newDate: value,
      }
    });

    forSpecialPosition(allOptions, value);
  };

  const handleClickPrev = () => {
    const { value } = rosterDetail.dateFilter;
    const index = allOptions.findIndex(option => option.value === value);
    if (index > 0) {
      const prevDate = allOptions[index - 1].value;

      dispatch({
        type: 'rosterDetail/filterDateChange',
        payload: {
          newDate: prevDate,
        },
      });

      forSpecialPosition(allOptions, prevDate);
    }
  };

  const handleClickNext = () => {
    const { value } = rosterDetail.dateFilter;
    const index = allOptions.findIndex(option => option.value === value);
    if (index < (allOptions.length - 1)) {
      const nextDate = allOptions[index + 1].value;

      dispatch({
        type: 'rosterDetail/filterDateChange',
        payload: {
          newDate: nextDate,
        },
      });

      forSpecialPosition(allOptions, nextDate);
    }
  };

  return (
    <span className={styles.dateFilter}>
      <Button
        className={styles.prev}
        onClick={handleClickPrev}
        disabled={rosterDetail.dateFilter.prevDisabled}
      >
        {'<'}
      </Button>

      <span className={styles.dateSelect}>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Date"
          optionFilterProp="children"
          onChange={handleDateChange}
          value={selectValue}
        >
          {options}
        </Select>
      </span>

      <Button
        className={styles.next}
        onClick={handleClickNext}
        disabled={rosterDetail.dateFilter.nextDisabled}
      >
        {'>'}
      </Button>
    </span>
  );
};

export default injectIntl(DateFilter);
