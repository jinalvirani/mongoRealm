import React, { useState } from "react";
import { Overlay, Input, Button,CheckBox} from "react-native-elements";
import {
    TextInput,
    View,
    Text,
  } from 'react-native';
import styles from "../stylesheet";
import { getRealmApp } from '../getRealmApp';
import { SelectCreateProcedure } from '../components/SelectCreateProcedure';
const app = getRealmApp();

function HotrizontalLine(){
    return (
        <View style={{height:30,width:3,backgroundColor:'#E0E0E0',marginLeft:20}}></View>
    )
}

export function SetProcedure() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const user = app.currentUser;
  const [screen, setScreen] = useState(1);
  const [saveTemplate,setSaveTemplate] = useState(false);

  return (
    <>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20}}>
            <Text style={{fontWeight:'bold',paddingLeft:100,paddingBottom:10}}>Procedure</Text>
            <Text style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>Save</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'column',width:46}}>
                <View style={{borderRadius:40,borderWidth:3,borderColor:'#E0E0E0'}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',textAlignVertical:'center',backgroundColor:'white',width:40,height:40,borderWidth:1,borderRadius:40}}>1</Text>
                </View>
                <HotrizontalLine />
                <View style={{borderRadius:40,borderWidth:3,borderColor:'#E0E0E0'}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',textAlignVertical:'center',backgroundColor:'white',width:40,height:40,borderWidth:1,borderRadius:40}}>2</Text>
                </View>
                <HotrizontalLine />
                <View style={{borderRadius:40,borderWidth:3,borderColor:'#E0E0E0'}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',textAlignVertical:'center',backgroundColor:'white',width:40,height:40,borderWidth:1,borderRadius:40}}>3</Text>
                </View>
                
            </View>
            <View style={{flexDirection:'column',width:280}}>
                <View style={styles.procedureStep}>
                    <View style={{flexDirection:'row'}} >
                        <View style={{flexDirection:'column'}}>
                            <Text style={{fontWeight:'bold'}}>Procedure SetUp</Text>
                            <Text style={{fontSize:10,color:'black'}}>Selecting or creating new procedure.</Text>
                        </View>
                        <View style={{flexDirection:'column'}}>
                            {
                                saveTemplate?
                                <Text onPress={() => { setSaveTemplate(false)}} style={{fontWeight:'bold',marginBottom:3,fontSize:10,paddingBottom:10,padding:10,color:'white',backgroundColor:'black'}}>Saved!!</Text>
                                :
                                <Text onPress={() => { setSaveTemplate(true)}} style={{fontWeight:'bold',marginBottom:3,fontSize:10,paddingBottom:10,padding:10,color:'white',backgroundColor:'black'}}>Save as a templete</Text>
                            }
                            
                            <Text onPress={() => { setOverlayVisible(true)}} style={{fontWeight:'bold',paddingBottom:6,fontSize:10,borderRadius:2,borderWidth:1,borderColor:'black',padding:10,color:'black'}}>Select a Procedure</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.procedureStep}>
                    <Text style={{fontWeight:'bold'}}>Planogram SetUp</Text>
                    <Text style={{fontSize:10}}>You can plan a new table or use an existing planogram setup.</Text>
                </View>
                <View style={styles.procedureStep}>
                    <Text style={{fontWeight:'bold'}}>Execution Flow</Text>
                    <Text style={{fontSize:10}}>You can review/edit/add/delete steps in the above selected procedure.</Text>
                </View>
            </View>
        </View>

        {/* Select procedure OverLay */}
        <Overlay
            isVisible={overlayVisible}
            overlayStyle={{ width: "90%" }}
            onBackdropPress={() => setOverlayVisible(false)}
        >
            <SelectCreateProcedure />
        </Overlay>
    </>
  );
}