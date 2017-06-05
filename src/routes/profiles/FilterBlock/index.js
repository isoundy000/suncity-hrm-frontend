import React from 'react';
import YLemonBlock from 'components/YLemonBlock';
import YLemonBlockActionButton from 'components/YLemonBlock/Title/ActionButton';
import CreateProfileModal from './CreateProfileModal';

import { getMessage } from 'locales/messages';

import blockIcon from './assets/person_file.png';
import ExportActionIcon from './assets/daochu_hover.png';
import AddActionIcon from './assets/xinzeng_nor.png';

import { injectIntl } from 'react-intl';
import FilterBlockContent from './FilterBlockContent';

import classNames from 'classnames';

class FilterBLock extends React.Component{
  constructor(props){
    super(props);
    this.formatMessage = this.props.intl.formatMessage;
  }

  buildTitleActions() {
    /*creat buttun*/
    const AddAction = {
      icon: AddActionIcon,
      title: this.formatMessage(getMessage('app.block.add_action_title')),
      onClick: () => {
        this.props.dispatch({
          type: 'profiles/showCreateProfileModal'
        });
      }
    };

    const actionsTem = [
      {
        icon: ExportActionIcon,
        title: this.formatMessage(getMessage('app.block.export_action_title')),
        onClick: () => {
          this.props.dispatch({
            type: 'profiles/showExportModal',
          });
        }
      }
    ];
/*新增权限显示新增buttun*/

  ((this.props.region === 'macau' &&
    this.props.currentUser.can.createProfileInMACAU === true)
|| (this.props.region === 'manila' &&
    this.props.currentUser.can.createProfileInMACAU === true)
  ) ? actionsTem.unshift(AddAction) : null;

    const actions = actionsTem.map( action => (
      <span
        className={classNames({ 'shouldNotShow': ((action.link === '/profiles/create' &&
                                                   this.props.region === 'macau' &&
                                                   this.props.currentUser.can.createProfileInMACAU !== true)
                                               || (action.link === '/profiles/create' &&
                                                   this.props.region === 'manila' &&
                                                   this.props.currentUser.can.createProfileInMANILA !== true)) })}
        key={action.title}
      >
        <YLemonBlockActionButton
          { ...action }
          key={action.title}
        />
      </span>
    ));

    return (
      <div>
        {actions}
      </div>
    );
  }

  buildBlockContent(){
    return <FilterBlockContent {...this.props} />;
  }

  render() {
    let title = this.formatMessage(getMessage('app.block.personal_file_list'));
    if(this.props.pageType == 'subordinate'){
      title = '下屬檔案'
    }

    if(this.props.pageType == 'search'){
      title = '檔案搜索結果'
    }

    const actions = this.buildTitleActions();
    const content = this.buildBlockContent();

    return (
      <div>
        {
          this.props.profiles.showCreateProfileModal
          ? <CreateProfileModal
              loading={this.props.profiles.queryUserIdCardNumberLoading}
              message={this.props.profiles.queryUserIdCardNumberMessage}
              dispatch={this.props.dispatch}
            />
          : null
        }
        <YLemonBlock
          icon={blockIcon}
          title={title}
          actions={actions}
          content={content}
        />
      </div>
    );
  }
}

export default injectIntl(FilterBLock);
