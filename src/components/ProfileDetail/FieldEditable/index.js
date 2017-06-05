import React, { PropTypes, Component } from 'react';

import { getLocaleText } from 'locales/messages';
import { LOCALE } from 'constants/GlobalConstants';

import InputEditable from 'components/ylemon-widgets/InputEditable';
import RadioEditable from 'components/ylemon-widgets/RadioEditable';
import DateEditable from 'components/ylemon-widgets/DateEditable';
import SelectEditable from 'components/ylemon-widgets/SelectEditable';
import { YLemonFieldTextWithoutIntl } from 'components/ylemon-widgets/YLemonFieldText';

import classes from './index.less';


function renderAlias(field, schema) {
  const originField = schema.find(fid => fid.key === field.alias_with);

  if (!originField) {
    return <span></span>;
  }

  switch(field.alias_rule) {
    case 'english_name':
    default:
      return (
        <YLemonFieldTextWithoutIntl
          className={classes.fieldText}
          field={originField}
          intl={{locale: LOCALE.EN}}
        />
      )
  }
}

export default function FieldEditable({ field, schema, onSave, disabled }) {
  switch (field.type) {
    case 'string':
    case 'number':
    default: {
      return (
        <InputEditable
          value={field.value}
          onSave={onSave}
          disabled={disabled}
        />
      );
    }

    case 'image': {
      return <span>{field.value}</span>;
    }

    case 'radio': {
      // if (field.key === '13th_month_salary') {
      // }

      return (
        <RadioEditable
          value={field.value}
          options={field.select.options}
          onSave={onSave}
          disabled={disabled}
        />
      );
    }

    case 'date': {
      return (
        <DateEditable
          value={field.value}
          onSave={onSave}
          disabled={disabled}
        />
      );
    }

    case 'select': {
      return (
        <SelectEditable
          value={field.value}
          select={field.select}
          onSave={onSave}
          disabled={field.disabled || disabled}
        />
      );
    }

    case 'alias':
      return renderAlias(field, schema);
  }
}

FieldEditable.propTypes = {
  field: PropTypes.object.isRequired,
  schema: PropTypes.array,
  onSave: PropTypes.func.isRequired,
};
