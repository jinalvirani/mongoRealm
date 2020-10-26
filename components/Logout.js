import React,{useState} from "react";
import { Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRealmApp } from "../getRealmApp";

const app = getRealmApp();

export function Logout() {
  const [user, setUser] = useState(app.currentUser);
  const navigation = useNavigation();
  const signOut = () => {
    console.log(6);
    if (user == null) {
      console.warn("Not logged in, can't log out!");
      return;
    }
    user.logOut();
    setUser(null);
  };

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert("Log Out", null, [
          {
            text: "Yes, Log Out",
            style: "destructive",
            onPress: () => {
              signOut();
              navigation.popToTop();
            },
          },
          { text: "Cancel", style: "cancel" },
        ]);
      }}
    />
  );
}
