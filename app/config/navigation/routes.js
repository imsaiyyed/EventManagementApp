import React from 'react';
import { ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator} from 'react-native';
import {RkText, RkStyleSheet} from 'react-native-ui-kitten';

import {FontIcons} from '../../assets/icons';
import * as Screens from '../../screens/index';
import { HomePage } from '../../screens/index';
import { Questions } from '../../screens/index';
import _ from 'lodash';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {Service} from './../../services';

export class HomePageMenuScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let renderAvatar = () => {
      return (
          <Avatar style={styles.avatar} rkType='small' img={require('../../assets/images/eternusThumbWhite.png')}/>
      );
    };

    let renderTitle = () => {
      return (
          <View style={styles.header}>
            <RkText style={{color: 'white'}}>TiE Pune 2018</RkText>
          </View>
      )
    };

    let rightButton = renderAvatar();
    let title = renderTitle();
    return (
      {
        headerTitle: title,
        headerRight: rightButton
      });
  };

  constructor(){
    super()
    this.state = {
        showQuestions : false,
        showHomepage : false,
        userId : ""
    }
  }
  componentWillMount(){
    Service.getCurrentUser((userDetails)=>{
      let Uid =  userDetails.uid;
      this.setState({
        userId : Uid
      })
      this.getQuestionsData(Uid);
    });
}
getQuestionsData = (Uid) =>{
  Service.getDocRef("QuestionsHome")
  .where("ResponseBy", "==", Uid)
  .get().then((snapshot) => {
      if (snapshot.size == 0) {
        this.setState({
          showQuestions : true,
          showHomepage : false
        })
      }
      else{
        this.setState({
          showQuestions : false,
          showHomepage : true
        })
      }
  });
}
  render() {
    if (this.state.showQuestions == true && this.state.showHomepage == false) {
      return (
        <Questions navigation={this.props.navigation} userId={this.state.userId} />
      );
    }
    else if (this.state.showQuestions == false && this.state.showHomepage == true) {
      return (
        <View style={styles.mainView}>
          <HomePage navigation={this.props.navigation} />
          <View style={styles.footer}><RkText rkType="small" style={styles.footerText}>Powered by</RkText><RkText rkType="small" style={styles.companyName}> Eternus Solutions Pvt. Ltd. </RkText></View>
        </View>
      );
    }
    else {
      return null;
    }
  }
}

export const MainRoutes = [
  {
    id: 'HomeMenu',
    title: 'Home',
    icon: 'md-home',
    screen: HomePageMenuScreen,
    children: [
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        children: []
      },
      {
        id: 'Chat',
        title: 'Chat',
        screen: Screens.Chat,
        children: []
      },
      {
        id: 'ChatList',
        title: 'Chat List',
        screen: Screens.ChatList,
        children: []
      },
      {
        id: 'ProfileV1',
        title: 'User Profile V1',
        screen: Screens.ProfileV1,
        children: []
      },
      {
        id: 'AttendeeProfile',
        title: 'Profile',
        screen: Screens.AttendeeProfile,
        children: []
      },
      {
        id: 'SessionDetails',
        title: 'Session Details',
        screen: Screens.SessionDetails,
        children: []
      },
      {
        id: 'QueTab',
        title: 'Ask Questions',
        screen: Screens.QueTab,
        children: []
      },
      {
        id: 'Survey',
        title: 'Survey',
        screen: Screens.Survey,
        children: []
      }
    ]
  },
  {
    id: 'QRScanner',
    title: 'QR Scanner',
    icon: 'md-qr-scanner',
    screen: Screens.QRScanner,
    children: [],
    roleNames: ['Admin','Volunteer']
  },
  {
    id: 'MyProfile',
    title: 'My Profile',
    icon: 'ios-person',
    screen: Screens.ProfileSettings,
    children: [],
  },
  // {
  //   id: 'Dashboard',
  //   title: 'Dashboard',
  //   icon: 'ios-list',
  //   screen: Screens.Dashboard,
  //   children: []
  // },
  // {
  //   id: 'Themes',
  //   title: 'Themes',
  //   icon: FontIcons.theme,
  //   screen: Screens.Themes,
  //   children: []
  // },
];

let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'GridV2',
  title: 'Start',
  screen: HomePageMenuScreen,
  children: []
},);

export const MenuRoutes = menuRoutes;

const styles = RkStyleSheet.create(theme => ({
  mainView : {
    backgroundColor: theme.colors.screen.base,
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch', 
    backgroundColor : '#E7060E'
  },
  footerText: {
    color : '#f0f0f0',
    fontSize: 11,
  },
  companyName:{
    color : '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  avatar: {
    marginRight: 16,
  },
  header: {
    alignItems: 'center'
  },
}));