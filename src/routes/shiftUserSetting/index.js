import React, { Component } from "react";

import ClassSetModal from '../../components/ShiftUserSetting/Modals/ClassSetModal';
import Header from "../../components/ShiftUserSetting/Header";
import HolidaySetModal from '../../components/ShiftUserSetting/Modals/HolidaySetModal';
import { Spin } from 'antd';
import TableBlock from "../../components/ShiftUserSetting/TableBlock";
import { connect } from "dva";
import styles from "./index.less";

class ShiftUserSetting extends Component {

  render() {
    const state = this.props.shiftUserSetting;
    const dispatch = this.props.dispatch;
    return (
      <section className={styles.container}>
        <div className={styles.middleSpin}>
          <Spin spinning={state.loading} >
            <Header dispatch={dispatch} state={state} />
            <TableBlock dispatch={dispatch} state={state} />
            <ClassSetModal shiftUserSetting={this.props.shiftUserSetting} scheduleRuleDetail={this.props.scheduleRuleDetail} dispatch={dispatch} />
            <HolidaySetModal shiftUserSetting={this.props.shiftUserSetting} scheduleRuleDetail={this.props.scheduleRuleDetail} dispatch={dispatch} />
          </Spin>
        </div>
      </section>
    );
  }
}
function mapStateToProps({ shiftUserSetting, scheduleRuleDetail}) {
  return {
    shiftUserSetting,
    scheduleRuleDetail
  }
}
export default connect(mapStateToProps)(ShiftUserSetting);
