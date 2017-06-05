import React from 'react';
import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';
import classNames from 'classnames';
import classes from './index.less';
import { DropdownList } from 'react-widgets';
import 'react-widgets/lib/less/react-widgets.less';

const doIt = () => {
  function getAllElementsByClassName(className) {
    let result = [];
    let allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      if (allElements[i].className == className) {
        result.push(allElements[i]);
      }
    }
    return result;
  }

  let elements = getAllElementsByClassName("rw-list-option");

  if (elements.length > 0) {
    for (let i = 0; i < elements.length; i++) {
      let selectItem = elements[i];
      selectItem.className = 'dropdown-option-js hiding';

      /* const max = selectItem.scrollWidth;*/
      const max = 139; // for selectItem width, defined at ./index.less
      let slideTimer,
          slide = function() {
            selectItem.scrollLeft += 1;
            if (selectItem.scrollLeft < max) {
              slideTimer = setTimeout(slide, 20);
            }
          };

      selectItem.onmouseover = selectItem.onmouseout = function(e) {
        e = e || window.event;
        e = e.type === 'mouseover';
        clearTimeout(slideTimer);
        selectItem.className = e ? 'dropdown-option-js' : 'dropdown-option-js hiding';
        if (e) {
          slide();
        } else {
          selectItem.scrollLeft = 0;
        }
      };

      selectItem.onclick = function(e) {
        selectItem.scrollLeft = 0;
        selectItem.className = 'dropdown-option-js hiding';
      };
    }
  }
}


const YLemonSearchInput = ({ intl, className, dataSource, value, onChange, defaultValue, valueField, textField, readOnly}) => {
  const widgetMessages = {
    emptyFilter: intl.formatMessage(messages['app.selectinput.empty']),
  };

  const listTextField = () => {
    return textField
         ? textField
         : ((intl.locale === 'zh-TW') ? 'chinese_name' : 'english_name')
  };


  return (
    <div
      onClick={doIt}
      className={classNames(classes.selectInput, className)}
    >
      <DropdownList
        data={dataSource}
        value={value}
        readOnly={readOnly}
        textField={listTextField()}
        caseSensitive={false}
        minLength={1}
        filter="contains"
        messages={widgetMessages}
        onChange={onChange}
        defaultValue={defaultValue}
        valueField={valueField}
      />
    </div>
  );
};

YLemonSearchInput.propTypes = {
  intl: React.PropTypes.object,
  className: React.PropTypes.string.isRequired,
  dataSource: React.PropTypes.array.isRequired,
  value: React.PropTypes.object,
  onChange: React.PropTypes.func,
  defaultValue: React.PropTypes.any,
  valueField: React.PropTypes.any,
  textField: React.PropTypes.any,
};

export default injectIntl(YLemonSearchInput);
