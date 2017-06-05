import React, { PropTypes } from 'react';
import { Icon } from 'antd';
import classes from './index.less';
import { fetchFileHeaders } from 'services/finder';

import ImageDisplayer from './ImageDisplayer';
import PdfDisplayer from './PdfDisplayer';
import ErrorDisplayer from './ErrorDisplayer';

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

class FilePreviewModal extends React.Component {
  static propTypes = {
    fileUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      fetchingFileHeader: false,
      displayer: null,
    };

    this.setRenderContentType();
  }

  componentWillMount() {
    addClass(document.body, 'modal-opened');
  }

  componentWillUnmount() {
    removeClass(document.body, 'modal-opened');
  }

  setRenderContentType() {
    const { fileUrl } = this.props;
    const fetcher = fetchFileHeaders(fileUrl);
    fetcher.then(response => {
      if(response.status == 422) {
        this.setState({
          displayer: <ErrorDisplayer fileUrl={fileUrl} refetchError={this.setRenderContentType}/>
        })
      }

      if(response.status == 200) {
        const fileType = response.headers.get('Content-Type').split(';')[0]
        if (/^image\/(gif|jpe?g|png)/.test(fileType)) {
          this.setState({
            displayer: <ImageDisplayer fileUrl={fileUrl} />
          })
        } else if (fileType == 'application/pdf') {
          this.setState({
            displayer: <PdfDisplayer fileUrl={fileUrl} />
          })
        }
      }
    });
  }

  render () {
    const { handleClose } = this.props;

    return (
      <div className={classes.filePreviewModal}>
        <div className={classes.close}>
          <Icon
            type="close"
            onClick={handleClose}
          />
        </div>

        <div className={classes.content}>
          {this.state.displayer}
        </div>
      </div>
    );
  }
}

export default FilePreviewModal;
