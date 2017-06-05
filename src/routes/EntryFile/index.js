import React, { PropTypes } from "react";
import { connect } from "dva";
import { Spin, Row, Col, Button, Icon } from "antd";
import styles from "./index.less";
import DataTable from "./DataTable";
import { injectIntl } from "react-intl";
import GreenPagination from "../EntryFile/GreenPagination";
import classNames from 'classnames';

function EntryFile({ entryFile, dispatch, ...props }) {
  const { formatMessage } = props.intl;

  let total = entryFile.pagination != null ? entryFile.pagination.total_count : null

  function handleExport() {
    dispatch({
      type: 'entryFile/downloadEntryFile',
    })
  }

  const handleChangePage = (page) => {
    dispatch({
      type: 'entryFile/fetchList',
      payload: {
        page: page,
      }
    });
  }

  return (
    <section className={styles.container}>
      <div className={styles.spinCenter}>
        <Spin spinning={entryFile.loading}>
          <Row className={styles.btnLine}>
            <Col md={24} className={styles.titleHeader}>
              <div className={styles.leftTitle}>
                缺失入職文件
              </div>
              <Button className={styles.exportBtn} onClick={handleExport}>
                匯出
              </Button>
            </Col>
          </Row>

          <Row>
            <Col md={24}>
              <DataTable
                entryFile={entryFile}
                dispatch={dispatch}
                {...props}
              />
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              {
                total > 0
                  ?
                  <div className={styles.pagination}>
                    <GreenPagination
                      className={classNames('ant-pagination', styles.pager)}
                      defaultCurrent={1}
                      total={total}
                      onChange={handleChangePage}
                    />
                  </div>
                  :
                  <section />
              }
            </Col>
          </Row>
        </Spin>
      </div>
    </section>
  );
}

EntryFile.propTypes = {};

const mapStateToProps = ({ entryFile }) => ({
  entryFile,
});

/* export default injectIntl(EntryFile); */
export default connect(mapStateToProps)(injectIntl(EntryFile));
