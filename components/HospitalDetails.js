import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
import Realm from 'realm';
import styles from "../stylesheet";
import { AddUser } from "../components/AddUser";
import {CaseSilder} from "../components/CaseSlider";
import {
    StyleSheet,
    Text,
    Button,
    TextInput,
    View,
    Alert
  } from 'react-native';
import { color } from 'react-native-reanimated';
import { Hospital } from '../schemas';
const app = getRealmApp();

export default function HospitalDetails({ route,navigation }){
const { hospitalName , Id} = route.params;
const [surgeons,setSurgeons] = useState([]);
const [Cases,setCases] = useState([]);
const realmRef = useRef(null);
const [loading,isLoaded] = useState(false);
const hospitalrealmRef = useRef(null);
const user = app.currentUser;
useEffect(() => {
    if(user.customData.role ==='SuperAdmin' || user.customData.role === 'HospitalAdmin')
    {
        navigation.setOptions({
        headerRight: function Header() {
            return <AddUser addUser={addUser}/>;
        },
        title: `${JSON.parse(hospitalName)} Hospital`,
        });
    }

    const config = {
        sync: {
          user: user,
          partitionValue: `Hospital=${JSON.parse(Id)}`,
        },
    };
    Realm.open(config).then((UserRealm) => {
    try{
        realmRef.current = UserRealm;
        let users;
        if(user.customData.role === 'SuperAdmin')
           users = UserRealm.objects("User");
        else
            users = UserRealm.objects("User").filtered("role != 'HospitalAdmin'");
        setSurgeons([...users]);
        isLoaded(true);
        users.addListener(() => {
            setSurgeons([...users]);
        });
    }
    catch(err)
    {
        Alert.alert(`${err}`);
    }
    })
    .catch((err) => {
        console.log(err);
    console.log("user realm err");
    });

    Realm.open(config).then((UserRealm) => {
        let Cases;
        if(user.customData.role === 'SuperAdmin' || user.customData.role === 'HospitalAdmin')
            Cases = UserRealm.objects('Cases');
        else
            Cases = UserRealm.objects('Cases').filtered("orTeam.id =[c] '" + user.id +"'");
        setCases([...Cases]);
        Cases.addListener(() => {
            setCases([...Cases]);
        });
    })

    const config1 = {
        sync: {
          user: user,
          partitionValue: 'PUBLIC',
        },
    };
    Realm.open(config1).then((HospitalRealm) => {
    try{
        hospitalrealmRef.current = HospitalRealm;
    }
    catch(err)
    {
        Alert.alert(`${err}`);
    }
    })
    .catch((err) => {
    console.log("hospital realm err");
    });


    return () => {
    if(realmRef.current){
        const UserRealm = realmRef.current;
        UserRealm.close();
        console.log('Add User Closed');
        realmRef.current=null;
        const HospitalRealm = hospitalrealmRef.current;
        HospitalRealm.close();
        console.log('hospital realm Closed');
        HospitalRealm.current=null;
    }
    }
  }, []);

const registerNewUser =  async(email, password) => {
// Store the current user to switch back to it
const currentUser = app.currentUser;

// Login new user to allocate an Id for them
await app.emailPasswordAuth.registerUser(email, password);
const creds = Realm.Credentials.emailPassword(email, password);
const newUser = await app.logIn(creds);

// We have the user id now, let's log them out and remove them from the local device
await app.removeUser(newUser);

// Switch back to the original currentUser
app.switchUser(currentUser);

// Return the user Id to setup Address, Phone, and so on.
// console.log(newUser.id);
return newUser.id;
}

const addUser = async(email,role) => {
    console.log(email,role);
    console.log("add");
    const HospitalRealm = hospitalrealmRef.current;
    const hospital = HospitalRealm.objects('Hospital').filtered("hospitalName == '" + JSON.parse(hospitalName) + "'" )
    const userId = await registerNewUser(email,'123456');
    const config = {
        sync: {
          user: user,
          partitionValue: `Hospital=${JSON.parse(Id)}`,
        },
      };
      
      Realm.open(config).then((UserRealm) => {  
        try{
          UserRealm.write( ()=> {
            UserRealm.create('User', {
              _id: userId,
              _partition: `Hospital=${JSON.parse(Id)}`,
              hospital: JSON.stringify(hospital[0]),
              email: email,
              role: role,
            }
            );
          });
          const person = UserRealm.objects('User');
          console.log("user",person[0]);
          return UserRealm.syncSession.uploadAllLocalChanges().then(() => {
            UserRealm.close();
            console.log("Add User Role closed");
          });
        }
        catch(err)
        {
          console.log(err);
        }
        })
        .catch((err) => {
          console.log(err)
          console.log("realm err");
        });
    console.log("success");
}


const AddCase = (MRN,patientName,DOB,age,contact,problemArea,problemDetails,medicalHistory,orTeam,caseDate,fromTime,toTime,orRoom) => {
var event = new Date(caseDate.toString());
let date = JSON.stringify(event)
caseDate = date.slice(1,11);
console.log(caseDate);
    try{
       const UserRealm = realmRef.current;
       UserRealm.write(() => {
        UserRealm.create(
            "Cases",{
              _id: new ObjectId(),
              _partition: `Hospital=${JSON.parse(Id)}`,
              hospital: JSON.parse(Id),
              MRN: MRN,
              patientName: patientName,
              DOB: DOB,
              age: age,
              contact: contact,
              problemArea: problemArea,
              problemDetails: problemDetails,
              medicalHistory: medicalHistory,
              orTeam: orTeam,
              CaseSchedule: {
                _id: new ObjectId(),
                _partition: `Hospital=${JSON.parse(Id)}`,
                caseDate: caseDate,
                fromTime: fromTime,
                toTime: toTime,
                orRoom: orRoom,
                createdDate: new Date(),
                createBy: user.id,
                modifiedDate: new Date(),
                modifiedBy: user.id
              }
            }
          );
          console.log("case added");
        }); 
      }
      catch(err)
      {
          console.log(err);
        Alert.alert(`${err}`);
      }
  }

return(
        <View>
                {
                    user.customData.role ==='HospitalAdmin' 
                    || user.customData.role ==='SuperAdmin'
                    || user.customData.role ==='Surgeon'?
                    <View style={{padding:10,marginTop:10,marginLeft:100,width:200,backgroundColor:'black'}}>
                        <CaseSilder surgeons={surgeons} AddCase={AddCase}/>
                    </View>
                    :
                        null
                }
            <View style={{marginTop:10}}>
                <View style={{flexDirection:'column',paddingLeft:10,paddingRight:10}}>
                    <View key="caselist" style={{flexDirection:'row',padding:10,borderBottomColor:'#D3D3D3',borderBottomWidth:1}}>
                        <Text style={styles.caseItems}>Patient Name</Text>
                        <Text style={styles.caseItems}>Case #</Text>
                        <Text style={styles.caseItems}>Surgeon</Text>
                        <Text style={styles.caseItems}>Schedule</Text>
                    </View>
                </View>
            </View>
            <View>
               {
                   Cases.map((caseobj) =>
                    <View key={caseobj._id} style={{flexDirection:'column',paddingLeft:10,paddingRight:10}}>
                        <View style={{flexDirection:'row',padding:15,borderBottomColor:'#B8B8B8',borderBottomWidth:1}}>
                            <View style={{flexDirection:'column'}}>
                                <Text style={styles.caseItems}>
                                    {caseobj.patientName}
                                </Text>
                                <Text style={styles.caseItems}>{
                                    caseobj.age} (Minor)
                                </Text>
                            </View>
                            <Text style={styles.caseItems}>{caseobj.MRN}</Text>
                            {caseobj.orTeam.map((orMem) => 
                                orMem.role === 'Surgeon'?
                                (
                                    <Text style={styles.caseItems}>{"Dr."+orMem.firstName}</Text>
                                )
                                :null
                            )}
                            {
                                caseobj.CaseSchedule?
                                (
                                    <Text style={styles.caseItems}>{
                                        JSON.stringify(new Date(caseobj.CaseSchedule.caseDate.toString())).slice(1,11)
                                    }</Text>
                                )
                                :
                                null
                            }
                            
                        </View>
                    </View>
                   )
               }
            </View>

            <View style={styles.tableHeadercontainer}>
            <View style={{flex: 1, 
                alignSelf: 'stretch', 
                flexDirection: 'row', 
                padding:10}} key="1">
                <View style={styles.tableRow}>
                    <Text style={{fontSize:16, fontWeight:"bold"}}>SurgeonName</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{fontSize:16, fontWeight:"bold"}}> Role</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{fontSize:16, fontWeight:"bold"}}> Hospital</Text>
                </View>
                </View> 
            </View>
            <View style={styles.tablecontainer}>
                { 
                loading ? (
                surgeons.length !== 0 ?
                surgeons.map((surgeon) =>    
                    <View style={styles.rowContainer} key={`${surgeon._id}`}>
                        <View style={styles.tableRow}>
                            <Text> {surgeon.firstName}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text> {surgeon.role}</Text>
                        </View> 
                        <View style={styles.tableRow}>
                            <Text> 
                                {
                                surgeon.hospital?
                                 JSON.parse(surgeon.hospital).hospitalName
                                : null
                                }
                            </Text>
                        </View>  
                    </View>  
                )
                : (<View style={{padding:20}}>
                        <Text>No Data</Text>
                    </View>  
                )
                )
                :(<Text style={{padding:20}}>Loading.....</Text>)
            } 
            </View>
            

        </View>
    )
}