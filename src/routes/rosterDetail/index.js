import React from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Row, Col, Button, Spin } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../locales/messages';

import DateFilter from '../../components/rosterDetail/DateFilter'
import DataTable from '../../components/rosterDetail/DataTable';
import NoDataTable from '../../components/rosterDetail/NoDataTable';
import QuitEditModeModal from '../../components/rosterDetail/Modals/QuitEditModeModal';

const RosterDetail = ({ rosterDetail, dispatch, ...props }) => {
  const { formatMessage } = props.intl;
  const editable = rosterDetail.editable;

  return (
    <Spin spinning={rosterDetail.loading && rosterDetail.loading.all}>
      <section className={styles.container}>
        <Row>
          <Col md={8}>
            {
              !!editable ?
              (
                <div>
                  <div className={styles.backBtn}>
                    <Button
                      onClick={() => {
                          dispatch({
                            type: 'rosterDetail/startQuitEditMode',
                            payload: {
                              rosterId: rosterDetail.basicInfo.id,
                            }
                          })
                        }}
                    >{'< Quit Edit'}</Button>
                  </div>
                  <QuitEditModeModal
                    rosterDetail={rosterDetail}
                    dispatch={dispatch}
                  />
                </div>
              ) :
              (
                <div className={styles.backBtn}>
                  <Link to='/rosters'>
                    <Button>{'< BACK'}</Button>
                  </Link>
                </div>
              )
            }
          </Col>

          <Col md={8}>
            <div className={styles.title}>
              {rosterDetail.department['chinese_name'] ?
               rosterDetail.department['chinese_name'] :
               ''
              }
              {' - 排班時間表'}
              {
                !!editable &&
                <span className={styles.time}>{`${rosterDetail.basicInfo.year}年${rosterDetail.basicInfo.month}月`}</span>
              }
            </div>
          </Col>

          <Col md={6} offset={2} className={styles.dateFilter}>
            {
              !editable && <DateFilter
                             rosterDetail={rosterDetail}
                             dispatch={dispatch}
                           />
            }
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            {
              rosterDetail.basicInfo.state && rosterDetail.basicInfo.state === 'rostered' ?
              <DataTable
                rosterDetail={rosterDetail}
                dispatch={dispatch}
                editable={editable}
              />
              :
              <NoDataTable rosterDetail={rosterDetail} />
            }
          </Col>
        </Row>
      </section>
    </Spin>
  );
};

const mapStateToProps = ({ rosterDetail }) => ({
  rosterDetail,
});

export default connect(mapStateToProps)(injectIntl(RosterDetail));
