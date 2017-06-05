import React from 'react';
import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';
import './index.less';
import Transfer from '../AntTransfer';

const YLemonTransfer = ({ intl, dataSource, targetKeys, onChange, handleUpDown, onEditing }) => (
  <Transfer
    dataSource={dataSource}
    showSearch
    listStyle={{
      width: 235,
      height: 405,
    }}
    searchPlaceholder={intl.formatMessage(messages['app.global.search_placeholder'])}
    targetKeys={targetKeys}
    onChange={onChange}
    render={
      item => {
        return `${item.chinese_name}`;
      }
           }
    titles={['原欄目', '模板內欄目']}
    handleUp={(index) => {handleUpDown({id: index, up: true})}}
    handleDown={(index) => {handleUpDown({id: index, up: false})}}
    onEditing={onEditing}
  />
);

YLemonTransfer.propTypes = {
  // TODO (zhangmeng): fix prop types more specific
  dataSource: React.PropTypes.array.isRequired,
  targetKeys: React.PropTypes.node.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default injectIntl(YLemonTransfer);
