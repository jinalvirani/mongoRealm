import React,{useState} from 'react';
import { getRealmApp } from '../getRealmApp';
import {Hospital} from '../schemas';
import styles from "../stylesheet";
import Realm from 'realm';
import { ObjectId } from "bson";
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

export default function AddHospital({ navigation }){
const [name,setName] = useState('');
const [city,setCity] = useState('');
const user = app.currentUser;


const AddHospitalSync = () => {
console.log(name,city);
let userId = new ObjectId();
  const config = {
    sync: {
      user: user,
      partitionValue: `Hospital=${userId}`,
    },
  };
  Realm.open(config).then((HospitalRealm) => {
    try{
      HospitalRealm.write(() => {
        HospitalRealm.create(
          "Hospital",
          new Hospital({
            _id: userId,
            _partition: `Hospital=${userId}`,
            city: city,
            hospitalName: name,
          })
        );
        HospitalRealm.syncSession.uploadAllLocalChanges().then(() => {
          HospitalRealm.close();
          console.log("Add hospital closed");
          Alert.alert(
            "Add Hospital",
            "Hospital Added Successfully..",
            [
              { text: "OK", 
                onPress: () => navigation.navigate("Hospitals") 
              }
            ],
          );
        });
      }); 
      
    }
    catch(err)
    {
      HospitalRealm.close();
      Alert.alert(`${err}`);
    }
  })
  .catch((openerr) => {
    console.log(openerr);
  });
}

const AddHospitalNonSync = async() => {
  console.log("nonSync");
  const userId = new ObjectId();
  const hospital = {
    _id: userId,
    _partition: `Hospital=${userId}`,
    city: city,
    hospitalName: name
  };
  try{
    const result = await user.functions.addHospital(hospital);
    //console.log(result);
    Alert.alert(
      "Add Hospital",
      "Hospital Added Successfully..",
      [
        { text: "OK", 
          onPress: () => navigation.navigate("Hospitals") 
        }
      ],
    );
  }
  catch(err)
  {
    console.log(err);
  }
}

const AddHospital = () => {
  if(user.customData.role === 'SuperAdmin')
    AddHospitalNonSync();
  else
    AddHospitalSync();
}

return(
  <View style={{padding:10}}>
    <View>
      <TextInput
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Hospital Name"
        style={styles.textBox}
      />
    </View>
    <View>
      <TextInput
        onChangeText={(text) => setCity(text)}
        value={city}
        placeholder="City"
        style={styles.textBox}
      />
    </View>
    <View style={styles.buttonView}>
      <Button onPress={AddHospital} title="Add" />
    </View>
  </View>
  )
}