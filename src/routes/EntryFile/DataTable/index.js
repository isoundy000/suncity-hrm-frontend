import React, { PropTypes } from "react";

import SMSModal from "../SMSModal";
import { Table } from "antd";
import YLemonFieldText from "components/ylemon-widgets/YLemonFieldText";
import { injectIntl } from "react-intl";
import smsSentImg from "./assets/smsSent.png";
import styles from "./index.less";

class DataTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnRowClick = (record, index) => {
    const clickKey = this.clickKey(record.id);
    const lastClickTime = this.state[clickKey];

    if (lastClickTime === undefined) {

    } else {

      const nowTime = new Date().getTime();

      //上次点击500ms以内 认为是双击
      if (nowTime - lastClickTime < 500) {
        this.props.dispatch({
          type: 'entryFile/redirectTo',
          payload: {
            id: record.id,
          },
        });
      }
    }

    let timeState = {};
    timeState[clickKey] = new Date().getTime();
    this.setState(timeState);
  }

  clickKey(id) {
    return id + 'clicked';
  }

  render() {
    const { entryFile, dispatch, ...props } = this.props;
    let allColumns = new Array();

    if (entryFile.appendFields !== null && entryFile.fields !== null) {
      let appendColumns = new Array();
      entryFile.appendFields.map((type) => {
        appendColumns.push(
          {
            title: type['chinese_name'],
            dataIndex: type['english_name'],
            key: type['english_name'],
            width: 100,
            render: (text, record) => {
              return record.filled_attachment_types.indexOf(type.id) != -1 ?
                     <span>已提交</span> : <span className={styles.unCommit}>未提交</span>
            }
          }
        );
      });

      let columns = new Array();
      //将 photo 列放到第一列
      let newFields = new Array();
      newFields.push(entryFile.fields[4]);
      newFields = newFields.concat(entryFile.fields.slice(0, 4));
      newFields.map((field, index) => {
        if (index === 0) {
          columns.push(
            {
              title: '',
              dataIndex: field[0],
              key: 'sent',
              width: 50,
              render: (text, record) => {
                return (
                  <div>
                    <span>
                      <img style={{
                        width: '20px',
                        height: '20px',
                        display: record.attachment_missing_sms_sent == true ? 'inline-block' : 'none'
                      }} src={smsSentImg} />
                    </span>
                  </div>
                )
              }
            }
          )
        }
        if (field[0] == 'photo') {
          columns.push(
            {
              title: field[1],
              width: 50,
              render: (field) => {
                if (field) {
                  let fieldClasses = styles.headerImage;
                  const item = {
                    chinese_name: "照片",
                    dataIndex: "photo",
                    english_name: "Photo",
                    key: "photo",
                    required: false,
                    type: 'image',
                    value: field.photo,
                  };
                  return (
                    <YLemonFieldText field={item} className={fieldClasses} disableLoadingOptions />
                  )
                }
              },
            }
          )
        }
        else {
          columns.push(
            {
              title: field[1],
              dataIndex: field[0],
              key: field[0],
              width: 100,
            }
          )
        }

      });
      allColumns = columns.concat(appendColumns);
    }

    if (allColumns.length > 0) {
      allColumns = allColumns.concat(
        [{
          title: '',
          width: 100,
          className: 'sms-button',
          key: 'sms',
          render: (text, record) => {
            return (
              <SMSModal
                entryFile={entryFile}
                dispatch={dispatch}
                record={record}
                {...props}
                />
            )
          }
        }]
      );
    }
    console.log(entryFile.tableDate);

    return (
      <div className={styles.container}>
        <Table
          locale={{emptyText:"暫無數據"}}
          columns={allColumns}
          dataSource={entryFile.tableDate}
          pagination={false}
          rowClassName={(record) => record.chinese_name}
          onRowClick={this.handleOnRowClick}
          />
      </div>
    );

  }
}

export default DataTable;
