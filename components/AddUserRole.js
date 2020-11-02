import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
import {Hospital, User} from '../schemas';
import styles from "../stylesheet";
import Realm from 'realm';
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

export default function AddUserRole({ route,navigation }){
const { hospitalName , Id} = route.params;
const [role,setRole] = useState('');
const [email,setEmail] = useState('');
const [loading,isloaded] = useState(false);
const [h,seth] = useState([]);
const user = app.currentUser;
useEffect(() => {
  const config = {
    sync: {
      user: user,
      partitionValue: 'PUBLIC',
    },
  };
  Realm.open(config).then((testRealm) => {  
    try{
      const hospital = testRealm.objects('Hospital');
      seth([...hospital])
      //console.log(hospital);
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
},[]);


const addHospitalMember = (id) => {
  console.log(h);
  const UserSchema = {
    name: 'User',
    properties: {
      _id: 'string',
      _partition: 'string',
      hospital: 'Hospital',
      name: 'string',
      role: 'string?',
    },
    primaryKey: '_id',
  };
  const HospitalSchema = {
    name: 'Hospital',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      city: 'string',
      hospitalName: 'string',
    },
    primaryKey: '_id',
  };
  const config = {
    schema: [UserSchema, HospitalSchema],
    sync: {
      user: user,
      partitionValue: `Hospital=${Id}`,
    },
  };
  Realm.open(config).then((UserRealm) => {  
    try{
      const hospital = UserRealm.objects('Hospital').filtered("hospitalName == '" + hospitalName + "'");
      UserRealm.write( ()=> {
        UserRealm.create('User', new User({
          _id: id,
          _partition: `Hospital=${Id}`,
          hospital: h[0],
          name: email,
          role: role,
        })
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
}
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
const Add = async () => {
  console.log("add");
  const userId = await registerNewUser(email,'123456');
  console.log(typeof(userId));
  await addHospitalMember(userId);
  console.log("success");
}

return(
    <View style={{padding:10}}>
      <View>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="User Email..."
          style={styles.textBox}
        />
      </View>
      <View>
        <TextInput
          onChangeText={(text) => setRole(text)}
          value={role}
          placeholder="User Role"
          style={styles.textBox}
        />
      </View>
      <View style={styles.buttonView}>
        <Button onPress={Add} title="Add" />
      </View>
    </View>
  )
}
