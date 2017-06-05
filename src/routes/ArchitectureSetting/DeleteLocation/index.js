import React, { PropTypes } from 'react';
import style from './index.less';

function DeletePosition({ record }) {
  return (
    <div className={style.modalText}>
      {`你確定要刪除${record.chinese_name}嗎?`}
    </div>
  );
}

DeletePosition.propTypes = {
  record: PropTypes.object.isRequired,
};

export default DeletePosition;
