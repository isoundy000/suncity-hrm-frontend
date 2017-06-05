import React from 'react';
import classNames from 'classnames';
import classes from './index.less';
import { Dropdown , Icon, Menu} from 'antd';

import {
  getAllSelectColumnTemplates,
  createSelectColumnTemplates,
  getSelectColumnTemplateById,
  editSelectColumnTemplateById,
  deleteSelectColumnTemplateById
} from 'services/profiles';

import ChangeColumnsModal from '../ChangeColumnsModal';

import editImage from 'components/SelectColumnsTemplate/assets/bianji.png';

class TemplatesDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      templates: [],
      defaultTemplate: null,
      templatesReady: false,
      editingTemplate: null,
      creatingNewTemplate: false,
      currentTemplate: null,
    };
  }

  componentWillMount() {
    this.getAllTemplates();
  }

  getAllTemplates(finish) {
    getAllSelectColumnTemplates(
      this.context.region,
      this.props.type
    ).then(json => {
      const templates = json.data.data;
      const defaultTemplate = templates.find((template) => {
        return template.default;
      });

      this.setState({
        templatesReady: true,
        templates,
        defaultTemplate,
      }, () => {
        this.props.toggleLoadingState(false);
        finish ? finish(templates) : null;
      });
    });
  }

  creatingNewTemplate() {
    this.props.toggleLoadingState(true);
    this.setState({
      editingTemplate: null,
      creatingNewTemplate: true
    });
  }

  dropdownMenus() {
    return (
      <Menu className={classes.templateMemu}>
        {
          this.state.templates.map((template) => {
            return (
              <Menu.Item key={template.id} className={classes.templateMemuItem}>
                <a
                  onClick={() => {
                    getSelectColumnTemplateById(
                      template.id,
                      this.props.type
                    ).then(json => {
                      const selectedTemplate = json.data.data;

                      this.setState({
                        currentTemplate: selectedTemplate
                      });

                      this.props.onChangeSelectedTemplate(selectedTemplate);
                    });
                  }}>
                  {template.name}
                </a>

                <img
                  src={editImage}
                  className={classes.editImage}
                  onClick={() => {
                      this.props.toggleLoadingState(true);
                      getSelectColumnTemplateById(
                        template.id,
                        this.props.type
                      ).then(json => {
                        this.setState({
                          editingTemplate: json.data.data
                        });
                      });
                    }}
                />
              </Menu.Item>
            );
          })
        }

        <Menu.Divider />

        <Menu.Item className={classNames(classes.templateMemuItem, classes.addNewItem)}>
          <a onClick={::this.creatingNewTemplate}>
            <Icon type="plus-circle-o" /> 新建模板
          </a>
        </Menu.Item>
      </Menu>
    );
  }

  finishEditing() {
    this.setState({
      editingTemplate: null
    });
    this.getAllTemplates();
  }

  finishSetDefault() {
    this.setState({
      editingTemplate: { ...this.editingTemplate, 'default': true },
    });
    this.getAllTemplates();
  }

  renderEditingTemplateModal() {
    const editingTemplate = this.state.editingTemplate;

    return (
      <ChangeColumnsModal
        targetKeys={editingTemplate.select_column_keys}
        editingTemplate={editingTemplate}
        type={this.props.type}
        onChange={({ dataSourceReady }) => {
          if(dataSourceReady) {
            this.props.toggleLoadingState(false);
          }
        }}
        handleCancel={() => {
          this.finishEditing();
        }}

        handleSubmit={({ targetKeys, title, editingTemplate }) => {
          editSelectColumnTemplateById(editingTemplate.id, {
              select_column_keys: targetKeys,
              name: title
            },
            this.props.type
          ).then(json => {
            this.finishEditing();
            this.getAllTemplates((templates) => {
              getSelectColumnTemplateById(
                editingTemplate.id,
                this.props.type
              ).then(json => {
                const newEditingTemplate = json.data.data;
                this.props.onEditSelectedTemplate(
                  newEditingTemplate,
                  this.state.currentTemplate
                );
              });
            });
          });

        }}

        handleSetDefault={() => {
          editSelectColumnTemplateById(editingTemplate.id, {
              default: true
            },
            this.props.type
          ).then(json => {
            {/* this.finishEditing(); */}
            this.finishSetDefault();
            {/* this.getAllTemplates(); */}
          });
          }}

        handleDelete={() => {
            deleteSelectColumnTemplateById(
              editingTemplate.id,
              this.props.type
            ).then(() => {
              this.finishEditing();
              this.getAllTemplates();
            });
          }}
      />
    );
  }

  renderCreatingTemplateModal() {
    return (
      <ChangeColumnsModal
        targetKeys={[]}
        type={this.props.type}
        onChange={({ dataSourceReady }) => {
            if(dataSourceReady) {
              this.props.toggleLoadingState(false);
            }
          }}
        onCancel={() => {
            this.setState({
              creatingNewTemplate: false
            });
          }}

        creatingNewTemplate

        handleSubmit={({ targetKeys, fields, title }) => {
            createSelectColumnTemplates(
              this.context.region,
              targetKeys,
              title,
              false,
              this.props.type,
            ).then(json => {
              this.getAllTemplates();
            });

            this.setState({
              creatingNewTemplate: false
            });

          }}

        handleCancel={() => {
            this.setState({
              creatingNewTemplate: false
            });
          }}
      />
    );
  }

  currentTemplateTitle() {
    if(this.state.currentTemplate){
      return this.state.currentTemplate.name;
    }else{
      return this.state.defaultTemplate ? this.state.defaultTemplate.name : null;
    }
  }

  render() {
    const menu = this.dropdownMenus();

    return (
      <div className={classes.templateSec}>
        <span>模板:</span>
        <Dropdown overlay={menu} trigger={['hover']}>
          <div className={classes.dropDownMenu}>
            {this.currentTemplateTitle()}

            <Icon type="caret-down" />
          </div>
        </Dropdown>

        {
          this.state.creatingNewTemplate? this.renderCreatingTemplateModal() : null
        }

        {
          this.state.editingTemplate ? this.renderEditingTemplateModal() : null
        }
      </div>
    );
  }
}

TemplatesDropdown.contextTypes = {
  region: React.PropTypes.string
};

TemplatesDropdown.propTypes = {
  dispatch: React.PropTypes.func,
  type: React.PropTypes.string.isRequired,
  onChangeSelectedTemplate: React.PropTypes.func,
  onEditSelectedTemplate: React.PropTypes.func,
  toggleLoadingState: React.PropTypes.func,
};

export default TemplatesDropdown;
