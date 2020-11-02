import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
import {UserRole} from '../schemas';
import Realm from 'realm';
import styles from "../stylesheet";
import { AddTask } from "../components/AddTask";
import { UserProfile } from "../components/UserProfile";
import {
    Text,
    View,
    Alert
  } from 'react-native';
import { color } from 'react-native-reanimated';
const app = getRealmApp();

export default function Hospitals({ navigation }){
const realmRef = useRef(null);
const userRealmRef = useRef(null);
const [hospitals,setHospitals] = useState([]);
const user = app.currentUser;

// useEffect(() => {
//     navigation.setOptions({
//       headerRight: function Header() {
//         return (
//           <View style={{flexDirection:'row'}}>
//             {
//               //user.customData.role === 'SuperAdmin'?
//               <View style={{flexDirection:'row'}}>
//                 <AddTask AddHospital={AddHospital} />
//                 {/* <UserProfile updateCustomData={updateCustomData}/> */}
//               </View>
//               // :
//               // <UserProfile updateCustomData={updateCustomData}/>
//             }
//           </View>
//         )
//       },
//       title: `Hospitals`,
//     });
// }, []);

const getHospitals = () => {
  console.log("called")
    const config = {
      sync: {
        user: user,
        partitionValue: 'PUBLIC',
      },
    };
    Realm.open(config).then((HospitalRealm) => {
      try{
        realmRef.current = HospitalRealm;
        let hos;
        if(user.customData.role === 'SuperAdmin')
          hos = HospitalRealm.objects("Hospital");
          //console.log(hos);
        else
          hos = HospitalRealm.objects("Hospital").filtered("hospitalName == '" + JSON.parse(user.customData.hospital).hospitalName + "'" )
          setHospitals([...hos]);
          hos.addListener(() => {
            setHospitals([...hos]);
          });
      }
      catch(err)
      {
        Alert.alert(`${err}`);
      }
      
    })
    .catch((err) => {
      console.log("realm err");
    });
}

useEffect(() => {
  navigation.setOptions({
    headerRight: function Header() {
      return (
        <View style={{flexDirection:'row'}}>
          {
            user.customData.role === 'SuperAdmin'?
            <View style={{flexDirection:'row'}}>
              <AddTask AddHospital={AddHospital} />
              <UserProfile updateCustomData={updateCustomData}/>
            </View>
            :
            <UserProfile updateCustomData={updateCustomData}/>
          }
        </View>
      )
    },
    title: `Hospitals`,
  });
    getHospitals();
    return () => {
      if(realmRef.current){
        const HospitalRealm = realmRef.current;
        HospitalRealm.close();
        console.log('Hospital Closed');
        realmRef.current=null;
      }
    }
},[]);

const AddHospital = (hospitalName,city) => {
let userId = new ObjectId();
    try{
      const HospitalRealm = realmRef.current;
      HospitalRealm.write(() => {
        HospitalRealm.create(
          "Hospital",
          {
            _id: userId,
            _partition: 'PUBLIC',
            city: city,
            hospitalName: hospitalName,
          }
        );
        console.log('added');
        // HospitalRealm.syncSession.uploadAllLocalChanges().then(() => {
        //   HospitalRealm.close();
        //   console.log("Add hospital closed");
        // });
      }); 
    }
    catch(err)
    {
      HospitalRealm.close();
      Alert.alert(`${err}`);
    }
}

const updateCustomData = (firstName,lastName,age,mobileNo) => {
  const config = {
    sync:
    {
      user:user,
      partitionValue:user.customData._partition
    }
  };

   Realm.open(config).then( async(UserRealm) => {
    try{
      userRealmRef.current = UserRealm;
      UserRealm.write( () => {
        const userInfo = UserRealm.objectForPrimaryKey("User",user.customData._id);
        userInfo.firstName=firstName;
        userInfo.lastName=lastName,
        userInfo.age=age;
        userInfo.mobileNo=mobileNo;
        
      }); 
      const c = await user.refreshCustomData();
      console.log("data refreshed");
    }
    catch(err)
    {
      console.log(err);
    }
   })
   .catch((err)=> {
     console.log(err);
   })
}

return(
        <View>
          <Text style={{padding:10,fontSize:20,fontWeight:'bold'}}>{user.customData.role}</Text>
             <View style={styles.homeCardContainer}>
                {hospitals.map((hospital) =>
                    <View key={`${hospital._id}`} style={styles.homeCards}>
                    <Text style={styles.homeCardText}
                    onPress={ () => {
                         navigation.navigate('HospitalDetails', {
                             hospitalName: JSON.stringify(hospital.hospitalName),
                             Id: JSON.stringify(hospital._id),
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