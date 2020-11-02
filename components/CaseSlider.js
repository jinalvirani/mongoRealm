import React, { useState } from "react";
import { Overlay, Input, Button,Text} from "react-native-elements";
import {
    TextInput,
    View
  } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from "../stylesheet";
import CalendarPicker from 'react-native-calendar-picker';
import { SetProcedure } from '../components/SetProcedure';
import { UserState } from "realm";

export function CaseSilder({ surgeons, AddCase }) {
  const [screen,setScreen] = useState(1);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [MRN,setMRN] = useState('');
  const [patientName,setPatientName] = useState('');
  const [DOB,setDOB] = useState('');
  const [age,setAge] = useState('');
  const [contact,setContact] = useState('');
  const [problemArea,setProblemArea] = useState('');
  const [problemDetails,setProblemDetais] = useState('')
  const [medicalHistory,setMedicalHistory] = useState('');
  const [orTeam,SetORTeam] = useState([]);
  const [caseDate,setCaseDate] = useState('');
  const [fromTime,setFromTime] = useState('');
  const [toTime,setToTime] = useState('');
  const [orRoom,setOrRoom] = useState('');

  const addCase = () => {
      console.log(MRN,patientName,DOB,age,contact,problemArea,problemDetails,medicalHistory,orTeam,caseDate,fromTime,toTime,orRoom)
  }
  const setList = (surgeonName,role,surgeonId) => {
    if (!orTeam.some(e => e.firstName === surgeonName))
        SetORTeam([...orTeam,{"id":surgeonId,"firstName":surgeonName,"role":role}]);
  }
  const removeList = (surgeonName,surgeonId,role) => {
    if (orTeam.some(e => e.firstName === surgeonName))
    {
        let newList = orTeam.filter( el => el.firstName !== surgeonName );
        SetORTeam([...newList]);
    }
  }
 
  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ width: "90%" }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        {
            screen == 1?(
                <>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'bold',paddingLeft:100,paddingBottom:10}}>Patient Details</Text>
                        <Text style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>Save</Text>
                </View>
                <View style={{paddingTop:10,flexDirection: 'row'}}>
                    <TextInput
                    placeholder="MRN"
                    onChangeText={(text) => setMRN(text)}
                    autoFocus={true}
                    style={styles.textBoxOverly}
                    />
                <TextInput
                    placeholder="Patient Name"
                    onChangeText={(text) => setPatientName(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <View style={{flexDirection: 'row',}}>
                    <TextInput
                    placeholder="DOB"
                    onChangeText={(text) => setDOB(text)}
                    style={styles.textBoxOverly}
                    />
                <TextInput
                    placeholder="Age"
                    onChangeText={(text) => setAge(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                    placeholder="Contact Number"
                    onChangeText={(text) => setContact(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <Text style={{fontWeight:'bold',paddingTop:10,paddingBottom:10}}>Diagnostic conditions & Reports</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                    placeholder="Problem area"
                    onChangeText={(text) => setProblemArea(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <View style={{flexDirection: 'row',}}>
                    <TextInput
                    placeholder="Problem Details"
                    onChangeText={(text) => setProblemDetais(text)}
                    style={styles.textBoxOverly}
                    />
                <TextInput
                    placeholder="Medical History"
                    onChangeText={(text) => setMedicalHistory(text)}
                    style={styles.textBoxOverly}
                    />
                </View>
                <View style={{paddingTop:10}}>
                    <Button
                    title="Set OR Team >>"
                    onPress={() => {
                        //setOverlayVisible(false);
                        setScreen(2);
                    }}
                    />
                </View>
                </>
            ): screen === 2 ?(
                <>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text onPress={()=> setScreen(1)} style={{fontWeight:'bold',paddingBottom:10}}>{"<< "}Back</Text>
                        <Text style={{fontWeight:'bold',paddingBottom:10}}>Select OR Members</Text>
                        <Text style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>Save</Text>
                </View>
                <View style={{flexDirection: 'row',}}>
                <View style={{flexDirection:'column',justifyContent:'space-around',borderLeftColor:'black',borderRightWidth:1}}>
                        {
                            surgeons.map((surgeon) =>   
                                <View key={surgeon._id+"surgeon"} style={{flexDirection:'row',backgroundColor:'#F0F0F0',padding:10,margin:5}}>
                                    <View style={{flexDirection:'column',width:80}}>
                                        <Text style={{marginRight:10}}>{surgeon.firstName}</Text>
                                        <Text style={{marginRight:10,fontSize:10}}>{surgeon.role}</Text>
                                    </View>
                                    <View style={{width:30,paddingTop:5}}>
                                        {
                                        orTeam.some(e => e.firstName === surgeon.firstName) ?
                                        (
                                            <Text onPress={ () => removeList(surgeon.firstName,surgeon.role,surgeon._id)} style={{backgroundColor:'black', color:'white',width:20,height:20,borderRadius:20,textAlign:"center",marginRight:10}}>-</Text>
                                        )
                                        :
                                        (
                                            <Text onPress={ () => setList(surgeon.firstName,surgeon.role,surgeon._id)} style={{backgroundColor:'black', color:'white',width:20,height:20,borderRadius:20,textAlign:"center",marginRight:10}}>+</Text>
                                        )
                                        }
                                    </View>
                                </View>
                            )}
                  </View>
                    <View style={{padding:10}}>
                    {
                        orTeam.map((orTeamMem) =>   
                            <View key={orTeamMem.id+"ORTeam"} style={{flexDirection:'row',backgroundColor:'#F0F0F0',padding:10,margin:5}}>
                                <Text style={{marginRight:10,maxWidth:100}}>{orTeamMem.firstName}</Text>
                                {
                                    orTeamMem.role === 'Surgeon'?
                                    (
                                        <Text style={{marginRight:10,maxWidth:100}}>{orTeamMem.role}</Text>
                                    ):
                                    (
                                        <DropDownPicker
                                        items={[
                                          
                                            {label: 'PeriOperative', value: 'PeriOperative'},
                                            {label: 'OR Nurse', value: 'ORNurse'},
                                            {label: 'Surgical Tech', value: 'SurgicalTech'},
                                        ]}
                                        //defaultValue={this.state.country}
                                        containerStyle={{height: 30,width:80}}
                                        labelStyle={{fontSize:10}}
                                        placeholder="Role"
                                        itemStyle={{
                                            justifyContent: 'flex-start',
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => setRole(item.value)}
                                      />
                                    )
                                }
                            </View>
                        )
                    }
                    </View>
                </View>
                <Button
                title="Schedule Case >>"
                onPress={() => {
                    //setOverlayVisible(false);
                    setScreen(3);
                }}
                />
            </>
            ) : screen === 3 ?
            (
            <>
                <View style={{paddingBottom:10}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text onPress={()=> setScreen(2)} style={{fontWeight:'bold',paddingBottom:10}}>{"<< "}Back</Text>
                        <Text style={{fontWeight:'bold',paddingBottom:10}}>Schedule</Text>
                        <Text style={{fontWeight:'bold',paddingBottom:10,backgroundColor:'black',padding:10,color:'white'}}>Save</Text>
                    </View>
                    <Text style={{fontWeight:'bold'}}>Case Date</Text>
                    <View style={{flexDirection:'column'}}>
                        <View>
                            <CalendarPicker
                                todayBackgroundColor="#f2e6ff"
                                selectedDayColor="black"
                                selectedDayTextColor="white"
                                onDateChange={(date) => setCaseDate(date)}
                                width={300}
                            />
                        </View>
                        <View>
                            <Text style={{fontWeight:'bold',paddingBottom:10}}>Case Time</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10,width:150}}>
                                    
                                    <TextInput
                                    placeholder="From"
                                    style={{minWidth:40,paddingLeft:10}}
                                    onChangeText={(text) => setFromTime(text)}
                                    />
                                    <DropDownPicker
                                    items={[
                                        {label: 'AM', value: 'AM'},
                                        {label: 'PM', value: 'PM'}
                                    ]}
                                    defaultValue="AM"
                                    containerStyle={{height: 30,width:80,marginTop:10,marginLeft:15,}}
                                    labelStyle={{fontSize:10}}
                                    placeholder="AM/PM"
                                    itemStyle={{
                                        justifyContent: 'flex-start',
                                    }}
                                    
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    onChangeItem={item => setRole(item.value)}
                                    />
                                </View>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10,width:150}}>
                                    
                                    <TextInput
                                    placeholder="To"
                                    style={{minWidth:40,paddingLeft:10}}
                                    onChangeText={(text) => setToTime(text)}
                                    />
                                    <DropDownPicker
                                    items={[
                                        {label: 'AM', value: 'AM'},
                                        {label: 'PM', value: 'PM'}
                                    ]}
                                    defaultValue="PM"
                                    containerStyle={{height: 30,width:80,marginTop:10,marginLeft:20,}}
                                    labelStyle={{fontSize:10}}
                                    placeholder="AM/PM"
                                    itemStyle={{
                                        justifyContent: 'flex-start',
                                    }}
                                    
                                    dropDownStyle={{backgroundColor: '#fafafa'}}
                                    onChangeItem={item => setRole(item.value)}
                                    />
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontWeight:'bold',paddingTop:10,paddingBottom:10}}>Operating Room</Text>
                            <TextInput
                            placeholder="Room Number"
                            onChangeText={(text) => setOrRoom(text)}
                            style={styles.textBoxOverly}
                            />
                        </View>
                    </View>
                </View>
                <Button
               // title="Set Procedure >>"
                title="Create Case >>"
                onPress={() => {
                    //
                    AddCase(MRN,patientName,DOB,age,contact,problemArea,problemDetails,medicalHistory,orTeam,caseDate,fromTime,toTime,orRoom)
                   //setScreen(4);
                   setOverlayVisible(false);
                }}
                />
            </>
            ):(
                <SetProcedure />
            )
        }
       
      </Overlay>
      <Text
        style={{color:'white',textAlign:'center'}}
        type="clear"
        onPress={() => {
          setOverlayVisible(true);
        }}
      >
        Create a Case
    </Text>
    </>
  );
}
