import _ from 'lodash';
import React, { Component } from 'react';
import classes from './index.less';
import { Table, Row, Col, Button } from 'antd';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';

import deleteImg from './assets/delete.png';
import addImg from './assets/xinjianmoban.png';
import noFilterImg from './assets/wushaixuan.png';
import noResultImg from './assets/wujieguo.png';

export class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRowClick(record){
    const clickKey = this.clickKey(record.id);
    const lastClickTime = this.state[clickKey];

    if(lastClickTime === undefined){

    }else{

      const nowTime = new Date().getTime();
      //上次点击500ms以内 认为是双击
      if(nowTime - lastClickTime < 500){
        this.props.handleRowDoubleClick(record);
      }
    }

    let timeState = {};
    timeState[clickKey] = new Date().getTime();
    this.setState(timeState);
  }

  clickKey(id){
    return id + 'clicked';
  }

  render() {
    let { tableData, tableFields, deleteCol, type } = this.props;
    console.log('type', this.props);

    let tableColumns = tableFields;

    let theColumns = [];

    tableColumns.forEach((item) => {
      if (item.canDelete) {
        theColumns.push(
          Object.assign(
            {}, item, {
              title: (
                <span className={classes.tableHeader}>
                  {item.name}
                  <img src={deleteImg} onClick={() => deleteCol(item.key)} role="presentation" />
                </span>
              ),
              render: (field, record, index) => {
                if (field) {
                  return <YLemonFieldText field={field} disableLoadingOptions />
                } else {
                  return field;
                }
              },
            }
          )
        );
      } else {
        theColumns.push(
          Object.assign(
            {}, item, {
              title: <span className="tableHeader">{item.name}</span>,
              render: (field, record, index) => {
                if (field) {
                  /* console.log('$$$$$$$$$$$$$$$', field);*/
                  let fieldClasses = null;

                  if(field.key == 'photo') {
                    fieldClasses = classes.headerImage;
                  }

                  if(this.props.startSearch && this.props.search_data && (this.props.search_type.indexOf(field.key) !== -1 || (this.props.search_type === 'id_card_number' && field.key === 'id_number'))) {
                    fieldClasses = classes.searchedHighLight;
                    let fieldBefore = {},
                        fieldHighLight = {},
                        fieldAfter = {};
                    Object.assign(fieldBefore, field);
                    Object.assign(fieldHighLight, field);
                    Object.assign(fieldAfter, field);

                    const searchDatas = Array.isArray(this.props.search_data) ? this.props.search_data : [this.props.search_data];

                    for (const searchData of searchDatas) {

                      const fieldSplitPlace = field.value.toUpperCase().indexOf(searchData.toUpperCase());

                      console.log('!@#$%^&*()_+!@#$%^&*()_+!@#$%^&*()_+', field, searchData, fieldSplitPlace);

                      if (fieldSplitPlace >= 0) {
                        fieldBefore.value = field.value.substring(0, fieldSplitPlace);
                        fieldHighLight.value = field.value.substr(fieldSplitPlace, searchData.length);
                        fieldAfter.value = field.value.substr(fieldSplitPlace + searchData.length);

                        console.log('hello~~~', fieldBefore, fieldHighLight, fieldAfter);

                        return (
                          <div>
                            <YLemonFieldText field={fieldBefore} disableLoadingOptions />
                            <YLemonFieldText field={fieldHighLight} className={fieldClasses} disableLoadingOptions />
                            <YLemonFieldText field={fieldAfter} disableLoadingOptions />
                          </div>
                        )
                      }
                    }
                  }

                  return (
                    <YLemonFieldText field={field} className={fieldClasses} disableLoadingOptions />
                  )
                } else {
                  return field;
                }
              },
            }
          )
        );
      }
    });

    if(type == 'applicantProfiles') {
      theColumns.push({
        title: "操作",
        render: (field, record, index) => {
          return (
            <Button onClick={() => this.props.handleMergeButtonClick(record)}>匯入</Button>
          );
        }
      });
    }

    tableData = tableData.map(data => {
      return _.mapValues(data, (value, key) => {
        const field = tableFields.find(field => field.key === key);
        if (field) {
          return {
            ...field,
            value: value,
          };
        } else {
          return value;
        }
      });
    });

    if (!this.props.filterSearchStart) {
      return (
        <div className={classes.filterNotStart}>
          <img src={noFilterImg} alt=""/>
          <p>尚未開始篩選</p>
        </div>
      )
    }

    if(this.props.loadingProfiles){
      return (
        <div className={classes.filterNotStart}>
          <img src={noFilterImg} alt=""/>
          <p>拼命加載中</p>
        </div>
      )
    }

    if (!tableData.length) {
      return (
        <div className={classes.filterNotStart}>
          <img src={noResultImg} alt=""/>
          <p>篩選無結果</p>
        </div>
      )
    }

    return (
      <Row className={classes.userTable}>
        <Col span={24}>
          <section className={classes.listTable}>
            <Table
              locale={{emptyText:"暫無數據"}}
              columnData={tableColumns}
              columns={theColumns}
              dataSource={tableData}
              bordered
              size="middle"
              pagination={false}
              className={classes.tableSec}
              loading={this.props.loading}
              onRowClick={::this.handleRowClick}
            />
          </section>
        </Col>
      </Row>

    );
  }
}

ListTable.propTypes = {
  tableData: React.PropTypes.array.isRequired,
  tableFields: React.PropTypes.array.isRequired,
};

export default ListTable;
