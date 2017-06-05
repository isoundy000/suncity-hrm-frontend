import React from 'react';
import { DatePicker, Select, Button, Row, Col } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import NewRosterModal from './NewRosterModal';
import DateFilter from './DateFilter';


const ToolBar = ({ rosters, dispatch, date, currentUser, ...props }) => {
  const { formatMessage } = props.intl;

  const Option = Select.Option;
  const { MonthPicker } = DatePicker;

  const allDepartments = rosters.allDepartments;

  const all = Object.assign({}, {}, {
    chinese_name: '不限',
    english_name: 'all',
    id: '-1',
  });

  console.log('ans', rosters.departmentFilter);

  const departmentOptions = rosters.disabledDepartmentSelect ?
                            [
                              <Option
                              value={`${currentUser[department_id]}`}
                              >
                              {allDepartments[currentUser['department_id']]['chinese_name']}
                              </Option>
                            ] :
                            [ all, ...allDepartments ].map((dept, index) => {
                              return (
                                <Option
                                  value={`${dept['id']}`}
                                  key={index}
                                >
                                  {dept['chinese_name']}
                                </Option>
                              );
                            });

  const handleDepartmentChange = (value) => {
    console.log(value);
    const departmentId = value === '-1' ? 'all' : parseInt(value);

    dispatch({
      type: 'rosters/startFetchRosters',
      payload: {
        departmentId,
      }
    });

    dispatch({
      type: 'rosters/currentDepartmentChange',
      payload: {
        departmentId,
      }
    });
  };

  /* if (currentUser.can['rosterList'] !== true) {
     const departmentId = currentUser['department_id'];

     console.log('is working?', departmentId);

     dispatch({
     type: 'rosters/startFetchRosters',
     payload: {
     departmentId,
     },
     });
     }
   */

  return (
    <div className={styles.toolBar}>
      <Row>
        <Col md={6}>
          <span className={styles.filterLabel}>時間段：</span>

          <DateFilter
            rosters={rosters}
            dispatch={dispatch}
            date={date}
            start={{ year: 2015, month: 6 }}
          />
        </Col>

        <Col md={6}>
          <span className={styles.filterLabel}>部門：</span>

          <Select
            style={{ width: 200 }}
            optionFilterProp="children"
            onChange={handleDepartmentChange}
            value={rosters.departmentFilter && rosters.departmentFilter !== 'all' ? `${rosters.departmentFilter}` : all['id']}
            disabled={rosters.departmentFilterDisabled}
          >
            {departmentOptions}
          </Select>
        </Col>

        <Col md={2} offset={10}>
          <NewRosterModal
            rosters={rosters}
            dispatch={dispatch}
            date={date}
          />
        </Col>
      </Row>
    </div>
  );
}

export default injectIntl(ToolBar);
