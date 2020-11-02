import React, { useState } from "react";
import { Overlay, Input, Button,CheckBox} from "react-native-elements";
import {
    TextInput,
    View,
    Text,
  } from 'react-native';
import styles from "../stylesheet";
import { getRealmApp } from '../getRealmApp';
const app = getRealmApp();

function HotrizontalLine(){
    return (
        <View style={{height:30,width:3,backgroundColor:'#E0E0E0',marginLeft:20}}></View>
    )
}

export function SelectCreateProcedure() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const user = app.currentUser;
  const [screen, setScreen] = useState(1);

  return (
    <>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20}}>
            <Text style={{fontWeight:'bold',paddingBottom:10}}>Procedure Template</Text>
            <Text onPress={() => { setOverlayVisible(true)}}  style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>New Procedure</Text>
        </View>
        <View>
            <Text>All procedure Templates</Text>
        </View>
        {/* New procedure Overlay */}
        <Overlay
            isVisible={overlayVisible}
            overlayStyle={{ width: "90%" }}
            onBackdropPress={() => setOverlayVisible(false)}
        >
            <Text> New Prcedure </Text>
        </Overlay>
    </>
  );
}