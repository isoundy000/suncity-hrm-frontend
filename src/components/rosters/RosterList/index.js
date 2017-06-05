import React from 'react';
import { Pagination } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import ListItem from './ListItem';

const RosterList = ({ rosters, dispatch, currentUser, ...props }) => {
  const { formatMessage } = props.intl;

  const rosterList = rosters.rosterList;

  const count = rosters.rostersCount;
  const currentPage = rosters.currentPage;
  const pageSize = 10;

  const handlePageChange = (page) => {
    console.log(page);
    dispatch({
      type: 'rosters/startFetchRosters',
      payload: {
        page,
      }
    })

    dispatch({
      type: 'rosters/pageChange',
      payload: {
        page,
      }
    })
  };

  return (
    <div className={styles.rosterList}>
      <div className={styles.listHeader}>
        共{count}條記錄
      </div>

      <div className={styles.listTable}>
        {
          rosterList.map((roster, index) => (
            <ListItem
              key={index}
              roster={roster}
            />
          ))
        }
      </div>

      <div className={styles.pagination}>
        {
          (count !== 0) &&
          <Pagination
            total={count}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            size="small"
          />
        }
      </div>
    </div>
  );
}

export default injectIntl(RosterList);
