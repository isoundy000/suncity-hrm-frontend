import React from 'react';
import classNames from 'classnames';
import Title from './Title';
import Content from './Content';
import classes from './index.less';

class YLemonBlock extends React.Component{
  render() {
    let type = this.props.type;

    if(!type){
      type = 'filterSection'
    }

    return (
      <div className={classNames(classes[type], 'ylemon-block')}>

        <Title
          icon={this.props.icon}
          title={this.props.title}
          actions={this.props.actions}
          titleBorder={this.props.titleBorder}
          type={this.props.type}
        />

        <Content
          content={this.props.content}
          type={this.props.type}
        />

      </div>
    );
  }
}

YLemonBlock.defaultProps = {
  titleBorder: true
};

YLemonBlock.propTypes = {
  icon: React.PropTypes.string,
  title: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  titleBorder: React.PropTypes.bool,
  actions: React.PropTypes.element,
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.array,
  ])
};

export default YLemonBlock;
