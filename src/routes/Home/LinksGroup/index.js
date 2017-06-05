import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './index.less';
import classNames from 'classnames';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

function LinksGroup({ links, ...props }) {
  const { formatMessage } = props.intl;

  console.log("links",links);

  const mappedLinks = links.map((link) => {
    if (link.link.includes('subordinate')) {
      return {
        ...link,
        link: `${link.link}&region=${props.region}`,
      }
    }

    if (link.name === 'app.home.document.my_profiles') {
      return {
        ...link,
        link: link.link + props.currentUser.profile_id + "?source=myprofile",
      }
    }

    return link;
  });

  return (
    <div className={"showLinkGroup"}>
      {
        (mappedLinks.length === 0) ?
        null :<div className={classNames(styles.linksGroup, `${props.name}BG`)}>
        {
        mappedLinks.map((link, index) => (
          <Link to={link.link} className={styles.link} key={`link-${index}`}>
            {formatMessage(messages[link.name])}
          </Link>
        ))}
        </div>
      }
    </div>
  );
}

LinksGroup.propTypes = {
  links: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(LinksGroup);
