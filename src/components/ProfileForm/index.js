import React, { Component, PropTypes } from 'react';
import { Button, Icon } from 'antd';
import Menubar from 'components/ProfileDetail/Menubar';
import { Element } from 'react-scroll';

import YLemonCollapseTable from 'components/YLemonCollapseTable';
import YLemonFieldsSection from 'components/YLemonFieldsSection';
import SuncityFinderSection from 'components/SuncityFinderSection';
import RoleGroupSection from 'components/RoleGroupSection';
import YLemonFieldsSectionEditable from 'components/YLemonFieldsSectionEditable';
import classes from './index.less';

class ProfileForm extends Component {

  static childContextTypes = {
    readonly: PropTypes.bool
  }

  static defaultProps = {
    readonly: false
  }

  getChildContext() {
    return {
      readonly: this.props.readonly
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.type == 'create' && !nextProps.profileTemplate) {
      return false;
    }else {
      return true;
    }
  }

  sectionToComponent(sectionTemplate) {
    if(sectionTemplate.type == 'fields') {
      console.log('aaaaaaaaaaaaaaa', sectionTemplate);
      if(this.props.type == 'edit') {
        return (
          <YLemonFieldsSectionEditable
            sectionData={sectionTemplate}
            getInfoFrom={this.props.getInfoFrom}
            onSave={this.props.onFieldValueChanged}
            currentUser={this.props.currentUser}
            region={this.props.region}
            dataType={this.props.dataType}
          />
        );
      }else {
        return (
          <YLemonFieldsSection
            sectionTemplate={sectionTemplate}
            getInfoFrom={this.props.getInfoFrom}
            onFieldValueChanged={this.props.onFieldValueChanged}
            dispatch={this.props.dispatch}
          />
        );
      }

    }else if(sectionTemplate.type == 'table') {
      return (
        <YLemonCollapseTable
          sectionTemplate={sectionTemplate}
          onUpdateRow={this.props.onUpdateRow}
          onDeleteRow={this.props.onDeleteRow}
          onCreateRow={this.props.onCreateRow}
          readonly={this.props.readonly}
          currentUser={this.props.currentUser}
          region={this.props.region}
          tableType={this.props.dataType}
        />
      );
    }
  }

  sections(template) {
    const sections = template.filter(
      sectionTemplate => {
        const key = sectionTemplate.key;
        return key !== 'salary_information' && key !== 'holiday_information';
      }
    ).map(sectionTemplate => {
      console.log('sectionTemplate', sectionTemplate);
      return (
        <Element
          name={sectionTemplate.key}
          key={sectionTemplate.key}
          style={{paddingBottom: 20}}
        >
          <div className={classes.element}>
            {this.sectionToComponent(sectionTemplate)}
          </div>
        </Element>
      );
    });

    sections.push((
      <Element
        name="finder"
        key="finder"
        style={{paddingBottom: 20}}
      >
        <div className={classes.element}>
          <SuncityFinderSection
            endpointType={this.props.finderEndpointType}
            onFilesChange={this.props.onFilesChange}
            readonly={this.props.readonly}
            currentUser={this.props.currentUser}
            region={this.props.region}
            dataType={this.props.dataType}
          />
        </div>
      </Element>
    ));

    /* for 1AND2 */
    /* if (this.props.dataType === 'profile') {
       sections.push((
       <Element
       name="roleGroup"
       key="roleGroup"
       className={classes.element}
       >
       <RoleGroupSection
       readonly={this.props.readonly}
       currentUser={this.props.currentUser}
       region={this.props.region}
       roleGroup={this.props.roleGroup}
       allRoleGroup={this.props.allRoleGroup}
       modalVisible={this.props.modalVisible}
       dataType={this.props.dataType}
       dispatch={this.props.dispatch}
       />
       </Element>
       ));
       }
     */

    return sections;
  }

  createButton() {
    return (
      <div className="btn-create-container">
        <Button
          className="btn-create-file"
          type="primary"
          size="large"
          loading={this.props.isCommitingProfile}
          onClick={this.props.onCreateProfile}
        >
          <Icon type="save" />
          <span>保存</span>
        </Button>
      </div>
    );
  }

  profileForm() {
    const template = this.props.template;
    console.log('template!!!!!!', template);
    return (
      <div className={classes.content}>
        <Menubar
          template={template}
          dataType={this.props.dataType}
          region={this.props.region}
          currentUser={this.props.currentUser}
        />
        <div className={classes.main}>
          {(
             this.props.type == 'create'
           ? this.createButton()
           : null
           )}
          <div>
            {this.sections(template)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>{this.profileForm()}</div>
    )
  }
}

ProfileForm.propTypes = {
  template: PropTypes.array.isRequired,
  onCreateProfile: PropTypes.func,
  onUpdateRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onCreateRow: PropTypes.func.isRequired,
  onFieldValueChanged: PropTypes.func.isRequired,
  isCommitingProfile: PropTypes.bool,
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  finderEndpointType: PropTypes.object.isRequired,
  onFilesChange: PropTypes.func,
};

export default ProfileForm;
