import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
import Realm from 'realm';
import styles from "../stylesheet";
import DropDownPicker from 'react-native-dropdown-picker';
import {
    StyleSheet,
    Text,
    Button,
    TextInput,
    View,
    Alert
  } from 'react-native';
import { color } from 'react-native-reanimated';
import Hospitals from './Hospitals';
const app = getRealmApp();

export default function AddCases({ route,navigation }){
const { hospitalName , Id} = route.params;
const [patient,setPatient] = useState('');
const [caseName,setCaseName] = useState('');
const [cases,setCases] = useState([]);
const [orTeam,setORTeam] = useState([]);
const [list,setList] = useState([{label: 'loading..', value: ''}]);
const [loading,isLoaded] = useState(false);
const [listCases, setListCases] = useState([]);
const user = app.currentUser;
const realmRef = useRef(null); 
const caserealmRef = useRef(null); 

useEffect( () => {
    const config = {
      sync: {
        user: user,
        partitionValue: `Hospital=${Id}`,
      },
    };
    Realm.open(config).then((CaseRealm) => {
      try{
        caserealmRef.current = CaseRealm;
        const surgeonList = CaseRealm.objects('User').filtered("role == 'Surgeon' ");
          const surgeonDropdown = surgeonList.map((surgeon) => {
            return {label: surgeon.name, value: surgeon._id}
          })
          setList([...surgeonDropdown])

          let caselist;
          if(user.customData.role === 'Surgeon')
            caselist = CaseRealm.objects('Cases').filtered("orTeam =[c] '" + user.id +"'");
          else
            caselist = CaseRealm.objects("Cases");
          setCases([...caselist]);
          caselist.addListener(() => {
            setCases([...caselist]);
          });
          //console.log(caselist);
//           const realm = realmRef.current;
//           caselist.map((casee) => {
//             let ans = realm.objects('Hospital');
//             casee.surgeon=ans[0];
//             console.log(casee)
// ;          });
          //console.log(caselist)
          
          isLoaded(true);
      }
      catch(err)
      {
        console.log(err);
        Alert.alert(`${err}`);
      }
    });
}, []);

const AddCase = () => {
  console.log(patient,caseName,orTeam)
    try{
     // const surgeonobj = CaseRealm.objects('User').filtered("_id == '" + surgeon + "'");
     // console.log(surgeonobj);
     const CaseRealm = caserealmRef.current;
     CaseRealm.write(() => {
      CaseRealm.create(
          "Cases",{
            _id: new ObjectId(),
            _partition: `Hospital=${Id}`,
            caseName:caseName,
            patientName: patient,
            hospital: JSON.stringify(Id),
            orTeam: [orTeam],
          }
        );
        console.log("case added");
        // CaseRealm.syncSession.uploadAllLocalChanges().then(() => {
        //   CaseRealm.close();
        //   console.log("Case Add closed");
        // });
      }); 
    }
    catch(err)
    {
      //CaseRealm.close();
      Alert.alert(`${err}`);
    }
}

return(
      <View>
        <View style={{padding:10}}>
          <View>
            <TextInput
              onChangeText={(text) => setCaseName(text)}
              value={caseName}
              placeholder="CaseName..."
              style={styles.textBox}
            />
            <TextInput
              onChangeText={(text) => setPatient(text)}
              value={patient}
              placeholder="Patient Name..."
              style={styles.textBox}
            />
          </View>
          <View style={{width:200}}>
            <DropDownPicker
              items={list}
              //defaultValue={this.state.country}
              containerStyle={{height: 60}}
              style={{paddingTop:10,marginTop:10}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              placeholder="Select OR Team"
              onChangeItem={item => setORTeam(item.value)}
            />
          </View>
          <View style={{width:100,marginLeft:250,position:'absolute', marginTop:125}}>
            <Button onPress={AddCase} title="Add" />
          </View>
        </View>

        <View style={styles.tablecontainer}>
            <View style={{flex: 1, 
                alignSelf: 'stretch', 
                flexDirection: 'row', 
                padding:10}} key="1">
                <View style={styles.tableRow}>
                    <Text style={{fontSize:20, fontWeight:"bold"}}> Patient Name </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{fontSize:20, fontWeight:"bold"}}> SurgeonName</Text>
                </View>
                </View> 
            </View>
            <View style={styles.tablecontainer}>
                { 
                loading ? (
                cases.length !== 0 ?
                cases.map((caseobj) =>    
                    <View style={styles.rowContainer} key={`${caseobj._id}`}>
                        <View style={styles.tableRow}>
                            <Text> {caseobj.caseName}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text> {caseobj.patientName}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text> {caseobj.orTeam[0]}</Text>
                            <Text> {caseobj.orTeam[1]}</Text>
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
