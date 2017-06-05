import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import {Modal, Spin } from 'antd';
import SuncityFinder from 'components/SuncityFinder';
import classes from './index.less';

import {
  fetchCategoriesAndFiles,
  createNewCategory,
  updateCategory,
  deleteCategory,
  createFile,
  updateFile,
  downloadFile,
  deleteFile,
  previewFileUrl
} from 'services/finder';

class SuncityFinderSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      categories: null,
      files: null,
      showPreviewModal: false,
      currentPreviewAttachmentUrl: null,
    };
    this.fetchData(props.endpointType);
  }

  categoriesFilesCount(categories, files) {
    return categories.map((category) => {
      const filesBelongsToCategory = files.filter(file => {
        return file.categoryId == category.id;
      });

      return {
        ...category,
        files_count: filesBelongsToCategory.length
      };
    });
  }

  openPreviewModal(file) {
    let fileId = null;
    console.log(file);
    if(this.isCreate()) {
      fileId = file.uploadedFileId;
    }else {
      fileId = file.attachment.id;
    }

    const fileUrl = previewFileUrl(this.props.endpointType, fileId);

    this.setState({
      showPreviewModal: true,
      currentPreviewAttachmentUrl: fileUrl
    })
  }

  closePreviewModal() {
    this.setState({
      showPreviewModal: false,
      currentPreviewAttachmentUrl: null
    });
  }

  fetchData(endpointType) {
    if(!endpointType) {
      endpointType = this.props.endpointType;
    }

    fetchCategoriesAndFiles(endpointType).then(response => {
      const key = this.getCategoryKeyFrom(endpointType);

      let responseFiles = response.files;

      if(!endpointType.id) {
        responseFiles = this.state.files || [];
      }

      const files = responseFiles.map(file => ({
        categoryId: file.categoryId || file[key],
        ...file
      }));

      const categories = this.categoriesFilesCount(response.categories, files);

      this.setState({
        categories,
        files,
        loading: false
      });
    });
  }

  onCommitNewCategory(category) {
    console.log(this.props.currentUser);
    this.startLoading();
    createNewCategory(this.props.endpointType, category, this.props.currentUser.token).then(json => {
      this.fetchData();
    })
  }

  errorToDeleteCategory() {
    Modal.warning({
      title: '該分類不能被刪除!!!',
      content: '刪除分類的前提條件爲：所有求職者的附件中都沒有該分類的文件。',
    });
  }

  onDeleteCategory(category) {
    deleteCategory(this.props.endpointType, category.id).then(json => {
      if(json.err){
        this.errorToDeleteCategory();
      }
      this.fetchData()
    })
  }

  onRowUpdate(id, attributes) {
    this.startLoading();
    updateCategory(this.props.endpointType, id, attributes).then(json => {
      this.fetchData();
    });
  }

  getCategoryKeyFrom(endpointType) {
    let key = 'applicant_attachment_type_id';
    if(endpointType.type == 'profile') {
      key = 'profile_attachment_type_id';
    }

    return key;
  }

  isCreate() {
    return !this.props.endpointType.id;
  }

  onFileSubmit(values) {
    if(this.isCreate()) {
      const key = this.getCategoryKeyFrom(this.props.endpointType);
      let fileObject = {
        description: values.comment,
        file_name: values.fileName,
        uploaded_file_id: values.uploadedFileId,
        ...values
      };
      fileObject[key] = values.categoryId;

      const newFiles = this.state.files.concat([fileObject]);
      const newCategories = this.categoriesFilesCount(this.state.categories, newFiles);
      this.setState({
        files: newFiles,
        categories: newCategories
      });

      this.props.onFilesChange(newFiles);
    }else {
      this.startLoading();
      createFile(this.props.endpointType, values).then(json => {
        this.fetchData();
      });
    }
  }

  onUpdateFileAttribute(record, attributes) {
    this.startLoading();
    updateFile(this.props.endpointType, record.id, attributes).then(json => {
      this.fetchData();
    })
  }

  onDownloadFile(file) {
    downloadFile(this.props.endpointType, file.id, file.file_name);
  }

  onDeleteFile(fileForDelete) {
    if(this.isCreate()) {
      const fileToDeleteIndex = this.state.files.findIndex(file => {
        return file.file_name == fileForDelete.file_name;
      });

      const newFiles = update(this.state.files, {$splice: [[fileToDeleteIndex, 1]]});
      const newCategories = this.categoriesFilesCount(this.state.categories, newFiles);
      this.setState({
        files: newFiles,
        categories: newCategories
      });

      this.props.onFilesChange(newFiles);
    }else {
      deleteFile(this.props.endpointType, fileForDelete.id).then(json => {
        this.fetchData();
      });
    }

  }

  startLoading() {
    this.setState({
      loading: true
    });
  }

  endLoading() {
    this.setState({
      loading: false
    });
  }

  initialize() {
    return this.state.categories == null;
  }

  componentWillReceiveProps(props) {
    this.fetchData(props.endpointType);
  }

  canDownLoadFile() {
    return this.props.endpointType.id != null;
  }

  render() {
    return (
      <div className="panel">
        <div className="panel-heading">
          <div className="panel-title">相關文件</div>
        </div>
        <div className="panel-body">
          {(
             this.initialize()
           ? <div className={classes.centerSpin}>
          <Spin />
           </div>
           : <SuncityFinder
               categories={this.state.categories}
               files={this.state.files}
               onCommitNewCategory={::this.onCommitNewCategory}
               onRowUpdate={::this.onRowUpdate}
               onFileSubmit={::this.onFileSubmit}
               onDownloadFile={::this.onDownloadFile}
               onDeleteFile={::this.onDeleteFile}
               onUpdateFileAttribute={::this.onUpdateFileAttribute}
               onDeleteCategory={::this.onDeleteCategory}
               canDownLoadFile={this.canDownLoadFile()}
               openPreviewModal={::this.openPreviewModal}
               showPreviewModal={this.state.showPreviewModal}
               closePreviewModal={::this.closePreviewModal}
               currentPreviewAttachmentUrl={this.state.currentPreviewAttachmentUrl}
               readonly={this.props.readonly}
               currentUser={this.props.currentUser}
               region={this.props.region}
               dataType={this.props.dataType}
             />
           )}
        </div>
      </div>
    );
  }
}

SuncityFinderSection.propTypes = {
  endpointType: PropTypes.object.isRequired,
};

export default SuncityFinderSection;
