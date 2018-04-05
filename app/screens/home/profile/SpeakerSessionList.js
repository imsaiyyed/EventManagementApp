import React from 'react';
import { FlatList, SectionList, StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { RkText, RkComponent, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import { data } from '../../../data';
import { Avatar } from '../../../components';
import { SocialSetting } from '../../../components';
import { FontAwesome } from '../../../assets/icons';
import { GradientButton } from '../../../components';
import LinkedInModal from 'react-native-linkedin';
import ScheduleTile from '../schedule/Schedule-tile';
import firebase from '../../../config/firebase'
import { Service } from '../../../services';
var firestoreDB = firebase.firestore();

const TABLE = "Sessions";
export class SpeakerSessionList extends RkComponent {
  static navigationOptions = {
    title: "speaker".toUpperCase()
  };

  constructor(props) {
    super(props);

    this.state = Object.assign(props, {
      sessionList: [],
    });
  }

  componentDidMount() {
    this.fetchSessionList();
  }

  fetchSessionList() {
    Service.getDocRef(TABLE)
      .onSnapshot((snapshot) => {
        var sessions = [];
        snapshot.forEach((request) => {
          const session = request.data();
          let id = request.id;
          let { params } = this.props.navigation.state;
          let speakersId = params.speakersId;
          let speakerId = speakersId[0];
          if (request.data().speakers == speakerId) {
            sessions.push({
              key: id,
              eventName: session.eventName,
              room: session.room,
              speakers: session.speakers,
              startTime: session.startTime,
              endTime: session.endTime,
              description: session.description,
              speakersDetails: [],
            });
          }
        });
        let newSessions = [];
        newSessions = [...sessions];
        this.setState((prevState) => ({
          ...prevState,
          sessionList: newSessions
        }));
      });
  }

  render() {
    let sessionsList;
    if (this.state.sessionList && this.state.sessionList.length > 0) {
      sessionList = (<FlatList
        data={this.state.sessionList}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => <ScheduleTile navigation={this.props.navigation} session={item} />}
      />)
    } else {
      sessionList = (<Text>loading...</Text>)
    }
    return (
      <View style={styles.listContainer}>
        {sessionList}
      </View >
    );

  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'column'
  }
});