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
const app = getRealmApp();

export default function AddCases({ route,navigation }){
const { hospitalName , Id} = route.params;
const [patient,setPatient] = useState('');
const [cases,setCases] = useState([]);
const [surgeon,setSurgeon] = useState([]);
const [loading,isLoaded] = useState(false);
const [listCases, setListCases] = useState([]);
const user = app.currentUser;

useEffect(() => {
  const config = {
      sync: {
        user: user,
        partitionValue: `Hospital=${Id}`,
      },
    };
    Realm.open(config).then((CaseRealm) => {
      try{
          let caselist;
          if(user.customData.role === 'Surgeon')
            caselist = CaseRealm.objects('Cases').filtered("surgeonId._id == '" + user.id +"'");
          else
            caselist = CaseRealm.objects("Cases");
          console.log(caselist);
          setCases([...caselist]);
          isLoaded(true);
          //CaseRealm.close();
      }
      catch(err)
      {
        console.log(err);
        Alert.alert(`${err}`);
      }
    });
    
}, []);

const AddCase = () => {
  const config = {
    sync: {
      user: user,
      partitionValue: `Hospital=${Id}`,
    },
  };
  Realm.open(config).then((CaseRealm) => {
    try{
      const surgeonobj = CaseRealm.objects('User').filtered("_id == '" + surgeon + "'");
      console.log(surgeonobj);
      CaseRealm.write(() => {
        CaseRealm.create(
          "Cases",{
            _id: new ObjectId(),
            _partition: `Hospital=${Id}`,
            patientName: patient,
            surgeonId: surgeonobj[0],
          }
        );
        CaseRealm.syncSession.uploadAllLocalChanges().then(() => {
          CaseRealm.close();
          console.log("Case Add closed");
        });
      }); 
      
    }
    catch(err)
    {
      CaseRealm.close();
      Alert.alert(`${err}`);
    }
  })
  .catch((openerr) => {
    console.log(openerr);
  });
}

return(
      <View>
        <View style={{padding:10}}>
          <View>
            <TextInput
              onChangeText={(text) => setPatient(text)}
              value={patient}
              placeholder="Patient Name..."
              style={styles.textBox}
            />
          </View>
          <View style={{width:200}}>
            <DropDownPicker
              items={[
                  {label: 'Surgeon1-monghiba', value: '5f95767d421334c99efb987d'},
                  {label: 'Surgeon2-monghiba', value: '5f9576a2421334c99efbc96e'},
                  {label: 'Surgeon1-unique', value: '5f9576df421334c99efbfb20'},
                  {label: 'Surgeon2-unique', value: '5f9576ebb17223c820f23639'},
              ]}
              //defaultValue={this.state.country}
              containerStyle={{height: 60}}
              style={{paddingTop:10,marginTop:10}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => setSurgeon(item.value)}
            />
          </View>
          <View style={{width:100,marginLeft:250,position:'absolute', marginTop:75}}>
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
                            <Text> {caseobj.patientName}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text> {caseobj.surgeonId.name}</Text>
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
