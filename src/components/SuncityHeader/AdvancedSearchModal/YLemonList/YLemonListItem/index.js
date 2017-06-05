/**
 * Created by meng on 16/8/19.
 */

import React, { PropTypes } from 'react';
import classes from './index.less';
import classNames from 'classnames';

const YLemonListItem = ({
  item,
  unmatched,
  handleItemChange,
  handleItemDelete,
}) => {
  const keyDownHandler = e => {
    if (e.keyCode === 8 && item.value.length === 0) {
      handleItemDelete(item);
      e.stopPropagation();
    }
  };

  return (
    <div className={classes.itemContainer}>
      <input
        className={classNames(classes.itemInput, unmatched ? classes.unmatched : undefined)}
        type="text"
        value={item.value}
        onChange={e => handleItemChange({
          id: item.id,
          value: e.target.value,
        })}
        onKeyDown={keyDownHandler}
      />
    </div>
  );
};

YLemonListItem.propTypes = {
  item: PropTypes.object.isRequired,
  unmatched: PropTypes.bool.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  handleItemDelete: PropTypes.func.isRequired,
};

export default YLemonListItem;
