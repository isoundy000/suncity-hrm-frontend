import React, { PropTypes } from 'react';
import { Form, Modal } from 'antd';

// Forms
import DepartmentForm from '../DepartmentForm';
import PositionForm from '../PositionForm';
import LocationForm from '../LocationForm';
import DeleteLocation from '../DeleteLocation';
import ModifyStatus from '../ModifyStatus';
import StatusWarnning from '../StatusWarnning';

// Icon
import BianJiIcon from './assets/bianji.png';
import ShanChuIcon from './assets/shanchu.png';
import JiaGouXinZengIcon from './assets/jiagouxinzeng.png';

import styles from './index.less';
import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

const createForm = Form.create;

class OperationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible() {
    const modalState = !this.state.modalVisible;
    this.props.form.resetFields();
    const itemTitle = this.props.itemTitle;

    if (itemTitle === '修改' && modalState) {
      const record = this.props.record;
      const content = this.props.content;
      let checkOffice = false;
      let checkAllVip = false;

      const vipLocationIds = record.location_ids.filter(id => id !== 44);

      if (vipLocationIds.length < record.location_ids.length) {
        checkOffice = true;
      }

      if (vipLocationIds.length > 0) {
        checkAllVip = true;
      }

      // set Form fields
      if (content === 'departments') {
        this.props.form.setFieldsValue({
          chinese_name: record.chinese_name,
          english_name: record.english_name,
          region_key: record.region_key,
          parent_id: record.parent_id ? `${record.parent_id}` : null,
          location_ids: record.location_ids,
          office_id: checkOffice,
          check_all_vip: checkAllVip,
          vip_location_ids: vipLocationIds,
          comment: record.comment,
        });
      } else if (content === 'positions') {
        this.props.form.setFieldsValue({
          chinese_name: record.chinese_name.split(' ').slice(0, -1).join(' '),
          english_name: record.english_name.split(' ').slice(0, -1).join(' '),
          region_key: record.region_key,
          grade: record.grade,
          parent_id: record.parent_id ? `${record.parent_id}` : null,
          department_ids: record.department_ids,
          location_ids: record.location_ids,
          office_id: checkOffice,
          check_all_vip: checkAllVip,
          vip_location_ids: vipLocationIds,
          comment: record.comment,
        });
      }
    }

    if (itemTitle === '編輯' && modalState) {
      const record = this.props.record;
      const content = this.props.content;
      if (content === 'locations') {
        this.props.form.setFieldsValue({
          chinese_name: record.chinese_name,
          english_name: record.english_name,
          region_key: record.region_key,
          parent_id: record.parent_id,
        });
      }
    }

    this.setState({ modalVisible: modalState });
  }

  // TODO: refactor
  getModal(itemTitle, form, props) {
    const { content, record } = this.props;
    console.log('hello', content, record);
    let result;

    if (itemTitle === '停用') {

      if (content === 'departments') {
        if (record['employees_count'] > 0 || record['positions_count'] > 0) {
          result = (<StatusWarnning record={record} detail={'該部門下有員工和職位，不能停用'} />);
        } else {
          result = (<ModifyStatus record={record} detail={'您是否確認要停用該部門'} />);
        }
      } else if (content === 'positions') {
        if (record['employees_count'] > 0) {
          result = (<StatusWarnning record={record} detail={'該職位下有員工，不能停用'} />);
        } else {
          result = (<ModifyStatus record={record} detail={'您是否確認要停用該職位'} />);
        }
      }

    } else if (itemTitle === '啓用') {
      result = (<ModifyStatus record={record} detail={'您是否確認啓用'} />);
    }

    if (itemTitle === '修改') {
      if (content === 'departments') {
        result = (<DepartmentForm form={form} record={record} {...props} />);
      } else if (content === 'positions') {
        result = (<PositionForm form={form} record={record} {...props} />);
      }
    }

    if (itemTitle === '新增下級部門') {
      result = (<DepartmentForm form={form} record={record} {...props} />);
    }

    if (itemTitle === '新增下級職位') {
      result = (<PositionForm form={form} record={record} {...props} />);
    }

    if (itemTitle === '新增場館' || itemTitle === '編輯') {
      result = (<LocationForm form={form} {...props} />);
    }

    if (itemTitle === '刪除') {
      result = (<DeleteLocation form={form} record={record} />);
    }

    return result;
  }


  getModalTrigger() {
    const kind = this.props.kind;
    const itemTitle = this.props.itemTitle;
    let result;
    if (kind === 'menu') {
      result = (<a onClick={() => this.setModalVisible()}>{itemTitle}</a>);
    } else if (kind === 'List') {
      if (itemTitle === '編輯') {
        result = (<a onClick={() => this.setModalVisible()}>
          <img alt="" src={BianJiIcon} />
        </a>);
      } else if (itemTitle === '刪除') {
        result = (<a onClick={() => this.setModalVisible()}>
          <img alt="" src={ShanChuIcon} />
        </a>);
      } else if (itemTitle === '新增場館') {
        result = (<a className={styles.addlocationbtn} onClick={() => this.setModalVisible()} />);
      }
    }
    return result;
  }

  ifToggleStatus(itemTitle, content, record) {
    if (itemTitle === '停用') {
      if ((content === 'departments' && record['employees_count'] === 0 && record['positions_count'] === 0) ||
          (content === 'positions' && record['employees_count'] === 0)) {
            this.props.dispatch({
              type: 'architectureSetting/updateStatus',
              payload: {
                status: 'disable',
                type: content,
                id: record.id,
              },
            });
      }
    } else if (itemTitle === '啓用') {
      this.props.dispatch({
        type: 'architectureSetting/updateStatus',
        payload: {
          status: 'enable',
          type: content,
          id: record.id,
        },
      });
    }
  }

  handleOk(itemTitle, content, record) {
    const officeId = this.props.form.getFieldValue('office_id');
    const checkAllVip = this.props.form.getFieldValue('check_all_vip');

    if (officeId !== true && checkAllVip !== true) {
      this.props.form.setFieldsValue({
        location_ids: undefined,
      });
    } else {
      this.props.form.setFieldsValue({
        location_ids: true,
      });
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      this.ifToggleStatus(itemTitle, content, record);

      let locationIds = [];

      if (this.props.form.getFieldValue('check_all_vip')) {
        locationIds = this.props.form.getFieldValue('vip_location_ids');
      }
      if (this.props.form.getFieldValue('office_id')) {
        locationIds = [...locationIds, 44];
      }

      let formFields = this.props.form.getFieldsValue();

      formFields = Object.assign({}, formFields, {
        location_ids: locationIds,
      })

      if (itemTitle === '新增下級部門' || itemTitle === '新增下級職位' || itemTitle === '新增場館') {
        this.props.dispatch({
          type: 'architectureSetting/createData',
          payload: {
            type: content,
            postData: formFields,
          },
        });
      }

      if (itemTitle === '修改' || itemTitle === '編輯') {
        this.props.dispatch({
          type: 'architectureSetting/updateData',
          payload: {
            type: content,
            patchData: formFields,
            id: record.id,
          },
        });
      }

      if (itemTitle === '刪除') {
        this.props.dispatch({
          type: 'architectureSetting/deleteData',
          payload: {
            type: content,
            id: record.id,
          },
        });

        let body = document.getElementsByTagName('body');
        body.style.cssText = "";
      }
      this.setModalVisible();
    });
  }


  render() {
    const { itemTitle, content, record } = this.props;
    const { formatMessage } = this.props.intl;
    const beOK = formatMessage(messages['app.arch.operation.be_ok']);
    const beCancel = formatMessage(messages['app.arch.operation.be_cancel']);

    return (
      <div>
        {
          this.getModalTrigger()
        }

        <Modal
          title={itemTitle}
          wrapClassName={styles.verticalCenterModal}
          visible={this.state.modalVisible}
          okText={beOK}
          cancelText={beCancel}
          onOk={() => this.handleOk(itemTitle, content, record)}
          onCancel={() => this.setModalVisible(false)}
        >
          {
            this.getModal(itemTitle, this.props.form, this.props)
          }
        </Modal>
      </div>
    );
  }
}

OperationModal = createForm()(OperationModal);
OperationModal.propTypes = {
};

export default injectIntl(OperationModal);
