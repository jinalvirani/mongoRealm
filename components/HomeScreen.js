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

export default function HomeScreen({ navigation }){
const user = app.currentUser;
return(
        <View>
             <View style={styles.homeCardContainer}>
                <View style={styles.homeCards}>
                    <Text style={styles.homeCardText} onPress={() => {navigation.navigate('Hospitals');}}>
                        Hospitals
                    </Text>
                </View>
                <View style={styles.homeCards}>
                    <Text style={styles.homeCardText}>
                        Abc
                    </Text>
                </View>
                <View style={styles.homeCards}>
                    <Text style={styles.homeCardText}>
                        Abc
                    </Text>
                </View>
            </View>
        </View>
    )
}