import React,{useState, useEffect, useRef} from "react";
import { View } from "react-native";
import { ListItem,Text } from "react-native-elements";
import { getRealmApp } from "../getRealmApp";

const app = getRealmApp();

export function ProjectsView({ navigation }) {
  const [user, setUser] = useState(app.currentUser);
  const [projectData, setProjectData] = useState([]);
  const realmRef = useRef(null);
useEffect(() => {
    if (!user) {
      return;
    }
  const myProject = { name: "My Project", partition: `project=${user.id}` };
    setProjectData([myProject]);
    const config = {
      sync: {
        user,
        partitionValue: `user=${user.id}`,
      },
    };

    Realm.open(config).then((userRealm) => {
      realmRef.current = userRealm;
      const users = userRealm.objects("User");
      //console.log(users);

      users.addListener(() => {
        // The user custom data object may not have been loaded on
        // the server side yet when a user is first registered.
        if (users.length === 0) {
          setProjectData([myProject]);
        } else {
          const { memberOf } = users[0];
          setProjectData([...memberOf]);
        }
      });
    });

    // return () => {
    //   // cleanup function
    //   const userRealm = realmRef.current;
    //   if (userRealm) {
    //     userRealm.close();
    //     realmRef.current = null;
    //     setProjectData([]); // set project data to an empty array (this prevents the array from staying in state on logout)
    //   }
    // };
  }, [user]);

  const onClickProject = async (project) => {
    navigation.navigate("Task List", {
      name: project.name,
      projectPartition: project.partition,
    });
  };

  return (
    <View>
      <Text>hi</Text>
      {projectData.map((project) => (
        <View key={project.name}>
          <ListItem
            title={project.name}
            onPress={() => onClickProject(project)}
            bottomDivider
            key={project.name}
          />
        </View>
      ))}
    </View>
  );
}
