import React, { PropTypes } from 'react';
import { Form, Input, Select, Radio, Popover, Checkbox } from 'antd';
import style from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import { notLevelThree } from '../../../services/architectureSetting';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;

class DepartmentForm extends React.Component {

  constructor(props) {
    super(props);

    this.checkAllVipBox = this.checkAllVipBox.bind(this);
    this.checkedVipValueChange = this.checkedVipValueChange.bind(this);
  }

  checkAllVipBox() {
    const { locations } = this.props.db.lists;
    const region = this.props.region;
    const pId = region === 'macau' ? 32 : 70;

    const checkAllVip = locations.filter(location => location.parent_id === pId)
                                 .map(location => location.id);

    let vipLocationIds = this.props.form.getFieldValue('vip_location_ids');
    vipLocationIds = vipLocationIds ? vipLocationIds : [];

    const { setFieldsValue } = this.props.form;

    if (vipLocationIds.sort().toString() === checkAllVip.sort().toString()
        || vipLocationIds.length > 0) {
          setFieldsValue({
            vip_location_ids: [],
            check_all_vip: false,
          });
    } else if (vipLocationIds.length === 0) {
      setFieldsValue({
        vip_location_ids: checkAllVip,
        check_all_vip: true,
      });
    }
  }

  checkedVipValueChange(checkedValues) {
    const { setFieldsValue } = this.props.form;

    if (checkedValues.length === 0) {
      setFieldsValue({ check_all_vip: false });
    } else {
      setFieldsValue({ check_all_vip: true });
    }
  }

  render() {
    const record = this.props.record;
    const form = this.props.form;
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const { departments, locations } = this.props.db.lists;
    const { formatMessage } = this.props.intl;

    /* const initialParentIdValue = notLevelThree(departments, record) ?
     *                              `${record.id}` : `${record.parent_id}`;
     */
    const initialParentIdValue = `${record.id}`;

    const departmentChineseName = formatMessage(messages['app.arch.form.department_chinese_name']);
    const departmentEnglishName = formatMessage(messages['app.arch.form.department_english_name']);
    const supDepartment = formatMessage(messages['app.arch.form.sup_department']);
    const locationsLabel = formatMessage(messages['app.arch.form.locations_label']);
    const locationOfOffice = formatMessage(messages['app.arch.form.location_of_office']);
    const locationOfVip = formatMessage(messages['app.arch.form.location_of_vip']);
    const remarkLabel = formatMessage(messages['app.arch.form.remark_label']);
    const noSupDepartment = formatMessage(messages['app.arch.form.no_sup_department']);

    const region = this.props.region;
    const pId = region === 'macau' ? 32 : 70;

    let listOfLocationsVip = locations.filter(location => location.parent_id === pId)
                                      .map(location => (
                                        {
                                          label: location.chinese_name,
                                          value: location.id,
                                        }
                                      ));

    const defaultValueOfLocationVip = listOfLocationsVip.map(location => location.value);

    const chineseNameProps = getFieldProps('chinese_name', {
      rules: [
        { required: true, min: 1, message: '部門名不可爲空' },
      ],
    });

    const englishNameProps = getFieldProps('english_name', {
      rules: [
        { required: true, min: 1, message: '部門名不可爲空' },
      ],
    });

    const locationIdsProps = getFieldProps('location_ids', {
      rules: [
        { required: true, type: 'boolean', message: '場館不可爲空' },
      ],
    });

    const vipLocationIdsProps = getFieldProps('vip_location_ids', {
      onChange: this.checkedVipValueChange,
    });

    const checkAllVipProps = getFieldProps('check_all_vip', {
      valuePropName: 'checked',
      onChange: this.checkAllVipBox,
    });

    const officeIdsProps = getFieldProps('office_id', {
      valuePropName: 'checked',
    });

    const parentIdProps = getFieldProps('parent_id', {
      initialValue: initialParentIdValue,
      rules: [
        { required: true, type: 'string', message: '上級部門不可爲空' },
      ],
    });

    return (
      <Form horizontal form={form} >
        <FormItem
          id="control-input"
          label={departmentChineseName}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          help={isFieldValidating('chinese_name') ?
                '校验中...' : (getFieldError('chinese_name') || []).join(', ')}
        >
          <Input {...chineseNameProps} id="control-input" />
        </FormItem>

        <FormItem
          id="control-textarea"
          label={departmentEnglishName}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          help={isFieldValidating('english_name') ?
                '校验中...' : (getFieldError('english_name') || []).join(', ')}
        >
          <Input {...englishNameProps} id="control-input" />
        </FormItem>

        <FormItem
          label={locationsLabel}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <div {...locationIdsProps}>
            <Checkbox {...officeIdsProps}>
              {locationOfOffice}
            </Checkbox>
            <br />
            <Checkbox {...checkAllVipProps}>
              {locationOfVip}
            </Checkbox>
          </div>

          <CheckboxGroup
            options={listOfLocationsVip}
            defaultValue={[]}
            {...vipLocationIdsProps}
          />
        </FormItem>

        <FormItem
          id="select"
          label={supDepartment}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Select
            id="select"
            size="large"
            style={{ width: 200 }}
            {...parentIdProps}
          >
            {
              departments.map(dept => (
                <Option value={`${dept.id}`} key={dept.id}>{dept.chinese_name}</Option>
              ))
            }

                <Option value={null}>{noSupDepartment}</Option>
          </Select>
        </FormItem>

        <FormItem
          id="control-textarea"
          label={remarkLabel}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Input {...getFieldProps('comment', {})} type="textarea" id="control-textarea" rows="3" />
        </FormItem>

      </Form>
    );
  }
}

DepartmentForm.propTypes = {
  form: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
};

export default injectIntl(DepartmentForm);
