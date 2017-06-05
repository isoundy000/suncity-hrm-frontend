/**
 * Created by meng on 16/8/19.
 */
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Select, Button, Form, Spin, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import { getMessage, getLocaleText } from '../../../locales/messages';
import YLemonList from './YLemonList';
import classes from './index.less';


import classNames from 'classnames';

const AdvancedSearchModal = ({
  intl,
  isModalVisible,
  loading,
  category,
  items,
  nextValue,
  unmatchedValues,
  dispatch,
  searchType,
  region,
  currentUser,
  searchCategories,
}) => {

  const hideModal = () => {
    dispatch({
      type: 'advancedSearch/hideModal',
    })
  };

  const submit = () => {
    dispatch({
      type: 'advancedSearch/submit',
    });
  };

  const ignoreUnmatched = () => {
    dispatch({
      type: 'advancedSearch/ignoreUnmatched',
    });
  };

  const handleSearchTypeSelected = (value, option) => {
    dispatch({
      type: 'advancedSearch/changeCategory',
      payload: value,
    });
  };

  const handleItemChange = (item) => {
    dispatch({
      type: 'advancedSearch/changeItem',
      payload: item,
    });
  };

  const handleItemDelete = (item) => {
    dispatch({
      type: 'advancedSearch/deleteItem',
      payload: item,
    });
  };

  const handleNextValueChange = (value) => {
    dispatch({
      type: 'advancedSearch/changeNextValue',
      payload: value,
    });
  };

  const handleNextValueCommit = (value) => {
    dispatch({
      type: 'advancedSearch/commitNextValue',
      payload: value,
    });
  };

  const footer = unmatchedValues.length === 0 ? ([
    <Button
      key="cancel"
      type="default"
      size="large"
      disabled={loading}
      onClick={hideModal}
    >
      {intl.formatMessage(getMessage('app.global.cancel'))}
    </Button>,
    <Button
      key="submit"
      type="primary"
      size="large"
      loading={loading}
      onClick={submit}
      disabled={items.length === 0 && nextValue === ''}
    >
      {intl.formatMessage(getMessage('app.global.ok'))}
    </Button>,
  ]) : ([
    <Button
      key="ignore"
      type="default"
      size="large"
      disabled={loading}
      onClick={ignoreUnmatched}
    >
      {intl.formatMessage(getMessage('app.search.ignore'))}
    </Button>,
    <Button
      key="submit"
      type="primary"
      size="large"
      loading={loading}
      onClick={submit}
      disabled={items.length === 0 && nextValue === ''}
    >
      {intl.formatMessage(getMessage('app.search.retry'))}
    </Button>,
  ]);

  return (
    <Modal
      className={classes.modalMain}
      title={intl.formatMessage(getMessage('app.search.advanced_search'))}
      visible={isModalVisible}
      onCancel={hideModal}
      footer={footer}
    >
      <Spin spinning={loading}>
        <div className={classes.formContainer}>
          <Form horizontal onSubmit={submit}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              label={intl.formatMessage(getMessage('app.search.category'))}
            >
              <Select
                value={category}
                onSelect={handleSearchTypeSelected}
              >
                {
                  searchCategories.map(category => (
                    <Select.Option value={category.search_type} 
                                   key={category.search_type} >
                      {getLocaleText(category, intl.locale)}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              label={intl.formatMessage(getMessage('app.search.content'))}
            />
          </Form>
          <div
            hidden={unmatchedValues.length === 0}
            className={classes.error}
          >
            {intl.formatMessage(getMessage('app.search.unmatch_message'))}
          </div>
          <YLemonList
            dataSource={items}
            nextValue={nextValue}
            unmatchedValues={unmatchedValues}
            handleItemChange={handleItemChange}
            handleItemDelete={handleItemDelete}
            handleNextValueChange={handleNextValueChange}
            handleNextValueCommit={handleNextValueCommit}
          />
        </div>
      </Spin>
    </Modal>
  );
};

const mapStateToProps = ({ advancedSearch }) => ({
  ...advancedSearch,
});

export default connect(mapStateToProps)(injectIntl(AdvancedSearchModal));
