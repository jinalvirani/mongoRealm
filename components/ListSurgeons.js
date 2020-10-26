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
import { block, color } from 'react-native-reanimated';
const app = getRealmApp();

export default function ListSurgeon({ route,navigation }){
const { hospitalName , Id} = route.params;
const [surgeons,setSurgeons] = useState([]);
const [loading,isLoaded] = useState(false);
const user = app.currentUser;

useEffect(() => {
    const config = {
        sync: {
          user: user,
          partitionValue: `Hospital=${Id}`,
        },
      };
      Realm.open(config).then((SurgeonRealm) => {
        try{
            const surgeon = SurgeonRealm.objects("User");
            setSurgeons([...surgeon]);
            isLoaded(true);
            // console.log("length",surgeons.length)
            // console.log("Surgons",surgeon);
            SurgeonRealm.close();
        }
        catch(err)
        {
          Alert.alert(`${err}`);
        }
      });
}, []);
return(
    <View>
        <View style={styles.tablecontainer}>
            <View style={{flex: 1, 
                alignSelf: 'stretch', 
                flexDirection: 'row', 
                padding:10}} key="1">
                <View style={styles.tableRow}>
                    <Text style={{fontSize:20, fontWeight:"bold"}}> Surgeon Name </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{fontSize:20, fontWeight:"bold"}}> Role</Text>
                </View>
                </View> 
            </View>
            <View style={styles.tablecontainer}>
                { 
                loading ? (
                surgeons.length !== 0 ?
                surgeons.map((surgeon) =>    
                    <View style={styles.rowContainer} key={`${surgeon._id}`}>
                        <View style={styles.tableRow}>
                            <Text> {surgeon.name}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text> {surgeon.role}</Text>
                        </View>  
                    </View>  
                )
                : (<View style={{padding:20}}>
                        <Text>No Data</Text>
                    </View>  
                )
                )
                :(<Text style={{padding:20}}>Loading.....</Text>)
            } 
            </View>
        </View>
    )
}