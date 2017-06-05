import React, { PropTypes} from 'react';
import { formatRailsTime } from 'helpers/utils';
import { Table, Button, Input, Icon, Modal, Popconfirm } from 'antd';
import InputEditable from 'components/ylemon-widgets/InputEditable';
import SelectEditable from 'components/ylemon-widgets/SelectEditable';
import _ from 'lodash';
import { injectIntl } from "react-intl";
import { definedMessages as messages } from "../../../locales/messages";

import classes from './index.less';

function showConfirm({ok}) {
  confirm({
    title: '確認刪除文件？',
    content: '文件刪除之後無法恢復。',
    onOk: ok,
    onCancel() {},
  });
}

function SuncityFinderFileList({
  intl, files, categories, canDownLoadFile,
  onUpdateFileAttribute, onDeleteFile, onDownloadFile,
  openPreviewModal, readonly, region, dataType, currentUser 
}) {

  const { formatMessage } = intl;
  const noSelect = formatMessage(messages['app.suncity_finder_file_list.no_select']);
  const columns = [
    {
      chinese_name: '類別',
      english_name: 'Category',
      dataIndex: 'category.chinese_name',
      render: (text, record) => {
        return (
          <SelectEditable
            className={classes.selectEditable}
            key={record.id}
            select={{
              options: categories.map(category => ({
                ...category,
                key: category.id
              }))
            }}
            value={record.categoryId === null ? noSelect : `${record.categoryId}`}
            onSave={(value) => {
              onUpdateFileAttribute(record, {
                categoryId: value
              })
            }}
            disabled={readonly}
          />
        )
      }
    },
    {
      chinese_name: '文件名',
      english_name: 'File Name',
      width: 200,
      dataIndex: 'file_name',
    },
    {
      chinese_name: '備註',
      english_name: 'Remark',
      dataIndex: 'description',
      render: (text, record) => {
        return (
          <InputEditable
            className={classes.inputEditable}
            key={record.id}
            value={text}
            disabled={readonly}
            onSave={(value) => {
              onUpdateFileAttribute(record, {
                comment: value
              })
            }}
          />
        );
      }
    },
    {
      chinese_name: '創建時間',
      english_name: 'Created At',
      dataIndex: 'created_at',
      render: (text, record) => {
        return formatRailsTime(text);
      }
    },
    {
      chinese_name: '經手人',
      english_name: 'Creator',
      dataIndex: 'creater_id',
    },
    {
      chinese_name: '操作',
      english_name: 'Actions',
      render: (text, record) => {
        const canPreview = true;

        return (
          <div className={classes.icons}>
            {canDownLoadFile
              ? <Icon type="arrow-down" className={classes.icon} onClick={() => onDownloadFile(record)}/>
              : null
            }

            {
              readonly
              || (dataType === 'profile' &&
                  region === 'macau' &&
                  currentUser.can.updateProfileInMACAU !== true)
              || (dataType === 'profile' &&
                  region === 'manila' &&
                  currentUser.can.updateProfileInMANILA !== true)
              || (dataType === 'applicantProfile' &&
                  region === 'macau' &&
                  currentUser.can.updateApplicantProfileInMACAU !== true)
              || (dataType === 'applicantProfile' &&
                  region === 'manila' &&
                  currentUser.can.updateApplicantProfileInMANILA !== true)
              ? null : <Popconfirm
              title="確認刪除文件？無法恢復。"
              onConfirm={() => {
                onDeleteFile(record);
              }}
              okText="確定"
              cancelText="取消"
            >
              <Icon className={classes.icon} type="delete" />
            </Popconfirm> 
            }

            {
              canPreview
              ? <Icon
                  type="eye"
                  className={classes.icon}
                  onClick={() => {
                    openPreviewModal(record)
                  }}
                />
              : null
            }
          </div>
        );
      }
    },
  ].map(column => {
    return {
      title: column.chinese_name,
      key: column.dataIndex,
      ...column,
    }
  }).filter(column => {
    if (readonly && column.english_name == 'Actions') {
      return false;
    }

    return true;
  });

  return (
    <div className={classes.files}>
      <Table
        locale={{emptyText:"暫無數據"}}
        pagination={false}
        columns={columns}
        dataSource={files}
      />
    </div>
  );
}

SuncityFinderFileList.propTypes = {
  files: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  onUpdateFileAttribute: PropTypes.func.isRequired,
  onDownloadFile: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
}

export default injectIntl(SuncityFinderFileList);
