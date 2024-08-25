import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, FAB, Icon, Menu, Snackbar, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { completeTask } from '../../api/complete.js';
import { getApi } from "../../api/connect.js";
import { matrixArrange } from "../../api/matrix.js";
import AddPanel from "../../components/add.js";
import { colors } from "../../components/colors.js";
import EditPanel from '../../components/edit.js';
import TagsContext from "../Tags.js";
import TasksContext from '../Tasks.js';

const Matrix = ({ route }) => {

  // THEME
  let theme  = useTheme();

  // API
  let api = {};
  getApi().then(a => {
    api = a;
  });

  // FILTERS
  const [filter, setFilter] = useState("");

  // ADD TASK CARD
  const snapPoints = React.useMemo(() => ['57%'], []);
  const bottomSheetModalRef = React.useRef(null);
  const [addTask, setAddTask] = useState(false);
  let [addTaskDate, setAddTaskDate] = useState(new Date());

  // EDIT TASK CARD
  const editSheetModalRef = React.useRef(null);
  let [taskToEdit, setTaskToEdit] = useState({});

  // COMPLETE TASK
  const [completeVisible, setCompleteVisible] = useState(false);

  // TASKS
  let [matrixTasks, setMatrixTasks] = useState({uI: 0, nuI: 0, uUI: 0, nuUI: 0});
  let { tasks } = React.useContext(TasksContext);

  // TAGS
  let apiTags = React.useContext(TagsContext);
  let tags = apiTags;

  // RELOAD WHEN ROUTE CHANGES
  React.useEffect(() => {
    if (filter !== "") {
      tasks = tasks.filter(t => { if (t.labels.includes(filter)) { return t; } else { return null; } } );
    }
    matrixArrange(tasks)
      .then(finalOutput => {
        setMatrixTasks(finalOutput);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, [route]);

  // RELOAD VIEW ON FILTER PICK OR WHEN TASKS CHANGE
  React.useEffect(() => {
    if (filter !== "") {
      tasks = tasks.filter(t => { if (t.labels.includes(filter)) { return t; } else { return null; } } );
    }
    matrixArrange(tasks)
      .then(finalOutput => {
        setMatrixTasks(finalOutput);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, [filter, tasks]);

  // function to mark task on server as completed
  const complete = (id) => {
    setCompleteVisible(true);
    completeTask(api, id);
    setTimeout(() => {
      route.params.reloadTasks();
    }, 1000)
    setTimeout(() => {
      setCompleteVisible(false);
    }, 3000);
  }

  // function to show card for adding task
  const addNewTask = () => {
    bottomSheetModalRef.current?.present();
    setAddTask(true);
  }

  // function to render tasks on each list
  const renderTasks = (tasks, color) => {

    // task menu visibility
    let [visibility, setVisibility] = React.useState([]);

    if (tasks.length > 0) {

      if (!visibility.includes(true)) {
        visibility = new Array(tasks.length).fill(false);  // 
      }

      return (
        <>
          {
            tasks.map((task, index) => { return(
              <Menu visible={visibility[index]} onDismiss={() => { setVisibility(visibility.map(s => false)); }} anchor={

                <TouchableRipple onLongPress={() => { setVisibility(visibility.map((s, i) => i == index ? true : false)); }} key={index} style={{ display: "flex", flexDirection: "row", display: "flex", alignItems: "center", marginLeft: 9, marginBottom: 2 }}>

                  <>
                    <TouchableRipple onPress={() => { complete(task.id) }} style={[styles.circle, { borderColor: color, alignSelf: "flex-start", marginTop: 4 }]}><></></TouchableRipple>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                      <Text variant="titleSmall" style={{ marginLeft: 5 }}>{task.title}</Text>
                      <Text variant="labelMedium" style={{ marginLeft: 5, marginTop: -2 }}>{task.time}</Text>
                    </View>
                  </>

                </TouchableRipple>

              }>

                <Menu.Item onPress={() => { deleteT(rowData.id); setVisibility(visibility.map(s => false)); }} leadingIcon="close" title="Delete" />
                <Menu.Item onPress={() => { taskToEdit = task; editSheetModalRef.current?.present(); setVisibility(visibility.map(s => false)); }} leadingIcon="square-edit-outline" title="Edit"/>

              </Menu>
            );})
          }
        </>
      );
    }
    else {
      return (<></>);
    }

  }


  return (
    <>


      {/* FILTER PANEL */}
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 10, marginTop: 2 }}>
        <ScrollView horizontal>

          {
            Object.keys(tags).filter(key => key != "EVENT" && key != "REMINDER").map((key, index) => {
              return(
                <Chip key={index} style={{ alignSelf: "flex-start", marginRight: 2, marginLeft: 2, borderColor: colors[tags[key]], borderStyle: "solid", borderWidth: 2, backgroundColor: `${key == filter ? colors[tags[key]] : theme.colors.background}` }} onPress={() => key == filter ? setFilter("") : setFilter(key)} textStyle={{ color: theme.colors.onBackground }}>{key}</Chip>
              );
            })
          }

        </ScrollView>
      </View>


      {/* PLACE FOR WHOLE MATRIX */}
      <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", height: "90%" }}>

        {/* FIRST ROW OF FIELDS */}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", height: "48.2%", width: "100%"}}>

          {/* URGENT & IMPORTANT */}
          <Surface style={[styles.box]} elevation={1}>
            <View style={{ display: "flex", flexDirection: "row", marginLeft: 5, marginTop: 5, marginBottom: 2 }}>
              <View style={{ width: 22, height: 22, backgroundColor: colors.priority_4_background, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon size={20} source="roman-numeral-4" color="#000"></Icon></View>
              <Text variant="labelLarge" style={{ color: colors.priority_4, marginLeft: 5, marginTop: 1, fontSize: 13 }}>Urgent & Important</Text>
            </View>
            { matrixTasks["uI"] == 0 || matrixTasks["uI"] === undefined ? renderTasks([], colors.priority_4) : renderTasks(matrixTasks["uI"], colors.priority_4) }
          </Surface>

          {/* NOT URGENT & IMPORTANT */}
          <Surface style={[styles.box]} elevation={1}>
            <View style={{ display: "flex", flexDirection: "row", marginLeft: 5, marginTop: 5, marginBottom: 2 }}>
              <View style={{ width: 22, height: 22, backgroundColor: colors.priority_3_background, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon size={20} source="roman-numeral-3" color="#000"></Icon></View>
              <Text variant="labelLarge" style={{ color: colors.priority_3, marginLeft: 5, marginTop: 1, fontSize: 13 }}>Not Urgent & Important</Text>
            </View>
            { matrixTasks["nuI"] == 0 || matrixTasks["nuI"] === undefined ? renderTasks([], colors.priority_3) : renderTasks(matrixTasks["nuI"], colors.priority_3) }
          </Surface>

        </View>

        {/* SECOND ROW OF FIELDS */}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", height: "48.2%", width: "100%"}}>

          {/* URGENT & UNIMPORTANT */}
          <Surface style={[styles.box]} elevation={1}>
            <View style={{ display: "flex", flexDirection: "row", marginLeft: 5, marginTop: 5, marginBottom: 2 }}>
              <View style={{ width: 22, height: 22, backgroundColor: colors.priority_2_background, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon size={20} source="roman-numeral-2" color="#000"></Icon></View>
              <Text variant="labelLarge" style={{ color: colors.priority_2, marginLeft: 5, marginTop: 1, fontSize: 13 }}>Urgent & Unimportant</Text>
            </View>
            { matrixTasks["uUI"] == 0 || matrixTasks["uUI"] === undefined ? renderTasks([], colors.priority_2) : renderTasks(matrixTasks["uUI"], colors.priority_2) }
          </Surface>

          {/* NOT URGENT & UNIMPORTANT */}
          <Surface style={[styles.box]} elevation={1}>
            <View style={{ display: "flex", flexDirection: "row", marginLeft: 3, marginTop: 5, marginBottom: 2 }}>
              <View style={{ width: 22, height: 22, backgroundColor: colors.priority_1_background, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon size={20} source="roman-numeral-1" color="#000"></Icon></View>
              <Text variant="labelLarge" style={{ color: colors.priority_1, marginLeft: 3, marginTop: 1, fontSize: 12 }}>Not Urgent & Unimportant</Text>
            </View>
            { matrixTasks["nuUI"] == 0 || matrixTasks["nuUI"] === undefined ? renderTasks([], colors.priority_1) : renderTasks(matrixTasks["nuUI"], colors.priority_1) }
          </Surface>

        </View>

      </View>


      {/* BUTTON TO ADD NEW TASK */}
      <FAB onPress={() => addNewTask() } icon="plus" style={styles.fab} />


      {/* SNACKBARS */}
      <Snackbar visible={completeVisible}>Completed task!</Snackbar>


      {/* CARD WITH MENU FOR ADDING NEW TASK */}
      <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
        >
        <BottomSheetView style={[styles.contentContainer]}>
          <AddPanel sheetRef={bottomSheetModalRef} reload={route.params.reloadTasks} reloadTags={route.params.reloadTags} defaultDate={addTaskDate}/>
        </BottomSheetView>
      </BottomSheetModal>


      {/* CARD WITH MENU TO EDIT TASK */}
      <BottomSheetModal
          ref={editSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
        >
        <BottomSheetView style={styles.contentContainer}>
          <EditPanel sheetRef={editSheetModalRef} reload={route.params.reloadTasks} reloadTags={route.params.reloadTags} task={taskToEdit}/>
        </BottomSheetView>
      </BottomSheetModal>


    </>
  );

};

export default Matrix;

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },

    box: {
      width: "46.5%",
      borderRadius: 6,
    },

    circle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#000',
    },

    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
});
