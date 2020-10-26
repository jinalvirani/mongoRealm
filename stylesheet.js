import { StyleSheet } from "react-native";
import { ceil } from "react-native-reanimated";

const styles = StyleSheet.create({
  inputContainer: {
    padding: 5,
  },
  inputStyle: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'blue',
    textAlign: 'center',
    padding:20
  },
  buttonView:{
    margin:5,
  },
  homeCardContainer:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent:"space-around",
  },  
  homeCards:{
    width: 50, 
    height: 50, 
    backgroundColor: 'steelblue',
    padding:10,
    minWidth:100,
    minHeight:100,
    marginTop:20,
  },
  homeCardText:
  {
    color:'white',
    fontSize:15,
    textAlign:"center",
    paddingTop:20
  },
  addButton:{
    maxWidth:170,
    padding:16,
    backgroundColor:'black',
    margin:10,
    color:'white',
    fontWeight:'bold',
    fontSize:20
  },
  textBox: {
    borderBottomColor:'black',
    borderBottomWidth:1,
    paddingTop:10
  },
  tablecontainer:{
    flex: 1, 
    flexDirection: 'column',
    padding:10
  },
  rowContainer:{
    flex: 1, 
    alignSelf: 'stretch', 
    flexDirection: 'row', 
    padding:10,
    marginTop:10
  },
  tableRow:{ 
    flex: 1, 
    alignSelf: 'stretch' 
  },
  manageTeamWrapper: {
    width: 350,
  },
  manageTeamTitle: {
    marginBottom: 10,
  },
  addTeamMemberInput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginTop: 5,
    fontSize: 18,
  },
  manageTeamButtonContainer: {
    textAlign: "left",
    borderTopColor: "grey",
    borderTopWidth: 1,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  plusButton: {
    fontSize: 28,
    fontWeight: "400",
  },
});

export default styles;
