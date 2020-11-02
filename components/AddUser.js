import React, { useState } from "react";
import { Overlay, Input, Button} from "react-native-elements";
import {
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from "../stylesheet";
import { getRealmApp } from '../getRealmApp';
const app = getRealmApp();

export function AddUser({ addUser }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [role,setRole] = useState('');
  const [email,setEmail] = useState('');
  const user = app.currentUser;


  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ width: "90%" }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <View style={{minHeight:300}}>
          <Input
            placeholder="User Email Address.."
            onChangeText={(text) => setEmail(text)}
            autoFocus={true}
            autoCapitalize="none"
            style={{margin:0}}
          />
          <DropDownPicker
            items={[
              user.customData.role === 'SuperAdmin'?
                {label: 'Hospital Admin', value: 'HospitalAdmin'}:
                {label: 'Hospital Admin', value: 'HospitalAdmin',disabled: true},
                {label: 'Surgeon', value: 'Surgeon'},
                {label: 'PeriOperative', value: 'PeriOperative'},
                {label: 'OR Nurse', value: 'ORNurse'},
                {label: 'Surgical Tech', value: 'SurgicalTech'},
            ]}
            //defaultValue={this.state.country}
            containerStyle={{height: 60}}
            style={{paddingTop:10,marginTop:10}}
            itemStyle={{
                justifyContent: 'flex-start',
            }}
            style={{marginBottom:15,}}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => setRole(item.value)}
          />
          <Button
            title="Add User"
            onPress={() => {
              setOverlayVisible(false);
              addUser(email,role);
            }}
          />
        </View>
      </Overlay>
      <Button
        type="clear"
        titleStyle={styles.plusButton}
        title="&#x2b;"
        onPress={() => {
          setOverlayVisible(true);
        }}
      />
    </>
  );
}
