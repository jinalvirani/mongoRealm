import React,{useState,useEffect,useRef} from 'react';
import { getRealmApp } from '../getRealmApp';
import { ObjectId } from "bson";
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

export default function HospitalDetails({ route,navigation }){
const { hospitalName , Id, hospital} = route.params;

const user = app.currentUser;

useEffect(() => {
    return() => {
        //getHospitals();
    }
})

return(
        <View>
            <View>
                <Text style={styles.addButton} title="Add Hospial Member"  
                 onPress={ () => {
                    navigation.navigate('AddRole', {
                        hospitalName: hospitalName,
                        Id: Id,
                        hospital:hospital,
                    });
                }}
                >
                     + Hospital Members
                </Text>
            </View>
             <View style={styles.homeCardContainer}>
                <View key="1" style={styles.homeCards}>
                    <Text style={styles.homeCardText}
                        onPress={ () => {
                            navigation.navigate('Surgeons', {
                                hospitalName: hospitalName,
                                Id: Id,
                                hospital:hospital
                            });
                        }}>
                        View Surgeons
                    </Text>
                </View>
                <View key="2" style={styles.homeCards}>
                    <Text style={styles.homeCardText}
                        onPress={ () => {
                            navigation.navigate('Cases', {
                                hospitalName: hospitalName,
                                Id: Id,
                            });
                        }}>
                        View Cases
                    </Text>
                </View>
            </View>
        </View>
    )
}