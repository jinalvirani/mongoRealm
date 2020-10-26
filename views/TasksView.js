import React, { useState, useEffect, useRef } from "react";

import { View, Button } from "react-native";
import styles from "../stylesheet";

import { Overlay } from "react-native-elements";
import { ManageTeam } from "../components/ManageTeam";

import { TaskItem } from "../components/TaskItem";
import { AddTask } from "../components/AddTask";
import { getRealmApp } from "../getRealmApp";
import { Task } from "../schemas";

const app = getRealmApp();
export function TasksView({ navigation, route }) {
  const { name,projectPartition } = route.params;

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [user, setUser] = useState(app.currentUser);
  const [tasks, setTasks] = useState([]);
  const realmRef = useRef(null);

useEffect(() => {
  const config = {
    sync: {
      user: user,
      partitionValue: projectPartition,
    },
  };
  // open a realm for this particular project
  Realm.open(config).then((projectRealm) => {
    realmRef.current = projectRealm;
    const syncTasks = projectRealm.objects("Task");
    let sortedTasks = syncTasks.sorted("name");
    setTasks([...sortedTasks]);
    sortedTasks.addListener(() => {
      setTasks([...sortedTasks]);
    });
  });
}, [user, projectPartition]);

const createTask = (newTaskName) => {
    const projectRealm = realmRef.current;
    projectRealm.write(() => {
      projectRealm.create(
        "Task",
        new Task({
          name: newTaskName || "New Task",
          partition: projectPartition,
        })
      );
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: function Header() {
        return <AddTask createTask={createTask} />;
      },
      title: `${name}'s Tasks`,
    });
  }, []);

  return (
    <View>
      {tasks.map((task) =>
        task ? <TaskItem key={`${task._id}`} task={task} /> : null
      )}

      {name === "My Project" ? (
        <>
          <View style={styles.manageTeamButtonContainer}>
            <Button
              title="Manage Team"
              onPress={() => setOverlayVisible(true)}
            />
          </View>
          <Overlay
            isVisible={overlayVisible}
            onBackdropPress={() => setOverlayVisible(false)}
          >
            <ManageTeam />
          </Overlay>
        </>
      ) : null}
    </View>
  );
}
