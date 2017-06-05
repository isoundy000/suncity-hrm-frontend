import React from 'react';
import { Select, Button } from 'antd';

import styles from './index.less';


import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../locales/messages';

const Option = Select.Option;

const DateFilter = ({ rosters, dispatch, date, start, ...props }) => {
  const { formatMessage } = props.intl;

  const selectValue = rosters.dateFilter.value;
  /* const allOptions = rosters.dateFilter.options; */

  console.log(date, start);

  /* let tmpAllOptions = [Object.assign({}, {}, {
     value: '0_0',
     chinese_name: '全部',
     year: 0,
     month: 0,
     })];
   */

  let tmpAllOptions = [{
    value: '0_0',
    chinese_name: '全部',
    year: 0,
    month: 0,
  }];

  for (let y = start.year; y <= date.year + 1; y++) {
    for (let m = 1; m <= 12; m++) {
      tmpAllOptions = [ ...tmpAllOptions,
                        Object.assign({}, {}, {
                          value:`${y}_${m}`,
                          chinese_name: `${y}年${m}月`,
                          year: y,
                          month: m,
                        })];
    }
  }

  const allOptions = tmpAllOptions.filter(item => (
    (item.value === '0_0') ||
    (item.year === start.year && item.month >= start.month) ||
    (item.year > start.year && item.year < date.year + 1) ||
    (item.year === date.year + 1 && item.month <= date.month)
  ));

  console.log(allOptions);

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
      type: 'rosters/disabledButton',
      payload: {
        prev: isFirst,
        next: isLast,
      },
    });
  };

  const handleDateChange = (value) => {
    dispatch({
      type: 'rosters/startFetchRosters',
      payload: {
        date: value,
      },
    });

    dispatch({
      type: 'rosters/filterDateChange',
      payload: {
        newDate: value,
      }
    });

    forSpecialPosition(allOptions, value);
  };

  const handleClickPrev = () => {
    const { value } = rosters.dateFilter;
    const trueValue = value ? value : '0_0';
    const index = allOptions.findIndex(option => option.value === trueValue);
    if (index > 0) {
      const prevDate = allOptions[index - 1].value;

      dispatch({
        type: 'rosters/startFetchRosters',
        payload: {
          date: prevDate,
        },
      });

      dispatch({
        type: 'rosters/filterDateChange',
        payload: {
          newDate: prevDate,
        },
      });

      forSpecialPosition(allOptions, prevDate);
    }
  };

  const handleClickNext = () => {
    const { value } = rosters.dateFilter;
    const trueValue = value ? value : '0_0'; // '0_0' means 'all'
    const index = allOptions.findIndex(option => option.value === trueValue);
    if (index < (allOptions.length - 1) && index > (-1)) {
      const nextDate = allOptions[index + 1].value;

      dispatch({
        type: 'rosters/startFetchRosters',
        payload: {
          date: nextDate,
        },
      });

      dispatch({
        type: 'rosters/filterDateChange',
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
        disabled={rosters.dateFilter.prevDisabled}
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
          value={selectValue ? selectValue : '0_0'}
          defaultValue={'0_0'}
        >
          {options}
        </Select>
      </span>

      <Button
        className={styles.next}
        onClick={handleClickNext}
        disabled={rosters.dateFilter.nextDisabled}
      >
        {'>'}
      </Button>
    </span>
  );
};

export default injectIntl(DateFilter);
