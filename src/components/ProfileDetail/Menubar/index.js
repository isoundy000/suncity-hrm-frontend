import React, { PropTypes, Component } from 'react'
import { injectIntl } from 'react-intl';
import { Menu, Affix } from 'antd';
import { Link, Events, scrollSpy } from 'react-scroll';
import { getLocaleText} from 'locales/messages';

import classes from './index.less';
import classNames from 'classnames';

class Menubar extends Component {
  constructor() {
    super();
    this.resetMenuHeight = this.resetMenuHeight.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      clickedItem: null,
    }
  }

  resetMenuHeight() {
    // TODO: 只有在`menu`的高度大於窗口高度時
    // this.menu.style.height = `${window.innerHeight - 80}px`;
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.resetMenuHeight();
    });
  }

  componentDidMount() {
    Events.scrollEvent.register('begin');
    Events.scrollEvent.register('end');
    this.resetMenuHeight();
    scrollSpy.update();
    window.addEventListener('resize', this.handleResize, false);
  }

  ComponentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
    window.removeEventListener('resize', this.handleResize, false);
  }

  render() {
    const { intl, template } = this.props;
    let sectionsWithOthers = this.props.template.concat([{
      key: 'finder',
      chinese_name: '相關文件',
      english_name: 'files'
    }]);

    /* for 1AND2 */
    /* if (this.props.dataType === 'profile') {
       sectionsWithOthers = [...sectionsWithOthers, {
       key: 'roleGroup',
       chinese_name: '用戶組',
       english_name: 'Role Group'
       }];
       }
     */
    return (
      <div style={{width: '160px'}}>
        <Affix className={classes.affixWrapper}>
          <div className={classes.menubar}>
            <div className={classes.menubarInner} ref={(c) => this.menu = c}>
              <ul className={classes.menu}>
                {sectionsWithOthers.filter(
                   sectionTemplate => {
                     const key = sectionTemplate.key;
                     return key !== 'salary_information' && key !== 'holiday_information';
                   }
                 ).map((section) => (
                   <li
                     className={classNames(classes.menuItem)}
                     key={section.key}
                   >
                     <Link
                       activeClass={classNames(classes.menuLinkActive)}
                       to={section.key}
                       spy={true}
                       smooth={true}
                       duration={250}
                     >
                       {getLocaleText(section, intl.locale)}
                     </Link>
                   </li>
                 ))}
              </ul>
            </div>
          </div>
        </Affix>
      </div>
    );
  }
}

Menubar.propTypes = {
  template: PropTypes.array.isRequired,
};

export default injectIntl(Menubar);
