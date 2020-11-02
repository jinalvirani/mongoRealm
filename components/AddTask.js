import React, { useState } from "react";
import { Overlay, Input, Button,TextInput,View, } from "react-native-elements";
import styles from "../stylesheet";

// The AddTask is a button for adding tasks. When the button is pressed, an
// overlay shows up to request user input for the new task name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// task is created in the realm.
export function AddTask({ AddHospital }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [hospitalName,setHospitalName] = useState('');
  const [city,setCity] = useState('');

  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ width: "90%" }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <>
          <Input
            placeholder="Hospital Name"
            onChangeText={(text) => setHospitalName(text)}
            autoFocus={true}
          />
          <Input
            placeholder="City"
            onChangeText={(text) => setCity(text)}
          />
          <Button
            title="Add"
            onPress={() => {
              setOverlayVisible(false);
              AddHospital(hospitalName,city);
            }}
          />
        </>
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
