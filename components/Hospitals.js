import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
import {UserRole} from '../schemas';
import Realm from 'realm';
import styles from "../stylesheet";
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

export default function Hospitals({ navigation }){
const realmRef = useRef(null);
const [hospitals,setHospitals] = useState([]);
const user = app.currentUser;
const getHospitals = async() => {
 
  if(user.customData.role === 'SuperAdmin')
  {
    try{
      const result = await user.functions.getHospital();
      setHospitals([...result]);
    }
    catch(err){
      console.log(err);
    }
  }
  else
  {
    const config = {
      sync: {
        user: user,
        partitionValue: user.customData._partition,
      },
    };
    Realm.open(config).then((HospitalRealm) => {
      try{
        realmRef.current = HospitalRealm;
          const hos = HospitalRealm.objects("Hospital");
          const tmp = hos.slice();
          setHospitals([...tmp]);
          //HospitalRealm.close();
      }
      catch(err)
      {
        Alert.alert(`${err}`);
      }
      
    })
    .catch((err) => {
      //HospitalRealm.close();
      console.log("realm err");
    });
  }
}

useEffect(() => {
    getHospitals();
    return () => {
      if(realmRef.current){
        const HospitalRealm = realmRef.current;
        HospitalRealm.close();
        realmRef.current=null;
      }
    }
},[]);
return(
        <View>
            <View>
              { user.customData.role === 'SuperAdmin' ? 
                <Text style={styles.addButton} title="Add Hospital"  onPress={() => { navigation.navigate("AddHospital")}}> Add Hospital</Text>
              :(<Text></Text>)}
            </View>
             <View style={styles.homeCardContainer}>
                {hospitals.map((hospital) =>
                    <View key={`${hospital._id}`} style={styles.homeCards}>
                    <Text style={styles.homeCardText}
                    onPress={ () => {
                      //console.log(hospital);
                         navigation.navigate('HospitalDetails', {
                             hospitalName: hospital.hospitalName,
                             Id: hospital._id,
                             hospital:hospital,
                           });
                      }}>
                        {hospital.hospitalName}
                    </Text>
                </View>
                )}
            </View>
        </View>
    )
}