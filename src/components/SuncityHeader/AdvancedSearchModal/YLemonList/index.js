/**
 * Created by meng on 16/8/19.
 */
import _ from 'lodash';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import YLemonListItem from './YLemonListItem';
import YLemonListInput from './YLemonListInput';
import { Input } from 'antd';

import classes from './index.less';

const YLemonList = ({
  dataSource,
  nextValue,
  className,
  unmatchedValues,
  handleItemChange,
  handleItemDelete,
  handleNextValueChange,
  handleNextValueCommit,
}) => (
  <div className={classNames(classes.listContainer, className)}>
    {dataSource.map(item => (
      <YLemonListItem
        key={`item-${item.id}`}
        item={item}
        unmatched={!!_.find(unmatchedValues, value => value === item.value)}
        handleItemChange={handleItemChange}
        handleItemDelete={handleItemDelete}
      />)
    )}
    <YLemonListInput
      text={nextValue}
      handleNextValueChange={handleNextValueChange}
      handleNextValueCommit={handleNextValueCommit}
      unmatched={!!_.find(unmatchedValues, value => value === nextValue)}
    />
  </div>
);

YLemonList.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.array.isRequired,
  nextValue: PropTypes.string,
  unmatchedValues: PropTypes.array.isRequired,
  handleItemChange: PropTypes.func,
  handleItemDelete: PropTypes.func,
  handleNextValueChange: PropTypes.func,
  handleNextValueCommit: PropTypes.func,
};

export default YLemonList;
