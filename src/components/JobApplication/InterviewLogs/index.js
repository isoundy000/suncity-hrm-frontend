import React, {Component} from 'react';
import style from '../jobApplication.less';
import LogTitle from './LogTitle';
import Remark from './Remark';
import dateFormat from 'dateformat';

export class InterviewLogs extends Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }


  render() {
    const allStatus = this.props.allApplicantPositionDetailStatuses;
    const agreement_files = this.props.agreement_files;
    const smsTemplates = this.props.smsTemplates;

    return (
      <div className={style.history}>
        <ul>
          {
            this.props.logsList.map(function (item, index) {
              return (
                <div key={index}>
                  <LogTitle data={item} allStatus={allStatus} smsTemplates={smsTemplates} agreement_files={agreement_files}/>
                  <Remark data={item}/>
                </div>
              )
            })
          }
          <div>
            <li className={style.dotYellow}>
              <span className={style.log}> 求職者在求職網站上提交了申請
                <span
                  className={style.logTime}>{dateFormat(this.props.applicantProfiles!=null?this.props.applicantProfiles.created_at:null, 'yyyy/mm/dd HH:MM')}</span>
              </span>
            </li>
          </div>
        </ul>
      </div>
    );
  }
}
