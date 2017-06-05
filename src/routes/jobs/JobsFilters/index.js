import React from 'react';
import YLemonBlock from 'components/YLemonBlock';
import YLemonBlockActionButton from 'components/YLemonBlock/Title/ActionButton';
import { Button, Icon, Row, Col, Form } from 'antd';
import SunCityAPISelect from 'components/SunCityAPISelect';

import classes from './index.less';
import AddActionIcon from '../assets/tianjiamianshi.png';

import classNames from 'classnames';

const FormItem = Form.Item;
import filterIcon from 'routes/applicant_profiles/assets/filter.png';

class JobsFilters extends React.Component{
  titleActions(){
    const actions = [
      {
        icon: AddActionIcon,
        title: '新增',
        onClick: () => {
          this.props.dispatch({type: 'jobs/addingNewJob'})
        }
      }
    ].map( action => (
      <span
        className={classNames({ 'shouldNotShow': ((this.props.region === 'macau' &&
                                                   this.props.currentUser.can.createJobInMACAU !== true)
                                               || (this.props.region === 'manila' &&
                                                   this.props.currentUser.can.createJobInMANILA !== true))})}
        key={action.title}
      >
        <YLemonBlockActionButton { ...action } key={action.title}/>
      </span>
    ));

    return (
      <div>
        {actions}
      </div>
    );
  }

  blockContent(){
    return (
      <div className={classes.jobsBlockContent}>
        <Form horizontal className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={7}>
              <FormItem
                label="所屬部門"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="departments"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'jobs/changeFilterDepartment',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={7}>
              <FormItem
                label="職級"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="grade"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'jobs/changeFilterGrade',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={7}>
              <FormItem
                label="狀態"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="jobState"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'jobs/changeFilterState',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={3}>
              <Button
                type="primary"
                htmlType="submit"
                className={classes['ant-btn']}
                onClick={ () => {
                    this.props.dispatch({
                      type: 'jobs/fetchJobsAction'
                    })
                  }}
              >
                <Icon type="search" />篩選
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const blockContent = this.blockContent();
    const actions = this.titleActions();

    return (
      <YLemonBlock
        icon={filterIcon}
        title={<span style={{fontSize: '14px', color: '#99a3b4', fontWeight: 'bold'}}>條件篩選</span>}
        content={blockContent}
        actions={actions}
      />
    );
  }
}

export default JobsFilters;
