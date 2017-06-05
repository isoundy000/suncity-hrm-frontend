import React from 'react';
import { Form, Modal } from 'antd';
import JobForm from '../JobForm';
import _ from 'lodash';

import classes from '../index.less';

class NewJobModal extends React.Component {
  render() {
    return(
      <Modal
        okText="確認"
        title="修改职位"
        visible={true}
        className={classes.jobModal}
        onCancel={() => {
          this.props.dispatch({type: 'jobs/endEditingJob'})
        }}
        onOk={() => {
          this.props.form.validateFields((error, value) => {
            if(!error){
              this.props.dispatch({
                type: 'jobs/editJob',
                payload: {
                  ...value,
                  department_id: _.get(value, 'department_id.id', value),
                  grade:  _.get(value, 'grade.id', value),
                  position_id: _.get(value, 'position_id.id', value),
                }
              });
            }
          });
        }}
      >
        <JobForm
          form={this.props.form}
          job={this.props.job}
        />
      </Modal>
    );
  }
}

export default Form.create()(NewJobModal);
