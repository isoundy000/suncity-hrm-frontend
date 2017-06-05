import React from 'react';
import SearchModal from './SearchModal';
import YLemonBlock from 'components/YLemonBlock';
import YLemonBlockActionButton from 'components/YLemonBlock/Title/ActionButton';
import { Button, Icon, Row, Col, Form, Input, Menu, Dropdown, Spin } from 'antd';
import SunCityAPISelect from 'components/SunCityAPISelect';
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe.js'
import ChangeColumnsModal from 'components/SelectColumnsTemplate/ChangeColumnsModal';

import classes from './index.less';
import AddActionIcon from 'routes/jobs/assets/tianjiamianshi.png';
import ExportActionIcon from '../assets/daochu_hover.png';

import filterIcon from '../assets/filter.png';

import classNames from 'classnames';

const FormItem = Form.Item;

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('yyyy mm dd')
class ApplicantProfilesFilter extends React.Component{
  titleActions(){
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={() => {
              this.props.dispatch({type: 'applicantProfiles/toggleShowSearchModal'})
            }}>檢索求職者</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={() => {
              this.props.dispatch({type: 'applicantProfiles/addingNewApplicantProfile'})
            }}>直接新增</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>

        <span
          className={classNames({ 'shouldNotShow': ((this.props.region === 'macau' &&
                                                     this.props.currentUser.can.createApplicantProfileInMACAU !== true)
                                                 || (this.props.region === 'manila' &&
                                                     this.props.currentUser.can.createApplicantProfileInMANILA !== true)) })}
        >
          <Dropdown
            overlay={menu}
            trigger={['click']}
          >
            <YLemonBlockActionButton
              icon={AddActionIcon}
              title="新增"
              onClick={() => {}}
            />
          </Dropdown>
        </span>

        <YLemonBlockActionButton
          icon={ExportActionIcon}
          title="匯出"
          onClick={() => {
              this.props.dispatch({
                type: 'applicantProfiles/toggleEditingExportingColumns'
              });
            }}
        />
      </div>
    );
  }

  blockContent(){
    const { showSearchModal, dispatch, advanceSearch, editingExportingColumns, tableFields } = this.props;
    const targetKeys = tableFields
                        .map(field => field.key)
                        .filter(field_key =>
                          [
                            'photo', 'apply_position', 'apply_department', 'apply_source', 'apply_date', 'apply_status'
                          ].indexOf(field_key) == -1
                        );
console.log(targetKeys);
    return (
      <div className={classes.filterBlockContent}>
        {
          editingExportingColumns
            ? <ChangeColumnsModal
                title="選擇匯出列"
                confirmButtonTitle="匯出"
                type="applicant_profile"
                targetKeys={targetKeys}
                handleCancel={() => {
                  dispatch({
                    type: 'applicantProfiles/toggleEditingExportingColumns'
                  });
                }}
                handleSubmit={({targetKeys}) => {
                  dispatch({
                    type: 'applicantProfiles/fetchProfiles',
                    payload: {
                      select_columns: targetKeys,
                      exportExcel: true,
                    }
                  });
                }}
            />
            : null
        }
        <Form horizontal className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
                label="應徵部門"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="departments"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'applicantProfiles/changeFilterDepartment',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={8}>
              <FormItem
                label="應徵職位"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="positions"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'applicantProfiles/changeFilterPosition',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={8}>
              <FormItem
                label="申請途徑"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="applicationProfileSource"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'applicantProfiles/changeFilterSource',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
                label="申請日期"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <MaskedInput
                  className="mask-input"
                  type="text"
                  mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
                  ref={c => this.input = c}
                  keepCharPositions={true}
                  placeholder="____/__/__"
                  pipe={autoCorrectedDatePipe}
                  guide={true}
                  onChange={e => {
                      const value = e.target.value;
                      this.props.dispatch({
                        type: 'applicantProfiles/setQueryCreatedAt',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={8}>
              <FormItem
                label="求職進度"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
              >
                <SunCityAPISelect
                  type="applicantPositionState"
                  onChange={(value) => {
                      this.props.dispatch({
                        type: 'applicantProfiles/changeFilterState',
                        payload: value
                      });
                    }}
                />
              </FormItem>
            </Col>

            <Col sm={8}>
              <Button
                type="primary"
                htmlType="submit"
                className={classes['ant-btn']}
                onClick={ () => {
                    this.props.dispatch({
                      type: 'applicantProfiles/clearAdvanceSearchThenFetchProfiles'
                    })
                  }}
              >
                <Icon type="search" />篩選
              </Button>
              {(showSearchModal
               ? <SearchModal dispatch={dispatch} advanceSearch={advanceSearch}/>
               : null
               )}
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
      <Spin
        tip="Exporting..."
        spinning={this.props.exportExcel}
      >
        <YLemonBlock
          icon={filterIcon}
          title={<span style={{fontSize: '14px', color: '#99a3b4', fontWeight: 'bold'}}>條件篩選</span>}
          content={blockContent}
          actions={actions}
        />
      </Spin>
    );
  }
}

export default ApplicantProfilesFilter;
