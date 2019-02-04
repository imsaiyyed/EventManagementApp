import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import { Image, TextInput,ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator, Text, Linking, TouchableOpacity,Platform,NetInfo ,TouchableHighlight } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as loginService from '../../serviceActions/login';
import QRCode from "react-native-qrcode"; 
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer';
import { GradientButton } from '../../components/gradientButton';
import { TextField } from 'react-native-material-textfield';
import { getEventById } from '../../serviceActions/event';
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
import ImagePicker from 'react-native-imagepicker'

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
export class editProfile extends React.Component {
  static navigationOptions = {
    title: 'Edit Profile'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
      userInfo :{},
      isLoaded: false,
      fnameError:'',
      lnameError:'',
      contactError:'',
      emailError:''
    }
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getUserInfo();
        } else {
          this.setState({
            isOffline: true
          }); 
        }
        this.setState({
          isOffline: !isConnected
        });
      });
    }
     this.getUserInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  } 

  getProfileImage=()=>{
    console.log('Inside get image');
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
   }; 
    ImagePicker.showImagePicker(options, response => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      alert(response.customButton);
    } else {
      let source = response; 
      this.setState({
        filePath: source,
      });
    }
 });

  //   ImagePicker.open({
  //     takePhoto: true, 
  //     useLastPhoto: true,
  //     chooseFromLibrary: true
  // }).then(({ uri, width, height }) => {
  //     console.log('image asset', uri, width, height);
  // }, (error) => {
  //     // Typically, user cancel  
  //     console.log('error', error);
  // });
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
      this.getUserInfo();
    } else {
      this.setState({
        isOffline: true
      });
    }
    this.setState({
      isOffline: connectionInfo.type === 'none',
    });
  };

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  } 
  editInput=(field,val,event)=>{ 
    switch(field){
        case 'fname':
            user={...this.state.userInfo};
            user.firstName=val;
            this.setState({userInfo:user})
        break; 
        case 'lname':
            user={...this.state.userInfo};
            user.lastName=val;
            this.setState({userInfo:user})
        break;
        case 'contact':
            user={...this.state.userInfo};
            user.contact=val;
            this.setState({userInfo:user})
        break;
        case 'email':
            user={...this.state.userInfo};
            user.email=val;
            this.setState({userInfo:user})
        break;
    }
  } 
  submit=()=>
  {
    let user={...this.state.userInfo};
    if(this.validate(user.firstName,user.lastName,user.contact.toString(),user.email)){
        delete user._id;
        delete user.__v;
                        
        axios
        .put(`${AppConfig.serverURL}/api/attendee/`+this.state.userInfo._id, JSON.parse(JSON.stringify(user)))
        .then(response => {
        console.log("(response)",response.data);
        // loginService._storeData(JSON.stringify(response.data));
        // console.log("NEw",this.state.userInfo);
        // this.getUserInfo();
        // console.log("2",this.state.userInfo);
        })
        .catch(error => {
        // console.log("(error)", error.response);
    });
}
}
validate=(fname,lname,contact,email)=>{
    var hasNumber = /\d/;

    if(fname.length>0 && !hasNumber.test(fname)){
        if(lname.length>0 && !hasNumber.test(lname)){
            if(contact.toString().length==10 && contact.toString().match(/^[0-9]+$/)){    
                    if(email.length>0 && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
                        return true;
                    }else{ 
                        this.setState({...this.state, contactError:'',lnameError:'',fnameError:'',emailError:'Please enter valid email id'});
              
                        return false;
                    }
            }else{
                this.setState({...this.state, emailError:''});
                this.setState({...this.state, lnameError:''});
                this.setState({...this.state, fnameError:''});
                this.setState({...this.state, contactError:'Please enter valid contact details'});
                return false;
            }
        }else{
            this.setState({...this.state, emailError:''});
            this.setState({...this.state, contactError:''});
            this.setState({...this.state, fnameError:''});
            this.setState({...this.state, lnameError:'Please enter valid last name'});
            return false;
        }
    }else{
        this.setState({...this.state, emailError:''});
        this.setState({...this.state, contactError:''});
        this.setState({...this.state, lnameError:''});
        this.setState({...this.state, fnameError:'Please enter valid first name'});
        return false;
    } 
}
  
      
  getUserInfo(){ 
    loginService.getCurrentUser((userInfo)=>{
      if(userInfo){
        this.setState({
          userInfo : userInfo,
          isLoaded : true 
        })
       }
      else{
        this.setState({isLoaded:false})
      }
    })  
  } 

    displayInformation = () => {
    let userInfo = this.state.userInfo;
    let attendeeCode = userInfo.attendeeLabel+"-"+userInfo.attendeeCount;
    let attendeeId = userInfo._id;
    let userName = userInfo.firstName +""+ userInfo.lastName;

    let qrText = "TIE" + ":" + attendeeCode + ":" + attendeeId + ":" + userName;
 
    return ( 
      <Container> 
        <ScrollView style={styles.root}> 
             <View style={styles.section}>  
             
                <View style={[styles.column]} >
                <TouchableOpacity key={userInfo.firstName} onPress={() => this.getProfileImage()}> 

                  <Image style={{ width: 120, height: 120,borderRadius:100 }} source={{ uri: userInfo.profileImageURL }}  />
                  </TouchableOpacity>

                  </View>
                  <View style={[styles.column]}>

                  <RkText style={{color: '#E7060E',fontSize : 15, textAlign: 'left'}}>First name</RkText>
                  <TextInput style={[styles.text]}  value={userInfo.firstName} onChangeText={(text) => this.editInput('fname',text)} />
                  <Text ref='contact'>{this.state.fnameError}</Text>

                  <RkText style={{color: '#E7060E',fontSize : 15, textAlign: 'left'}}>Last name</RkText>
                  <TextInput  style={[styles.text]}  value={userInfo.lastName} onChangeText={(text) => this.editInput('lname',text)} />
                  <Text ref='contact'>{this.state.lnameError}</Text>

                  <RkText style={{color: '#E7060E',fontSize : 15, textAlign: 'left'}}>Contact number</RkText>
                  <TextInput  keyboardType='numeric'    style={[styles.text]}  value={''+userInfo.contact}  onChangeText={(text) => this.editInput('contact',text)} />
                  <Text ref='contact'>{this.state.contactError}</Text>

                  <RkText style={{color: '#E7060E',fontSize : 15, textAlign: 'left'}}>Linkedin profile</RkText>
                  <TextInput  placeholder='Profile url' style={[styles.text]}    onChangeText={(text) => this.editInput('contact',text)} />
                  <Text ref='contact'>{this.state.contactError}</Text>
                  
                  <RkText style={{color: '#E7060E',fontSize : 15, textAlign: 'left'}}>Facebook profile</RkText>
                  <TextInput placeholder='Profile url'  style={[styles.text]}   onChangeText={(text) => this.editInput('contact',text)} />
                  <Text ref='contact'>{this.state.contactError}</Text>
                  
                  <GradientButton colors={['#f20505', '#f55050']} text='Save' style={{width: Platform.OS === 'ios' ? 150 :170 , alignSelf : 'center'}}
                onPress={() => this.submit()}/>
                  {/* <RkText style={{color: '#E7060E',fontSize : 10, textAlign: 'left'}}>Email Id</RkText>
                  <TextInput    style={{height: 40}} value={userInfo.email} onChangeText={(text) => this.editInput('email',text)} />
                  <Text ref='contact'>{this.state.emailError}</Text> */}
 
                </View>
                
                 {/* <View style={[styles.row]}>
                   <QRCode
                   value={qrText}
                   size={160}
                   bgColor='black' 
                   fgColor='white'/>  
                   </View> */}
                 {/* <View style={{marginTop:10}}>
                   <RkText style={{fontSize : 15, textAlign: 'center'}}>{attendeeCode}</RkText>
                 </View> */}
                  {/* <View style={{marginTop:25,backgroundColor:'#E7060E',height:40}}>
                   <RkText style={{fontSize : 25, textAlign: 'center', color:'white'}}>{userInfo.roleName}</RkText>
                 </View> */}
              </View> 
        </ScrollView>
      </Container>
    );
  }

  render() {
   let Info = this.displayInformation();
        if (this.state.isLoaded) {
            return (
                <Container style={[styles.root]}>
                    <ScrollView>
                        <View>
                            {Info} 
                        </View>
                    </ScrollView>
                  <View>
                  <Footer isOffline ={this.state.isOffline}/>    
                  </View>
         </Container>
            )
        }
        else {
            return (
               <Container style={[styles.root]}>
                    <Loader/> 
                    <View>
                    <Footer isOffline ={this.state.isOffline}/> 
                    </View>
                </Container>
            )
        }
   }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  section: {
    backgroundColor: theme.colors.screen.base,
    marginTop: 30
  },
 heading: {
      paddingBottom: 12.5
    },
  column: {
    flexDirection: 'column',
    borderColor: theme.colors.border.base,
    alignItems: "center"
    },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderColor :'black'
  },
  text:{
    width:100,
    height:60,
    fontSize : 17
    }
}));

