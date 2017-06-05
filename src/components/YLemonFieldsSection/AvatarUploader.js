import React, { PropTypes } from 'react';
import ProfileAvatar from 'components/ProfileDetail/ProfileAvatar';

class AvatarUploader extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      avatarField: props.photoField
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState(
      {
        avatarField: nextProps.photoField
      }
    )
  }

  render() {
    return (
      <ProfileAvatar
        photoField={this.state.avatarField}
        className={this.props.className}
        imageOnChange={(value) => {
          this.setState({
            avatarField: {
              ...this.state.avatarField,
              value
            }
          })
          this.props.onFieldValueChanged('personal_information', 'photo', value)
        }}
      />
    );
  }
}

AvatarUploader.propTypes = {
  photoField: PropTypes.object,
  onFieldValueChanged: PropTypes.func,
};

export default AvatarUploader;
