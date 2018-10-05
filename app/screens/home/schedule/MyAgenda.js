import React from "react";
import { Text, View, Icon } from "native-base";
import {
  FlatList,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from "react-native";
import {
  RkComponent,
  RkTheme,
  RkText,
  RkButton,
  RkCard
} from "react-native-ui-kitten";
import Moment from "moment";
import * as loginService from "../../../serviceActions/login";
import * as eventService from "../../../serviceActions/event";
import * as regResponseService from "../../../serviceActions/registrationResponse";

export default class MyAgenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionList: [],
      userId: "",
      eventId: "",
      isLoaded: false
    };
  }

  componentDidMount() {
    let compRef = this;
    loginService.getCurrentUser(userDetails => {
      eventService.getCurrentEvent(eventDetails => {
        this.setState({
          userId: userDetails._id,
          eventId: eventDetails._id
        });
        compRef.fetchSessionList(eventDetails._id,userDetails._id);
      });
    });
  }

  fetchSessionList = (eventId, userId) => {
    regResponseService
      .getRegResponseByEventUser(eventId, userId)
      .then(response => {
        let sessions = [];
        response.forEach(data => {
         let session = data.session;
          sessions.push({
            key: session._id,
            sessionName: session.sessionName,
            event: session.event,
            speakers: session.speakers,
            volunteers: session.volunteers,
            room: session.room,
            description: session.description,
            sessionType: session.sessionType,
            sessionCapacity: session.sessionCapacity,
            startTime: session.startTime,
            endTime: session.endTime,
            isBreak: !!session.isBreak,
            isRegistrationRequired: !!session.isRegistrationRequired
          });
        });
        this.setState({
          sessionList: sessions,
          isLoaded: true
        });
      });
  };
 
  renderSessions = () => {
    if (this.state.sessionList.length > 0) {
      return this.state.sessionList.map(session => {
        return (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SessionDetails", {
                session: session
              })}
          >
            <RkCard rkType="shadowed" style={styles.card}>
              <View style={styles.header}>
                <View style={styles.mainHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 7 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', width: 300 }} numberOfLines={1}>{session.sessionName}</Text>
              </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-end",
                    flex: 3
                  }}
                >
                  <RkText>
                    <Icon name="ios-arrow-forward" />
                  </RkText>
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.tileFooter}>
                  {this.getDuration(session)}
                </View>
                <View style={styles.tileFooter}>
                  {this.getLocation(session)}
                </View>
              </View>
            </RkCard>
          </TouchableOpacity>
        );
      });
    } else {
      return (
        <View style={styles.loading}>
          <RkText>No Sessions Found</RkText>
        </View>
      );
    }
  };

  getDuration = session => {
    let endTime = Moment(session.endTime).format("HH:mm");
    let startTime = Moment(session.startTime).format("HH:mm");
    let sessionDate = Moment(session.startTime).format("DD.MM.YY");
    return (
      <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
        <Icon
          name="md-time"
          style={styles.tileIcons}
          style={{
            color: "#5d5e5f",
            fontSize: 14,
            marginTop: 2,
            marginRight: 5
          }}
        />
        <Text
          style={styles.duration}
          style={{ color: "#5d5e5f", fontSize: 12 }}
        >
          {startTime} - {endTime} | {sessionDate}
        </Text>
      </View>
    );
  };

  getLocation = session => {
    return (
      <View
        style={{flexDirection: "row", alignSelf: "flex-end" }}
      >
        <Icon
          name="md-pin"
          style={styles.tileIcons}
          style={{
            color: "#5d5e5f",
            fontSize: 14,
            marginTop: 2,
            marginRight: 5
          }}
        />
        <Text
          style={styles.roomName}
          style={{ color: "#5d5e5f", fontSize: 12 }}
        >
           {session.room.roomName} 
        </Text>
      </View>
    );
  };
  render() {
    let sessionList = this.renderSessions();
    if (this.state.isLoaded) {
      return (
       <View style={styles.listContainer}>
          <ScrollView>{sessionList}</ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: "column"
  },
  loading: {
    marginTop: 200,
    left: 0,
    opacity: 0.5,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    margin: 1,
    padding: 4,
    height: 75
  },
  header: {
    flex: 1,
    flexDirection: "column"
  },
  mainHeader: {
    flexDirection: "column",
    flex: 3,
    justifyContent: "space-between",
    marginLeft: 5
  },
  roomName: {
    fontSize: 15,
    marginLeft: 5
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16
  },
  content: {
    margin: 2,
    padding: 2
  },
  duration: {
    fontSize: 15,
    marginLeft: 5,
    marginRight: 10
  },
  tileIcons: {
    paddingLeft: 4,
    paddingTop: 4,
    fontSize: 16
  },
  tileFooter: {
    flexDirection: "row",
    alignContent: "space-between"
  }
});
