import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';

export default class Message extends React.Component {

  isSameDay(currentMessage = {}, diffMessage = {}) {
    let diff = 0;
    if (diffMessage.createdAt && currentMessage.createdAt) {
      diff = Math.abs(moment(diffMessage.createdAt).startOf('day').diff(moment(currentMessage.createdAt).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isSameUser(currentMessage = {}, diffMessage = {}) {
    if (diffMessage.user && currentMessage.user) {
      if (diffMessage.user._id === currentMessage.user._id) {
        return true;
      }
    }
    return false;
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      delete dayProps.containerStyle
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = {
      ...this.props,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    delete bubbleProps.containerStyle
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps}/>;
  }

  renderAvatar() {
    const avatarProps = {
      ...this.props,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    delete avatarProps.containerStyle
    if(this.props.renderAvatar){
      return this.props.renderAvatar(avatarProps)
    }

    if (this.props.user._id !== this.props.currentMessage.user._id) {
      return <Avatar {...avatarProps}/>;
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
          marginBottom: this.isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

Message.defaultProps = {
  containerStyle: {},
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
};

Message.propTypes = {
  containerStyle: React.PropTypes.object,
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
};
