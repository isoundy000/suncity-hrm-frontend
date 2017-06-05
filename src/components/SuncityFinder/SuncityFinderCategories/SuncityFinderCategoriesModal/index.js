import React, { PropTypes } from 'react';
import { Table, Button, Input, Modal } from 'antd';
import _ from 'lodash';
import { List, Map } from 'immutable';
import InputEditable from 'components/ylemon-widgets/InputEditable';
import classes from './index.less';

class SuncityFinderCategoriesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: List(props.categories)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      categories: List(props.categories)
    })
  }

  listTable() {
    const columns = [
      {
        chinese_name: '中文名稱',
        english_name: 'Chinese Name',
        dataIndex: 'chinese_name',
        editable: true,
      },
      {
        chinese_name: '英文名稱',
        english_name: 'English Name',
        dataIndex: 'english_name',
        editable: true,
        width: 220
      },
      {
        chinese_name: '文件數',
        english_name: 'Files Count',
        dataIndex: 'files_count',
        editable: false,
        width: 63
      },
      {
        chinese_name: '操作',
        english_name: 'Actions',
        render: (text, record) => {
          if(record.id == 0) {
            return (
              <div>
                <Button onClick={::this.commitNewRow}>增加</Button>
                <Button onClick={::this.removeNewRow}>取消</Button>
              </div>
            );
          }else {
            return (
              <div>
                <Button onClick={() => {
                  this.removeRow(record)
                }}>删除</Button>
              </div>
            )
          }
        }
      }
    ].map(column => {
      const title = column.chinese_name;
      let render = column.render;

      if(!render && column.editable) {
        render = (text, record) => {
          if(record.id == 0) {
            return (
              <Input
                onChange={(e) => {
                    const value = e.target.value;
                    let attributes = {};
                    attributes[column.dataIndex] = value;
                    this.updateNewRowAttributes(attributes);
                  }}
              />
            )
          }

          console.log(text, record.chinese_name);

          return (
            <InputEditable
              value={record[column.dataIndex]}
              className={classes.inputEditable}
              onSave={(value) => {
                  let attributes = {};
                  attributes[column.dataIndex] = value;
                  this.updateRowAttributes(record, attributes);
                }}
            />
          );
        }
      }

      return {
        ...column,
        render,
        title,
      };
    });


    console.log('type', this.state.categories.toArray());
    console.log('column', columns);

    /* const data = this.state.categories.toArray();*/
    const data = this.state.categories.toArray().sort((t1, t2) => {
      return (t1.id - t2.id > 0 && t1.id !== 0 && t2.id !== 0);
    });;

    console.log('data', data);
    console.log('column', columns);

    return (
      <Table
        locale={{emptyText:"暫無數據"}}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  }

  addNewRow() {
    const newCategory = {
      id: 0,
      chinese_name: '',
      english_name: '',
    };

    this.setCategories(this.state.categories.push(newCategory));
  }

  updateNewRowAttributes(attributes) {
    const newRowIndex = this.findCategoryIndexWithId(0);
    const newCategories = this.state.categories.update(newRowIndex, (category) => (
      _.merge(category, attributes)
    ));

    this.setCategories(newCategories);
  }

  updateRowAttributes(row, attributes) {
    this.props.onRowUpdate(row.id, attributes);
  }

  findCategoryIndexWithId(id) {
    return this.state.categories.findIndex(category => {
      return category.id == id;
    });
  }

  removeNewRow() {
    const newRowIndex = this.findCategoryIndexWithId(0);
    this.setCategories(this.state.categories.delete(newRowIndex));
  }

  commitNewRow() {
    const newRowIndex = this.findCategoryIndexWithId(0);
    const newRow = this.state.categories.get(newRowIndex);
    this.props.onCommitNewCategory(newRow);
  }

  removeRow(row) {
    console.log(row);
    this.props.onDeleteCategory(row);
  }

  hasNewRow() {
    return this.findCategoryIndexWithId(0) != -1;
  }

  setCategories(categories) {
    this.setState({
      categories
    });
  }

  render() {
    const listTable = this.listTable();
    return (
      <Modal
        okText="確認"
        title="分類管理"
        visible={this.props.showModal}
        onOk={this.props.onCloseModal}
        onCancel={this.props.onCloseModal}
      >
        <div className={classes.categoriesModal}>
          {listTable}
          <Button
            onClick={::this.addNewRow}
            disabled={this.hasNewRow()}
          >
            增加一行
          </Button>
        </div>
      </Modal>
    );
  }
}

SuncityFinderCategoriesModal.propTypes = {
  categories: PropTypes.array.isRequired,
  onCommitNewCategory: PropTypes.func.isRequired,
  onRowUpdate: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
};

export default SuncityFinderCategoriesModal;
