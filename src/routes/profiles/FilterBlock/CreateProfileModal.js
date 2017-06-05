import React from 'react';
import { Modal, Button, Input } from 'antd';

class CreateProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idNumber: '',
    };
  }
  render () {
    const {
      message,
      dispatch,
      loading,
    } = this.props;

    const handleNext = () => {
      if(message) {
        dispatch({
          type: 'profiles/queryUserIdCardNumberNext'
        });
      }else {
        dispatch({
          type: 'profiles/queryUserIdCardNumber',
          payload: this.state.idNumber
        });
      }
    }

    return (
      <Modal
        title="新增檔案"
        visible
        onCancel={() => {
          dispatch({
            type: 'profiles/hideCreateProfileModal'
          });

          dispatch({
            type: 'profiles/clearQueryUserIdState'
          });
        }}
        footer={[
          <Button
            key="next"
            type="primary"
            size="large"
            loading={loading}
            onClick={() => {
              handleNext()
            }}
          >
            下一步
          </Button>,
        ]}
      >
        {
          message
          ? <span>{message}</span>
          :<Input
            placeholder="請輸入新增員工證件號碼"
            disabled={loading}
            onChange={(e) => {
              this.setState({idNumber: e.target.value})
            }}
          />
        }

      </Modal>
    );
  }
}

export default CreateProfileModal;
