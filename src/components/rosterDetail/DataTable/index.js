import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'antd';

import styles from './index.less';

import { injectIntl } from 'react-intl';
import { definedMessages as messages } from '../../../locales/messages';

import TableDetail from './TableDetail';
import ClearAllModifyModal from '../Modals/ClearAllModifyModal';

import SaveModifyModal from '../Modals/SaveModifyModal';

import {HOST} from 'constants/APIConstants';

const DataTable = ({ rosterDetail, dispatch, editable, ...props }) => {
  const { formatMessage } = props.intl;
  console.log('here', rosterDetail);

  const clearAll = () => {
    dispatch({
      type: 'rosterDetail/clearAllFiltersAndSorters',
      payload: null,
    });
  };

  return (
    <div className={styles.dataTable}>
      <Row className={styles.toolBar}>
        <Col md={9}>
          {
            ! editable &&
            <span className={styles.info}>
              員工
              <span> {rosterDetail.employeeCount} </span>
              人
            </span>
          }

            <span className={styles.info}>
              共排班
              <span> {rosterDetail.rostersCount} </span>
              人次
            </span>

            <span className={styles.info}>
              公休
              <span> {rosterDetail.holidayCount} </span>
              人次
            </span>

            <span className={styles.info}>
              <Link
                onClick={clearAll}
              >
                清空条件
              </Link>
            </span>
        </Col>

        <Col md={6} offset={9} className={styles.btnGroup}>
          {
            editable !== true ?
            (
              <div>
                <Link to={`/scheduleRuleDetail/${rosterDetail.basicInfo.id}`}>
                  <Button type="primary">自動排班</Button>
                </Link>

                <Link>
                  <Button
                    type="primary"
                    onClick={() => {
                        dispatch({
                          type: 'rosterDetail/toggleEditable',
                          payload: {
                            result: true,
                          }
                        });
                      }}
                  >
                    編輯
                  </Button>
                </Link>

                <a href={`${HOST}/rosters/${rosterDetail.basicInfo.id}/items.xlsx`}>
                  <Button type="primary">匯出</Button>
                </a>

              </div>
            ) :
            (
              <div>
                <span className={styles.info}>
                  共修改了
                  <span> {rosterDetail.modifyCount} </span>
                  處
                </span>

                <ClearAllModifyModal
                  rosterDetail={rosterDetail}
                  dispatch={dispatch}
                />

                <Button
                  type="primary"
                  onClick={() => {
                      dispatch({
                        type: 'rosterDetail/startSaveModify',
                      });
                    }}
                >
                  保存
                </Button>

                <SaveModifyModal
                  rosterDetail={rosterDetail}
                  dispatch={dispatch}
                />
              </div>
            )
          }
        </Col>
      </Row>


      <TableDetail
        rosterDetail={rosterDetail}
        dispatch={dispatch}
        editable={editable}
      />

    </div>
  );
};

export default injectIntl(DataTable);
