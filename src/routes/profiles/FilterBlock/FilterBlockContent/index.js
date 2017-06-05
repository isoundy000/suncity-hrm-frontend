import React from 'react';
import { injectIntl } from 'react-intl';
import { Icon, Menu, Dropdown, Row, Col, Form, Input, Button, Select } from 'antd';
import YLemonSearchInput from 'components/YLemonSearchInput';
import ChangeColumnsModal from 'components/SelectColumnsTemplate/ChangeColumnsModal';
import classNames from 'classnames';
import classes from './index.less';
import { getMessage } from 'locales/messages';

class FilterBlockContent extends React.Component{
  state =  {
    status: { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
    subStatus: { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
    subLocaStatus: { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},

  }

  render() {
    let { locationsList, editingExportingColumns, tableFields, subLocations } = this.props.profiles;
    const { formatMessage } = this.props.intl;
    const { dispatch } = this.props;
    let anyLocation = locationsList.find(item => item.id === null);
    let locations = locationsList.filter(item => !item.parent_id);
    /* let subLocations = locationsList.filter(item => item.parent_id);*/

    console.log('~~~~~~~~~~~~~~~~~', locationsList);


    /* if (this.props.profiles.selectedLocation.id !== null) {
     *   subLocations = subLocations.filter(
     *     item => item.parent_id === this.props.profiles.selectedLocation.id
     *   );
     * }
     * subLocations = [anyLocation].concat(subLocations);
     */
    const subLocationList = [
      { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
      ...subLocations,
    ];

    const targetKeys = tableFields.map(field => field.key).filter(field_key => field_key != 'photo');

    const statusList = [
      { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
      { chinese_name: '在職', english_name: 'In Service', id: 'in_service'},
      { chinese_name: '離職', english_name: 'Dimiss', id: 'dimiss'},
    ];

    const inServiceList = [
      { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
      { chinese_name: '總裁級', english_name: 'President', id: 'president'},
      { chinese_name: '總監級', english_name: 'Director', id: 'director'},
      { chinese_name: '正式員工', english_name: 'Formal Employees', id: 'formal_employees'},
      { chinese_name: '非正式員工', english_name: 'Informal Employees', id: 'informal_employees'},
      { chinese_name: '兼職', english_name: 'Part Time', id: 'part_time'},
      { chinese_name: '實習生', english_name: 'Trainee', id: 'trainee'},
    ];

    const dimissList = [
      { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
      { chinese_name: '總裁級', english_name: 'President', id: 'resigned_president'},
      { chinese_name: '總監級', english_name: 'Director', id: 'resigned_director'},
      { chinese_name: '離職', english_name: 'Resigned', id: 'resigned'},
    ];

    let statusDetailList = [];

    console.log(this.state.status, this.props);

    if (this.state.status.id === 'in_service') {
      statusDetailList = inServiceList;
    } else if (this.state.status.id === 'dimiss') {
      statusDetailList = dimissList;
    } else {
      statusDetailList = [
        { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
      ];
    }

    return (
      <div className={classes.personalFileListFilter}>
        {
          editingExportingColumns
          ? <ChangeColumnsModal
              title="選擇匯出列"
              confirmButtonTitle="匯出"
              type="profile"
              targetKeys={targetKeys}
              handleCancel={() => {
                  dispatch({
                    type: 'profiles/hideExportModal'
                  });
                }}
              handleSubmit={({targetKeys}) => {
                  dispatch({
                    type: 'profiles/startFilter',
                    payload: {
                      select_columns: targetKeys,
                      exportExcel: true,
                    }
                  });
                }}
            />
          : null
        }

        <Form horizontal={true} className={classes['ant-advanced-search-form']}>
          <Row gutter={16} className={classes['ant-row']}>
            <Col sm={9}>
              <Form.Item
                label="場館"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <YLemonSearchInput
                  dataSource={locations}
                  value={this.props.profiles.selectedLocation}
                  onChange={(value) => {
                      dispatch({
                        type: 'profiles/selectLocation',
                        payload: value
                      })

                      dispatch({
                        type: 'profiles/setSubLocations',
                        payload: {
                          subLocations: locationsList.filter(l => l.parent_id && l.parent_id === value.id),
                        }
                      })

                      this.setState({
                        subLocaStatus: { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
                      })

                    }}
                  className={classNames(classes.filterSelect, 'ant-select')}
                  />

                  <YLemonSearchInput
                    dataSource={subLocationList}
                    value={this.state.subLocaStatus}
                    onChange={(value) => {
                        dispatch({
                          type: 'profiles/selectSubLocation',
                          payload: value
                        })

                        this.setState({
                          subLocaStatus: value,
                        })
                      }}
                    className={classNames(classes.filterSelect, 'ant-select')}
                  />
                </Form.Item>
              </Col>

              <Col sm={6}>
                <Form.Item
                  label="公司"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <YLemonSearchInput
                    dataSource={[
                      { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
                      { chinese_name: '太陽城博彩中介一人有限公司', english_name: 'SUN CITY GAMING PROMOTION COMPANY LIMITED', id: 'suncity_gaming_promotion_company_limited' },
                      { chinese_name: '太陽城集團商業顧問有限公司', english_name: 'SUNCITY GROUP COMMERCIAL CONSULTING', id: 'suncity_group_commercial_consulting' },
                      { chinese_name: '太陽城集團旅遊有限公司', english_name: 'SUNCITY GROUP TOURISM LIMITED', id: 'suncity_group_tourism_limited' },
                      { chinese_name: '天貿易行', english_name: '天貿易行', id: 'tian_mao_yi_hang' }
                    ]}
                    value={this.props.profiles.selectedCompany}
                    placeholder="请选择公司"
                    onChange={(value) => {
                        dispatch({
                          type: 'profiles/selectCompany',
                          payload: value
                        })
                      }}
                    className={classNames(classes.filterSelectFull, 'ant-select')}
                  />
                </Form.Item>
              </Col>

              <Col sm={9}>
                <Form.Item
                  label="狀態"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >

                  <YLemonSearchInput
                    dataSource={statusList}
                    value={this.state.status}
                    placeholder="請選擇狀態"
                    onChange={(value) => {
                        console.log('value', value);
                        this.setState({
                          status: value,
                        })

                        const trueValue = value.id === null ?
                                          { chinese_name: '不限', english_name: 'NOT LIMITED', id: null} :
                                          value;
                        dispatch({
                          type: 'profiles/selectEmploymentStatus',
                          payload: trueValue
                        })

                        this.setState({
                          subStatus: { chinese_name: '不限', english_name: 'NOT LIMITED', id: null},
                        })
                      }}
                    className={classNames(classes.filterSelect, 'ant-select')}
                  />

                  <YLemonSearchInput
                    dataSource={statusDetailList}
                    value={this.state.subStatus}
                    placeholder="請選擇狀態"
                    onChange={(value) => {
                        console.log('value', value);
                        this.setState({
                          subStatus: value,
                        })

                        const trueValue = value.id === null ?
                                          this.state.status :
                                          value;
                        dispatch({
                          type: 'profiles/selectEmploymentStatus',
                          payload: trueValue,
                        })
                      }}
                    className={classNames(classes.filterSelect, 'ant-select')}
                  />

                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={classes['ant-row']}>
              <Col sm={9}>
                <Form.Item
                  label="部門"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  <YLemonSearchInput
                    dataSource={this.props.profiles.departmentsList}
                    value={this.props.profiles.selectedDepartment}
                    onChange={(value) => {
                        dispatch({
                          type: 'profiles/selectDepartment',
                          payload: value
                        })
                      }}
                    placeholder="請選擇部門"
                    className={classNames(classes.filterSelect, 'ant-select')}
                  />
              </Form.Item>
            </Col>

            <Col sm={6}>
              <Form.Item
                label="職位"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                <YLemonSearchInput
                  dataSource={this.props.profiles.positionsList}
                  value={this.props.profiles.selectedPosition}
                  onChange={(value) => {
                      dispatch({
                        type: 'profiles/selectPosition',
                        payload: value
                      })
                    }}
                  placeholder="請選擇職位"
                  className={classNames(classes.filterSelectFull, 'ant-select')}
                />
              </Form.Item>
            </Col>

            <Col sm={9}>
              <Form.Item
                label="職級"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <YLemonSearchInput
                  dataSource={[
                    { chinese_name: '不限', english_name: 'NOT LIMITED', id: null },
                    { chinese_name: '1', english_name: '1', id: '1' },
                    { chinese_name: '2', english_name: '2', id: '2' },
                    { chinese_name: '3', english_name: '3', id: '3' },
                    { chinese_name: '4', english_name: '4', id: '4' },
                    { chinese_name: '5', english_name: '5', id: '5' },
                    { chinese_name: '6', english_name: '6', id: '6' },
                  ]}
                  value={this.props.profiles.selectedGrade}
                  onChange={(value) => {
                      dispatch({
                        type: 'profiles/selectGrade',
                        payload: value
                      })
                    }}
                  placeholder="请选择職級"
                  className={classNames(classes.filterSelect, 'ant-select')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col className={classes.filterBtn}>
              <Button
                type="primary"
                htmlType="submit"
                className={classes['ant-btn']}
                onClick={() => {
                    dispatch({
                      type: 'profiles/startFilter'
                    });
                  }}
              >
                <Icon type="search" />{formatMessage(getMessage('app.button.filter'))}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}


export default Form.create()(injectIntl(FilterBlockContent));
