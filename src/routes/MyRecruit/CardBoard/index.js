import React, { PropTypes } from 'react';
import { Spin, Pagination } from 'antd';
import styles from './index.less';
import TagCard from '../TagCard';


import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function CardBoard({ content, list, currentList, currentPage, count, pageSize, dispatch, db, ...props }) {

  const handlePageChange = (pageNumber) => {
    console.log(pageNumber, db);
    dispatch({
      type: 'myRecruit/pageChange',
      payload: {
        pageNumber,
        type: content,
      }
    })
  };

  return (
    <Spin spinning={db.loading[content]}>
      <div>
        {
          currentList.map((cardData, index) => (
            <TagCard
              key={`card-${index}`}
              content={content}
              cardData={cardData}
              dispatch={dispatch}
              db={db}
            />
          ))
        }

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
    </Spin>
  );
}

CardBoard.propTypes = {
  content: React.PropTypes.string.isRequired,
  list: React.PropTypes.array.isRequired,
  db: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

export default injectIntl(CardBoard);
