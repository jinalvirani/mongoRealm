import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider } from "./providers/AuthProvider";
import { TasksProvider } from "./providers/TasksProvider";

import { WelcomeView } from "./views/WelcomeView";
import { ProjectsView } from "./views/ProjectsView";
import { TasksView } from "./views/TasksView";

import { Logout } from "./components/Logout";
import { Task } from "./schemas";
import { cos } from "react-native-reanimated";

import AddRole from './components/AddUserRole';
import HomeScreen from './components/HomeScreen';
import AddHospital from './components/AddHospital';
import AddCases from './components/AddCases';
import Hospitals from './components/Hospitals';
import HospitalDetails from './components/HospitalDetails';
import ListSurgeon from './components/ListSurgeons';
const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome View"
            component={WelcomeView}
            options={{ title: "Mongo Sync Demo" }}
          />
          <Stack.Screen
            name="Hospitals"
            component={Hospitals}
            options={{ title: "Hospitals" }}
          />
          <Stack.Screen
            name="AddHospital"
            component={AddHospital}
            options={{ title: "Add Hospital" }}
          />
          <Stack.Screen
            name="HospitalDetails"
            component={HospitalDetails}
            options={{ title: "Details" }}
          />
          <Stack.Screen
            name="AddRole"
            component={AddRole}
            options={{ title: "Add Hospital Member" }}
          />
           <Stack.Screen
            name="Surgeons"
            component={ListSurgeon}
            options={{ title: "List Surgeons" }}
          />
           <Stack.Screen
            name="Cases"
            component={AddCases}
            options={{ title: "Add Cases" }}
          />
          
          <Stack.Screen
            name="Projects"
            component={ProjectsView}
            title="ProjectsView"
            headerBackTitle="log out"
            options={{
              headerLeft: function Header() {
                return <Logout />;
              },
            }}
          />
          <Stack.Screen name="Task List">
            {(props) => {
              const { navigation, route } = props;
              const { user, projectPartition } = route.params;
              // console.log("props",props);
              // console.log("route param",route.params);
              return (
                  <TasksView navigation={navigation} route={route} />
              );
            }}
          </Stack.Screen> 
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
