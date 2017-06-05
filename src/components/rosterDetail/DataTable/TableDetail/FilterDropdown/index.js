import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Table, Input, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../../../locales/messages';

const FilterDropdown = ({ rosterDetail, dispatch, type, ...props }) => {
  const { formatMessage } = props.intl;

  const searchText = rosterDetail.dataTable.searchText;

  const onSearchTextChange = (e) => {
    dispatch({
      type: 'rosterDetail/searchTextChange',
      payload: {
        type,
        searchText: e.target.value,
      }
    })
  };

  const onSearch = () => {

    dispatch({
      type: 'rosterDetail/filterDropdownVisibleChange',
      payload: {
        type,
        visible: false,
      }
    });

    dispatch({
      type: 'rosterDetail/search',
      payload: {
        type,
      },
    });

  };

  return (
    <div className={styles.customFilterDropdown} >
      <Input
        placeholder={`Search ${type}`}
        value={searchText[type]}
        onChange={onSearchTextChange}
        onPressEnter={onSearch}
      />
      <Button type="primary" onClick={onSearch}>Search</Button>
    </div>
  );
};

export default injectIntl(FilterDropdown);
