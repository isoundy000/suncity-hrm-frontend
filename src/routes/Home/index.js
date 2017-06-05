import React, { PropTypes } from 'react';
import { connect } from 'dva';

import { Row, Col } from 'antd';
import styles from './index.less';
import HomePanel from './HomePanel';
import { LINKS_LIST } from '../../constants/HomeConstants';

import danganImg from './assets/dangan.png';
import zhaopinImg from './assets/zhaopin.png';
import kaoqinImg from './assets/kaoqin.png';
import xinchouImg from './assets/xinchou.png';
import jixiaoImg from './assets/jixiao.png';
import peixunImg from './assets/peixun.png';

import devIMg from './assets/kaifazhong.png';

const Home = ({ currentUser, region }) => {
  console.log(region);
  const panelList = [
    [danganImg, 'dangan', '檔案',],
    [zhaopinImg, 'recruit', '招聘',],
    [devIMg, 'kaoqin', '開發中，敬請期待...',],
    [devIMg, 'xinchou', '開發中，敬請期待...',],
    [devIMg, 'jixiao', '開發中，敬請期待...',],
    [devIMg, 'peixun', '開發中，敬請期待...',],
  ];

  const panels = panelList.map(([imgUrl, title, showtitle]) => {
    return {
      imgUrl,
      links: LINKS_LIST[title].map(([name, link]) => ({ name, link })),
      title: showtitle,
      name:title,
    };
  });
  return (
    <section className={styles.homeMain}>
      <Row gutter={15} style={{marginTop: 15}} >
        {
          panels.map((item, index) => (
            <Col md={8} xs={24} key={`col-${index}`}>
              <div className={styles.panel}>
                <HomePanel panelData={item} currentUser={currentUser} region={region} />
              </div>
            </Col>
          ))
        }

            <Col sm={20} />
      </Row>
    </section>
  );
}

const mapStateToProps = ({ currentUser, region }) => ({
  currentUser,
  region,
});

Home.propTypes = {
};

export default connect(mapStateToProps)(Home);
