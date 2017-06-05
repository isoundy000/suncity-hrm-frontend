import React, { PropTypes } from 'react';
import style from './index.less';

function StatusWarnning({ record, detail }) {
  return (
    <div className={style.modalText}>
      {`${record.chinese_name} ${detail}`}
    </div>
  );
}

StatusWarnning.propTypes = {
  record: PropTypes.object.isRequired,
  detail: PropTypes.string.isRequired,
};

export default StatusWarnning;
