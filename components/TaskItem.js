import React, { useState } from "react";
import { Text, ListItem } from "react-native-elements";

import { ActionSheet } from "./ActionSheet";
import { Task } from "../schemas";
import { getRealmApp } from "../getRealmApp";

const app = getRealmApp();

export function TaskItem({ task }) {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [user, setUser] = useState(app.currentUser);
  const setTaskStatus = (task, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    if (
      ![
        Task.STATUS_OPEN,
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid status: ${status}`);
    }
    const projectRealm = realmRef.current;

    projectRealm.write(() => {
      task.status = status;
    });
  };

  // Define the function for deleting a task.
  const deleteTask = (task) => {
    const projectRealm = realmRef.current;
    projectRealm.write(() => {
      projectRealm.delete(task);
      setTasks([...projectRealm.objects("Task").sorted("name")]);
    });
  };
  const actions = [
    {
      title: "Delete",
      action: () => {
        deleteTask(task);
      },
    },
  ];

  // For each possible status other than the current status, make an action to
  // move the task into that status. Rather than creating a generic method to
  // avoid repetition, we split each status to separate each case in the code
  // below for demonstration purposes.
  if (task.status !== "" && task.status !== Task.STATUS_OPEN) {
    actions.push({
      title: "Mark Open",
      action: () => {
        setTaskStatus(task, Task.STATUS_OPEN);
      },
    });
  }
  if (task.status !== Task.STATUS_IN_PROGRESS) {
    actions.push({
      title: "Mark In Progress",
      action: () => {
        setTaskStatus(task, Task.STATUS_IN_PROGRESS);
      },
    });
  }
  if (task.status !== Task.STATUS_COMPLETE) {
    actions.push({
      title: "Mark Complete",
      action: () => {
        setTaskStatus(task, Task.STATUS_COMPLETE);
      },
    });
  }

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => {
          if (task.status) {
            setActionSheetVisible(false);
          }
        }}
        actions={actions}
      />
      <ListItem
        key={task.id}
        onPress={() => {
          setActionSheetVisible(true);
        }}
        title={task.name}
        bottomDivider
        checkmark={
          task.status === Task.STATUS_COMPLETE ? (
            <Text>&#10004; {/* checkmark */}</Text>
          ) : task.status === Task.STATUS_IN_PROGRESS ? (
            <Text>In Progress</Text>
          ) : null
        }
      />
    </>
  );
}
