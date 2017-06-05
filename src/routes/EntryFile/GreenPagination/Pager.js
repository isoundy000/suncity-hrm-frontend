import React from 'react';

const Pager = ({ locale, rootPrefixCls, page, active, last, onClick }) => {
  const prefixCls = `${rootPrefixCls}-item`;
  let cls = `${prefixCls} ${prefixCls}-${page}`;

  if (active) {
    cls = `${cls} ${prefixCls}-active`;
  }

  let title;
  if (page === 1) {
    title = locale.first_page;
  } else if (last) {
    title = `${locale.last_page}: ${page}`;
  } else {
    title = page;
  }
  return (
    <li title={title} className={cls} onClick={onClick}>
      <a>{page}</a>
    </li>
  );
};

Pager.propTypes = {
  rootPrefixCls: React.PropTypes.string,
  onClick: React.PropTypes.func,
  page: React.PropTypes.number,
  active: React.PropTypes.bool,
  last: React.PropTypes.bool,
  locale: React.PropTypes.object,
};

module.exports = Pager;
