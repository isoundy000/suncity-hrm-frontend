import React from 'react';
import { Upload, Icon, Progress } from 'antd';
import YLemonFieldText from 'components/ylemon-widgets/YLemonFieldText';
import YLemonImage from 'components/ylemon-widgets/YLemonImage';
import { HOST, AVATAR_UPLOAD_URL } from 'constants/APIConstants';
import classNames from 'classnames';
import classes from './index.less';
import defaultHead from 'components/ylemon-widgets/assets/765-default-avatar.png';

class ProfileAvatar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      percent: 0,
      showProgress: false,
      uploaddisabled: true,
    };
  }

  onChange = info => {
    if (info.file.status === 'done') {
      this.setState({
        percent: 0,
        showProgress: false,
      });
      this.props.imageOnChange(info.file.response.data.path);
    } else {
      this.setState({
        percent: info.file.percent,
        showProgress: true,
      });
    }
  }

  render() {
    if (this.props.readonly) {
      const field = this.props.photoField;
      const urlRegex = new RegExp('https?');
      const url = field.value;
      const imgURL = url ? (url.match(urlRegex) ? url : `${HOST}${url}`) : defaultHead;

      return (
        <div className={classNames('personal-avatar', this.props.className)}>
          <div className="personal-avatar-container">
            <YLemonImage
              imgURL={imgURL}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={classNames('personal-avatar', this.props.className)}>
          <div className="personal-avatar-container">
            <YLemonFieldText field={this.props.photoField} />

            {
              this.state.showProgress ?
                <Progress
                  className={classes.posProgress}
                  percent={this.state.percent}
                  showInfo={false}
                />
                : null
            }

            <Upload.Dragger
              action={AVATAR_UPLOAD_URL}
              onChange={this.onChange}
              showUploadList={false}
              disabled = { this.props.readonly
                           || (this.props.dataType === 'profile' &&
                               this.props.region === 'macau' &&
                               this.props.currentUser.can.updateProfileInMACAU !== true)
                           || (this.props.dataType === 'profile' &&
                               this.props.region === 'manila' &&
                               this.props.currentUser.can.updateProfileInMANILA !== true)}
            >
              <Icon type="plus" />
            </Upload.Dragger>
          </div>
        </div>
      );
    }
  }
}

export default ProfileAvatar;
