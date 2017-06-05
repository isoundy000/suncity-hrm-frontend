import React, { PropTypes } from 'react';
import SuncityFinderCategoriesModal from './SuncityFinderCategoriesModal';
import _ from 'lodash';
import classes from './index.less';
import classNames from 'classnames';

function SuncityFinderCategory({ category, active, onChangeCurrentCategory }) {
  return (
    <div className={classNames(classes.category, {active})} onClick={() => onChangeCurrentCategory(category)}>
      <span>
        {category.chinese_name}({category.files_count})
      </span>
    </div>
  );
}

SuncityFinderCategory.propTypes = {
  category: PropTypes.shape({
    chinese_name: PropTypes.string,
    english_name: PropTypes.string,
    files_count: PropTypes.number,
  }).isRequired
};

function SuncityFinderCategories(
  {
    allFilesCount, categories, onCommitNewCategory, onRowUpdate,
    showModal, onCloseModal, onChangeCurrentCategory, currentCategory, onDeleteCategory
  }
) {

  const AllCategory = {
    id: 0,
    chinese_name: '全部',
    english_name: 'All',
    files_count: allFilesCount,
  };

  return (
    <div className={classes.categoriesContainer}>
      <SuncityFinderCategoriesModal
        categories={categories}
        onCommitNewCategory={onCommitNewCategory}
        onRowUpdate={onRowUpdate}
        showModal={showModal}
        onCloseModal={onCloseModal}
        onDeleteCategory={onDeleteCategory}
      />

      <div className={classes.categories}>
        {
          [AllCategory].concat(categories.sort((a, b) => a.id - b.id > 0)).map((category) => (
            <SuncityFinderCategory
              category={category}
              key={category.id}
              onChangeCurrentCategory={onChangeCurrentCategory}
              active={category.id == _.get(currentCategory, 'id', 0)}
            />
          ))
        }
      </div>
    </div>
  );
}

export default SuncityFinderCategories;
