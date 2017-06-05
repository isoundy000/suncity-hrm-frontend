import React, { Component } from 'react';
import { Button, Rate } from 'antd';
import style from '../jobApplication.less';


export class InterviewOrSign extends Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.interviewOrSign}>
        {
          this.props.interviewOrSignList.map(function (item) {
            return (
              <div>
                this is test
              </div>
            )
          })
        }


        <div className={style.card}>
          <div className={style.interviewStatusHaveNot}>
            <span>
              未面試狀態
            </span>
          </div>
          <div className={style.cardContent}>
            <div className={style.buttonList}>
              <Button className={style.cancel}>取消</Button>
              <Button className={style.alter}>修改</Button>
              <Button className={style.finsh}>完成面試</Button>
            </div>
            <span className={style.title}>
              第二次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
            </ul>
          </div>

        </div>

        <div className={style.card}>
          <div className={style.interviewStatusAgree}>
            <span>
              同意面試
            </span>
          </div>
          <div className={style.cardContent}>
            <div className={style.buttonList}>
              <Button className={style.cancel}>取消</Button>
              <Button className={style.alter}>修改</Button>
              <Button className={style.finsh}>完成面試</Button>
            </div>
            <span className={style.title}>
              第二次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
            </ul>
          </div>

        </div>

        <div className={style.card}>
          <div className={style.interviewStatusFinish}>
            <span>
              面試完成
            </span>
          </div>
          <div className={style.cardContent}>
            <div className={style.badgeYes}>
              <span>需要後續面試</span>
            </div>
            <div className={style.buttonList}>
              <Button className={style.alter}>修改</Button>
            </div>
            <span className={style.title}>
              第一次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
              <li className={style.interviewResult}>
                面試結果: 通過面試
              </li>
              <li className={style.interviewRate}>
                面試評分：<Rate disabled value={3}/>
              </li>
              <li className={style.interviewEvaluation}>
                面試評價：這個過程非常高效，先是HR面，接著就是部門負責人，HR很nice，氛圍很輕鬆，總監很專業，很乾脆，直接說了不是他想要找的人，想把我推薦給其他部門，正在考慮，流程標准化，交流很暢通。
              </li>
            </ul>
          </div>
        </div>

        <div className={style.card}>
          <div className={style.interviewStatusCancel}>
            <span>
              取消面試
            </span>
          </div>
          <div className={style.cardContent}>
            <span className={style.title}>
              第二次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
              <li className={style.interviewCancel}>
                取消原因: 暫未明確
              </li>
            </ul>
          </div>
        </div>

        <div className={style.card}>
          <div className={style.interviewStatusWaitSign}>
            <span>
              待簽約
            </span>
          </div>
          <div className={style.cardContent}>
            <span className={style.title}>
              簽約
            </span>
            <div className={style.buttonList}>
              <Button className={style.cancel}>取消</Button>
              <Button className={style.alter}>修改</Button>
            </div>
            <ul>
              <li className={style.interviewTime}>
                簽約時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
            </ul>
          </div>
        </div>


        <div className={style.card}>
          <div className={style.interviewStatusCancel}>
            <span>
              取消簽約
            </span>
          </div>
          <div className={style.cardContent}>
            <span className={style.title}>
              簽約
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewRemark}>
                備註：已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試，已電話溝通，確定14點開始面試
              </li>
              <li className={style.interviewCancel}>
                取消原因：暫未明確
              </li>
            </ul>
          </div>
        </div>


        <div className={style.card}>
          <div className={style.interviewStatusRefuse}>
            <span>
              拒絕面試
            </span>
          </div>
          <div className={style.cardContent}>
            <div className={style.buttonList}>
              <Button className={style.cancel}>取消</Button>
              <Button className={style.alter}>修改</Button>
              <Button className={style.finsh}>完成面試</Button>
            </div>
            <span className={style.title}>
              第二次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewPeoples}>
                參與者：Bobo; Lisa
              </li>
              <li className={style.interviewRemark}>
                備註：暂未明确
              </li>
            </ul>
          </div>
        </div>


        <div className={style.card}>
          <div className={style.interviewStatusFinish}>
            <span>
              面試完成
            </span>
          </div>
          <div className={style.cardContent}>
            <div className={style.badgeNo}>
              <span>不需要后续面試</span>
            </div>
            <div className={style.buttonList}>
              <Button className={style.alter}>修改</Button>
            </div>
            <span className={style.title}>
              第一次面試
            </span>
            <ul>
              <li className={style.interviewTime}>
                面試時間：2016/08/09 14:00-15:00
              </li>
              <li className={style.interviewPeople}>
                面試官：Robo; lisa
              </li>
              <li className={style.interviewRemark}>
                備註：暂未明确
              </li>
              <li className={style.interviewResult}>
                面試結果：通過面試
              </li>
              <li className={style.interviewRate}>
                面試評分：<Rate disabled value={3}/>
              </li>
              <li className={style.interviewEvaluation}>
                面試評價：這個過程非常高效，先是HR面，接著就是部門負責人，HR很nice，氛圍很輕鬆，總監很專業，很乾脆，直接說了不是他想要找的人，想把我推薦給其他部門，正在考慮，流程標准化，交流很暢通。
              </li>
            </ul>
          </div>
        </div>

      </div>


    );
  }
}
