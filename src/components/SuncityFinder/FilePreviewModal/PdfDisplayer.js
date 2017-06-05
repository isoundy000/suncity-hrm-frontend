import React, { PropTypes } from 'react';
import { Button, Icon, Select } from 'antd';
import PDF from 'react-pdf-js';

import classes from './index.less';
import classNames from 'classnames';

const Option = Select.Option;


class PdfDisplayer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      totalPages: 1,
      currentPage: 1,
    }
  }

  static propTypes = {
    fileUrl: PropTypes.string.isRequired,
  }

  zoom() {
  	if(this.state.scale > 1.5){
  		return;
  	}
    this.setState({
      scale: this.state.scale + 0.5
    })
  }

  zoomOut() {
  	if(this.state.scale < 1){
  		return;
  	}
    this.setState({
      scale: this.state.scale - 0.5
    })
  }
 
  handleChange(value){
  	this.setState({
  		scale:value
  	})
  }
 
  pageUp() {
    if(!this.canPageUp()) {
      return;
    }

    this.setState({
      currentPage: this.state.currentPage - 1
    })
  }

  pageDown() {
    if(!this.canPageDown()) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage + 1
    })
  }

  canPageUp() {
    const { currentPage } = this.state;
    return currentPage > 1;
  }

  canPageDown() {
    const { totalPages, currentPage } = this.state;
    return currentPage < totalPages;
  }

  onDocumentComplete(pages) {
    this.setState({
      totalPages: pages
    })
  }

  pagination() {
    return (
      <div className={classes.pdfPagination}>
        <div className={classNames({disable: !this.canPageUp()}, classes.pageUp)}>
          <Icon type="arrow-up" onClick={::this.pageUp}/>
        </div>
        <div className={classNames({disable: !this.canPageDown()}, classes.pageDown)}>
          <Icon type="arrow-down" onClick={::this.pageDown}/>
        </div>

        <div className={classes.pages} >
          {this.state.currentPage } / { this.state.totalPages}
        </div>
      </div>
    );
  }

  topPanel() {
    return (
      <div className={classes.topPanel}>
        <div className={classes.actions}>
          <Icon type="plus" onClick={::this.zoom}/>
          <Icon type="minus" onClick={::this.zoomOut}/>
          <Select defaultValue={1}  value={this.state.scale} onChange={::this.handleChange} dropdownStyle={true}>
			    <Option className={classes.options} value={0.5}>50%</Option>
			    <Option className={classes.options} value={1}>100%</Option>
			    <Option className={classes.options} value={1.5}>150%</Option>
			    <Option className={classes.options} value={2}>200%</Option>
			  </Select>
			 {this.pagination()}
        </div>
       
      </div>
    );
  }

  render() {
    const panel = this.topPanel();
    return (
      <div className={classes.pdfViwer}>
        {panel}
        <div className={classes.pdfContainer}>
          <PDF
            file={this.props.fileUrl}
            scale={this.state.scale}
            page={this.state.currentPage}
            onDocumentComplete={::this.onDocumentComplete}
          />
        </div>
      </div>
      
      
    );
  }
}

export default PdfDisplayer;
