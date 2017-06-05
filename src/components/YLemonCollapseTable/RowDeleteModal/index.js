/**
 * Created by meng on 16/9/4.
 */

import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';

// TODO (zhangmeng): intl support
const RowDeleteModal = ({ visible, onCancel, onConfirm }) => (
  <Modal
    okText="確認"
    title="是否確認刪除?"
    visible={visible}
    onOk={onConfirm}
    onCancel={onCancel}
  >
    <p>是否確認刪除本條記錄?</p>
    <p>刪除後無法恢復!</p>
  </Modal>
);

RowDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default injectIntl(RowDeleteModal);
