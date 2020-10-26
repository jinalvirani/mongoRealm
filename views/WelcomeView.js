import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getRealmApp } from "../getRealmApp";
import styles from "../stylesheet";

export function WelcomeView({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] =  useState(null);
  const app = getRealmApp();

  useEffect(() => {
    if (user != null) {
      navigation.navigate("Hospitals");
    }
  }, [user]);

  const signIn = async (email, password) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds);
    setUser(newUser);
  };

  const signUp = async (email, password) => {
    await app.emailPasswordAuth.registerUser(email, password);
  };

  const onPressSignIn = async () => {
    console.log("Press sign in");
    try {
      await signIn(email, password);
      Alert.alert(`Welcome: ${email}`);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };
  const onPressSignUp = async () => {
    try {
      await signUp(email, password);
      signIn(email, password);
    } catch (error) {
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    <View>
      <Text style={styles.heading}>Signup or Signin</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="password"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonView}>
        <Button onPress={onPressSignIn} title="Sign In" />
      </View>
      <View style={styles.buttonView}>
        <Button onPress={onPressSignUp} title="Sign Up" />
      </View>
    </View>
  );
}
