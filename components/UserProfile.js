import React, { useState,useEffect } from "react";
import { Overlay, Input, Button} from "react-native-elements";
import {
  View,
  Text,
  TextInput
} from 'react-native';
import styles from "../stylesheet";
import { Avatar, Accessory } from 'react-native-elements';
import { getRealmApp } from '../getRealmApp';
const app = getRealmApp();

export  function UserProfile({updateCustomData}) {
  const user = app.currentUser;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [firstName,setFirstName] = useState(user.customData.firstName? user.customData.firstName : '');
  const [lastName,setLastName] = useState(user.customData.lastName? user.customData.lastName : '');
  const [age,setAge] = useState(user.customData.age? user.customData.age : '');
  const [mobileNo,setMobileNo] = useState(user.customData.mobileNo? user.customData.mobileNo : '');
  const [name,setName] = useState('');


  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ width: "90%" }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
          <View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{fontWeight:'bold',paddingLeft:100,paddingBottom:10}}>{user.customData.firstName + "'s Information"}</Text>
                <Text 
                    onPress={() => { updateCustomData(firstName,lastName,age,mobileNo)
                                     setOverlayVisible(false)
                    }} 
                    style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>Save</Text>
                </View>
                <View style={{paddingTop:10,flexDirection: 'column'}}>
                    <TextInput
                    placeholder="Email Address"
                    value={user.customData.email? user.customData.email : '-'}
                    editable={false}
                    style={styles.textBoxOverly}
                    />
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput
                        placeholder="FirstName"
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                        autoFocus={true}
                        style={styles.textBoxOverly}
                        />
                    <TextInput
                    placeholder="LastName"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <TextInput
                    placeholder="Password"
                   // onChangeText={(text) => setPatientName(text)}
                    style={styles.textBoxOverly}
                    />
                <TextInput
                    placeholder="Confirm Password"
                    //onChangeText={(text) => setPatientName(text)}
                    style={styles.textBoxOverly}
                    />
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput
                        placeholder="Age"
                        value={age}
                        onChangeText={(text) => setAge(text)}
                        style={styles.textBoxOverly}
                        />
                    <TextInput
                    placeholder="MobileNo"
                    value={mobileNo}
                    onChangeText={(text) => setMobileNo(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput
                        placeholder="Hospital"
                        value={user.customData.hospital? JSON.parse(user.customData.hospital).hospitalName : '-'}
                        editable={false}
                        style={styles.textBoxOverly}
                        />
                    <TextInput
                    placeholder="Role"
                    value={user.customData.role? user.customData.role : '-'}
                    editable={false}
                    style={styles.textBoxOverly}
                    />
                </View>

                </View>
            </View>
      </Overlay>
      <Avatar
        size="small"
        titleStyle={{color:'white',fontWeight:'bold'}}
        rounded
        title="s"
        overlayContainerStyle={{backgroundColor: 'black'}}
        onPress={() => {
            setOverlayVisible(true);
          }}
        containerStyle={{margin: 10}}
        activeOpacity={0.7}
        color="red"
      >
        <Accessory style={{backgroundColor:"green"}} />
        </Avatar>
    </>
  );
}
