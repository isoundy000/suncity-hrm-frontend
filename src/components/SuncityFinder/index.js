import React, { PropTypes } from 'react';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import classes from './index.less';
import { HOST } from 'constants/APIConstants';

import SuncityFinderCategories from './SuncityFinderCategories';
import SuncityFinderFileList from './SuncityFinderFileList';
import FilePreviewModal from './FilePreviewModal';
import UploadFileModal from './UploadFileModal';

import classNames from 'classnames';

class SuncityFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategoriesModal: false,
      showUploadFileModal: false,
      currentCategory: null,
    }

  }


  showFiles() {
    const { files } = this.props;
    const { currentCategory } = this.state;
    const currentCategoryId = _.get(currentCategory, 'id', 0);

    if(currentCategoryId == 0) {
      return files;
    }else {
      return files.filter(file => file.categoryId == currentCategoryId);
    }
  }

  render() {
    const {
      categories, onCommitNewCategory, canDownLoadFile,
      onRowUpdate, onFileSubmit, onUpdateFileAttribute,
      onDownloadFile, onDeleteFile, onDeleteCategory,
      showPreviewModal, closePreviewModal, openPreviewModal, currentPreviewAttachmentUrl
    } = this.props;

    const files = this.showFiles();

    console.log('@@@@@@', this.props.currentUser);

    return (
      <div>
        {showPreviewModal
         ? <FilePreviewModal
             handleClose={closePreviewModal}
             fileUrl={currentPreviewAttachmentUrl}
           />
         : null
        }
        <div className={classes.header}>
          <SuncityFinderCategories
            allFilesCount={this.props.files.length}
            categories={categories}
            onCommitNewCategory={onCommitNewCategory}
            onDeleteCategory={onDeleteCategory}
            onRowUpdate={onRowUpdate}
            showModal={this.state.showCategoriesModal}
            currentCategory={this.state.currentCategory}
            onChangeCurrentCategory={(category) => {
                this.setState({
                  currentCategory: category
                })
              }}
            onCloseModal={() => {
                this.setState({showCategoriesModal: false})
              }}
          />

              <div className={classes.actions}>
                <span
                  className={classNames({ 'shouldNotShow': (this.props.readonly
                                                        ||  (this.props.dataType === 'applicantProfile' &&
                                                             this.props.region === 'macau' &&
                                                             this.props.currentUser.can.updateApplicantProfileInMACAU !== true)
                                                        ||  (this.props.dataType === 'applicantProfile' &&
                                                             this.props.region === 'manila' &&
                                                             this.props.currentUser.can.updateApplicantProfileInMANILA !== true)
                                                         || (this.props.dataType === 'profile' &&
                                                            this.props.region === 'macau' &&
                                                            this.props.currentUser.can.updateProfileInMACAU !== true)
                                                         || (this.props.dataType === 'profile' &&
                                                            this.props.region === 'manila' &&
                                                            this.props.currentUser.can.updateProfileInMANILA !== true)) })}
                >
                  <Button
                                      onClick={() => {
                                          this.setState({
                                            showUploadFileModal: true
                                          })
                                        }}
                                      className={classes.actionButton}
                                    >
                                      <Icon type="upload" /> 上傳文件
                                    </Button>
                </span>

                <span
                  className={classNames({ 'shouldNotShow': (this.props.readonly
                                                        ||  (this.props.dataType === 'applicantProfile' &&
                                                             this.props.region === 'macau' &&
                                                             this.props.currentUser.can.manageApplicantAttachmentTypeInMACAU !== true)
                                                         || (this.props.dataType === 'applicantProfile' &&
                                                             this.props.region === 'manila' &&
                                                             this.props.currentUser.can.manageApplicantAttachmentTypeInMANILA !== true)
                                                         || (this.props.dataType === 'profile' &&
                                                             this.props.region === 'macau' &&
                                                             this.props.currentUser.can.manageProfileAttachmentTypeInMACAU !== true)
                                                         || (this.props.dataType === 'profile' &&
                                                             this.props.region === 'manila' &&
                                                             this.props.currentUser.can.manageProfileAttachmentTypeInMANILA !== true)) })}
                >
                  <Button
                    onClick={() => this.setState({showCategoriesModal: true})}
                    className={classes.actionButton}
                  >
                    <Icon type="appstore" /> 管理類別
                  </Button>
                </span>
              </div>



        </div>

        <div className={classes.body}>
          {
            this.state.showUploadFileModal
            ? <UploadFileModal
                categories={categories}
                showModal={true}
                currentCategory={this.state.currentCategory}
                onCloseModal={() => {
                    this.setState({
                      showUploadFileModal: false
                    })
                  }}
                onSubmit={values => {
                    onFileSubmit(values);
                    this.setState({
                      showUploadFileModal: false
                    })
                  }}
              />
            : null
          }


          <SuncityFinderFileList
            readonly={this.props.readonly}
            files={files}
            categories={categories}
            onUpdateFileAttribute={onUpdateFileAttribute}
            onDownloadFile={onDownloadFile}
            onDeleteFile={onDeleteFile}
            canDownLoadFile={canDownLoadFile}
            openPreviewModal={openPreviewModal}
            region={this.props.region}
            dataType={this.props.dataType}
            currentUser={this.props.currentUser}
          />
        </div>
      </div>
    );
  }

}

SuncityFinder.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      chinese_name: PropTypes.string,
      english_name: PropTypes.string,
      files_count: PropTypes.number,
    })
  ).isRequired,
  files: PropTypes.array.isRequired,
  onFileSubmit: PropTypes.func.isRequired,
  onUpdateFileAttribute: PropTypes.func.isRequired,
  onDownloadFile: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
};

export default SuncityFinder;
