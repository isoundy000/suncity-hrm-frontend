import React, { PropTypes } from 'react';
import style from './index.less';

function ModifyStatus({ record, detail }) {
  return (
    <div className={style.modalText}>
      {`${detail}: ${record.chinese_name}?`}
    </div>
  );
}

ModifyStatus.propTypes = {
  record: PropTypes.object.isRequired,
  detail: PropTypes.string.isRequired,
};

export default ModifyStatus;
