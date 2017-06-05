import { Alert, Card, Row, Spin } from 'antd';
import React, { Component } from "react";

import ClassModal from "../../components/ScheduleRuleDetail/Modals/ClassModal";
import ClassSet from "../../components/ScheduleRuleDetail/ClassSet";
import GradeCard from "../../components/ScheduleRuleDetail/GradeCard";
import GroupModal from "../../components/ScheduleRuleDetail/Modals/GroupModal";
import Header from "../../components/ScheduleRuleDetail/Header";
import SameOrNoStaffSet from "../../components/ScheduleRuleDetail/SameOrNoStaffSet";
import { connect } from "dva";
import styles from "./index.less";

class ScheduleRuleDetail extends Component {


  render() {
    const schedule = this.props.scheduleRuleDetail;
    const dispatch = this.props.dispatch;
    const shift_length = schedule.shiftsTable.length;
    const handleClickEdit = () => {
      dispatch({
        type:'scheduleRuleDetail/routerToShiftUserSetting'
      }) 
    }
    return (
      <section className={styles.container}>
        <div className={styles.middleSpin}>
          <Spin spinning={schedule.loading} >
            <Header state={schedule} dispatch={dispatch} />
            <ClassSet state={schedule} dispatch={dispatch} />
            <GradeCard key={1} title="排班相隔時間設定" type="shift_interval" unit="h" range={{ min: 0, max: 48 }} state={schedule} dispatch={dispatch} />
            <GradeCard key={2} title="每週公休班數設定" type="rest_day_amount_per_week" unit="個公休" range={{ min: 0, max: 7 }} state={schedule} dispatch={dispatch} />
            <GradeCard key={3} title="公休間隔時間設定" type="rest_day_interval" prefix="不多於" unit="日" range={{ min: 0, max: 10 }} state={schedule} dispatch={dispatch} />
            <GradeCard key={4} title="公休間班別類型設定" type="in_between_rest_day_shift_type_amount" prefix="不多於" unit="個班別" range={{ min: 0, max: shift_length }} state={schedule} dispatch={dispatch} />

            <Card title="按员工设定排班类型与公休" className={styles.card}>
              <Row>
                <Alert message="信息未填写完整" type="warning" showIcon />
                <h3>点击 <span onClick={handleClickEdit} className={styles.editSpan}>编辑</span> 跳转页面，进行编辑</h3>
              </Row>
            </Card>

            <SameOrNoStaffSet state={schedule} dispatch={dispatch} />
            <ClassModal state={schedule} dispatch={dispatch} />
            <GroupModal state={schedule} dispatch={dispatch} />
          </Spin>
        </div>
      </section>
    );
  }
}
function mapStateToProps({ scheduleRuleDetail }) {
  return {
    scheduleRuleDetail
  }
}
export default connect(mapStateToProps)(ScheduleRuleDetail);
