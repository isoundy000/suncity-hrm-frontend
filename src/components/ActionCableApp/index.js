import React from 'react';
import ActionCable from 'actioncable';
import { HOST } from 'constants/APIConstants';
class ActionCableApp extends React.Component {
  constructor(props) {
    console.log('props', props);
    super(props);
  }

  componentDidMount() {
    console.log('actionCable here');
    const userToken = JSON.parse(localStorage.getItem('reduxState')).currentUser.token;
    const currentUser = JSON.parse(localStorage.getItem('reduxState')).currentUser;
    const dispatch = this.props.dispatch;

    const App = {
      cable: ActionCable.createConsumer(`${HOST.replace('https', 'wss')}/cable?token=${userToken}`),
    };

    console.log(currentUser);

    App.cable.subscriptions.create('MessageGlobalChannel', {

      connected() {
        console.log('actionCable connected');
      },

      received(data) {
        console.log('actionCable received data', JSON.parse(data.message));
        const newMessage = JSON.parse(data.message);
        const content = newMessage.content;
        const formatContent = JSON.parse(content);
        console.log(formatContent);

        dispatch({
          type: 'myMessages/startRealTimeUpdate',
          payload: {
            newMessage,
            type: newMessage.namespace,
          },
        })
      },

      disconnected({ willAttemptReconnect }) {

      }
    });

    App.cable.subscriptions.create('MessageChannel', {

      connected() {
        console.log('actionCable connected MessageChannel');
      },

      received(data) {
        console.log('actionCable received data from MessageChannel', JSON.parse(data.message));
        const newMessage = JSON.parse(data.message);
        const content = newMessage.content;
        const formatContent = JSON.parse(content);
        console.log(formatContent);

        dispatch({
          type: 'myMessages/startRealTimeUpdate',
          payload: {
            newMessage,
            type: newMessage.namespace,
          },
        })
      },

      disconnected({ willAttemptReconnect }) {

      }
    });
  }

  componentDidUnMount() {

  }

  render() {
    return null;
  }

}

export default ActionCableApp;
