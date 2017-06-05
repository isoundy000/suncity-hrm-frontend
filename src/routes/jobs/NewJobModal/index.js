import React from 'react';
import { Form, Modal } from 'antd';
import JobForm from '../JobForm';
import classes from '../index.less';

class NewJobModal extends React.Component {
  render() {
    return(
      <Modal
        okText="確認"
        title="新建职位"
        visible={true}
        className={classes.jobModal}
        onCancel={() => {
          this.props.dispatch({type: 'jobs/endAddingNewJob'})
        }}
        onOk={() => {
          this.props.form.validateFields((error, value) => {
            if(!error){
              console.log(value);
              this.props.dispatch({
                type: 'jobs/createJob',
                payload: {
                  ...value,
                  department_id: value.department_id.id,
                  grade: value.grade.id,
                  position_id: value.position_id.id,
                }
              });
            }
          });
        }}
      >
        <JobForm form={this.props.form}/>
      </Modal>
    );
  }
}

export default Form.create()(NewJobModal);
