/**
 * Created by meng on 16/8/19.
 */

import classNames from 'classnames';
import React, { PropTypes } from 'react';
import classes from './index.less';

const YLemonListInput = ({
  text,
  unmatched,
  handleNextValueChange,
  handleNextValueCommit,
  handleItemChange
}) => (
  <div className={classes.inputContainer}>
    <input
      className={classNames(
        classes.itemInput,
        text ? classes.nonempty : classes.empty,
        unmatched ? classes.unmatched : undefined,
      )}
      value={text}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          handleNextValueCommit(text);
        }

        e.stopPropagation();
      }}
      onChange={e => handleNextValueChange(e.target.value)}
    />
  </div>
);

YLemonListInput.propTypes = {
  text: PropTypes.string.isRequired,
  unmatched: PropTypes.bool.isRequired,
  handleNextValueChange: PropTypes.func.isRequired,
  handleNextValueCommit: PropTypes.func.isRequired,
};

export default YLemonListInput;
