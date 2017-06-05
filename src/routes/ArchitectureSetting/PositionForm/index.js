import React, { PropTypes } from 'react';
import { Form, Input, Select, Checkbox, Radio, Popover } from 'antd';
import style from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import { notLevelThree } from '../../../services/architectureSetting';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;

class PositionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.checkAllBox = this.checkAllBox.bind(this);
    this.checkedValueChange = this.checkedValueChange.bind(this);
    this.checkAllVipBox = this.checkAllVipBox.bind(this);
    this.checkedVipValueChange = this.checkedVipValueChange.bind(this);
  }

  checkAllBox() {
    const { departments } = this.props.db.lists;
    const checkAll = departments.filter(dept => dept.status === 'enabled').map(dept => dept.id);

    let departmentIds = this.props.form.getFieldValue('department_ids');
    departmentIds = departmentIds ? departmentIds : [];

    const { setFieldsValue } = this.props.form;

    if (departmentIds.sort().toString() === checkAll.sort().toString()) {
      setFieldsValue({
        department_ids: [],
        check_all: false,
      });
    } else {
      setFieldsValue({
        department_ids: checkAll,
        check_all: true,
      });
    }
  }

  checkedValueChange(checkedValues) {
    const { departments } = this.props.db.lists;
    const checkAll = departments.filter(dept => dept.status === 'enabled').map(dept => dept.id);
    const { setFieldsValue } = this.props.form;

    if (checkedValues.sort().toString() !== checkAll.sort().toString()) {
      setFieldsValue({ check_all: false });
    } else {
      setFieldsValue({ check_all: true });
    }
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

  positionExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === '太阳城集团行政总裁兼董事') {
          callback([new Error('抱歉，该職位存在。')]);
        } else {
          callback();
        }
      }, 800);
    }
  }

  render() {
    const record = this.props.record;
    const form = this.props.form;
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const { positions, departments, locations } = this.props.db.lists;
    const { formatMessage } = this.props.intl;

    /* const initialValue = notLevelThree(positions, record) ? `${record.id}` : `${record.parent_id}`;*/
    const initialValue = `${record.id}`;

    const positionChineseName = formatMessage(messages['app.arch.form.position_chinese_name']);
    const positionEnglishName = formatMessage(messages['app.arch.form.position_english_name']);
    const supPosition = formatMessage(messages['app.arch.form.sup_position']);
    const positionLevel = formatMessage(messages['app.arch.form.position_level']);
    const departmentsLabel = formatMessage(messages['app.arch.form.departments_label']);
    const locationsLabel = formatMessage(messages['app.arch.form.locations_label']);
    const departmentOfAll = formatMessage(messages['app.arch.form.department_of_all']);
    const locationOfOffice = formatMessage(messages['app.arch.form.location_of_office']);
    const locationOfVip = formatMessage(messages['app.arch.form.location_of_vip']);
    const remarkLabel = formatMessage(messages['app.arch.form.remark_label']);
    const noSupPosition = formatMessage(messages['app.arch.form.no_sup_position']);

    let checkboxOptions = departments.filter(dept => dept.status === 'enabled').map(dept => (
      {
        label: dept.chinese_name,
        value: dept.id,
      }
    ));

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
        { required: true, min: 1, message: '職位名不可爲空' },
        /* { validator: this.positionExists }, */
      ],
    });

    const englishNameProps = getFieldProps('english_name', {
      rules: [
        { required: true, min: 1, message: '職位名不可爲空' },
        /* { validator: this.positionExists }, */
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

    const departmentIdsProps = getFieldProps('department_ids', {
      rules: [
        { required: true, type: 'array', message: '部門不可爲空' },
      ],
      onChange: this.checkedValueChange,
    });

    const checkAllProps = getFieldProps('check_all', {
      valuePropName: 'checked',
      onChange: this.checkAllBox,
    });

    const parentIdProps = getFieldProps('parent_id', {
      initialValue,
      rules: [
        { required: true, type: 'string', message: '上級職位不可爲空' },
      ],
    });

    const gradeProps = getFieldProps('grade', {
      initialValue: '1',
      rules: [
        { required: true, type: 'string', message: '職級不可爲空' },
      ],
    });

    return (
      <Form horizontal form={form}>
        <FormItem
          id="control-input"
          label={positionChineseName}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          help={isFieldValidating('chinese_name') ?
                '校验中...' : (getFieldError('chinese_name') || []).join(', ')}
        >

          <Input {...chineseNameProps} id="control-input" />
        </FormItem>

        <FormItem
          id="control-textarea"
          label={positionEnglishName}
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
          label={departmentsLabel}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          help={isFieldValidating('department_ids') ?
                '校验中...' : (getFieldError('department_ids') || []).join(', ')}
        >
          <Checkbox {...checkAllProps}>
            {departmentOfAll}
          </Checkbox>

          <CheckboxGroup
            options={checkboxOptions}
            defaultValue={[]}
            {...departmentIdsProps}
          />
        </FormItem>


        <FormItem
          id="select"
          label={supPosition}
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
              positions.map(posn => (
                <Option value={`${posn.id}`} key={posn.id}>{posn.chinese_name}</Option>
              ))
            }
                <Option value={null}>{noSupPosition}</Option>
          </Select>
        </FormItem>

        <FormItem
          id="select"
          label={positionLevel}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Select
            id="select"
            size="large"
            style={{ width: 200 }}
            {...gradeProps}
          >
            <Option value={'1'}>1</Option>
            <Option value={'2'}>2</Option>
            <Option value={'3'}>3</Option>
            <Option value={'4'}>4</Option>
            <Option value={'5'}>5</Option>
            <Option value={'6'}>6</Option>

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

PositionForm.propTypes = {
  form: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
};

export default injectIntl(PositionForm);
