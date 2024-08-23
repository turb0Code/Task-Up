import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, FAB, Icon, Menu, Snackbar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist';
import { completeTask } from '../../api/complete.js';
import { getApi } from "../../api/connect.js";
import { deleteTask } from '../../api/delete.js';
import { timelineArrange } from "../../api/timeline.js";
import AddPanel from "../../components/add.js";
import { colors } from "../../components/colors.js";
import EditPanel from '../../components/edit.js';
import DarkMode from "../DarkMode.js";
import TagsContext from "../Tags.js";
import TasksContext from '../Tasks.js';

const TimelineComponent = ({ route }) => {

  let { darkMode, setDarkMode } = React.useContext(DarkMode);
  let theme = useTheme();

  let api = {};
  getApi().then(a => {
    api = a;
  });

  let todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  let {tasks, setTasks} = React.useContext(TasksContext);
  let apiTags = React.useContext(TagsContext);
  let tags = apiTags;

  // DELETE/EDIT MENU TRIGGERED
  const [filter, setFilter] = useState("");


  if (filter != "" && tasks.length > 0 )
  {
    tasks = tasks.filter(t => { if (t.labels.includes(filter)) { return t; } });
  }
  tasks = timelineArrange(tasks);
  console.log(tags);


  const snapPoints = React.useMemo(() => ['57%'], []);
  const bottomSheetModalRef = React.useRef(null);
  const editSheetModalRef = React.useRef(null);

  const [addVisible, setAddVisible] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [addTask, setAddTask] = useState(false);
  let [taskToEdit, setTaskToEdit] = useState({});
  let [addTaskDate, setAddTaskDate] = useState(new Date());
  let [menusVisible, setMenusVisible] = React.useState(new Array(20).fill(false));
  console.log(menusVisible.length);

  const addNewTask = () => {
    bottomSheetModalRef.current?.present();
    setAddTask(true);

  }

  const toogleAddSnackBar = () => {
    setAddVisible(true);
    setTimeout(() => {
      setAddVisible(false);
    }, 3000);
  }

  const deleteT = (id) => {
    setDeleteVisible(true);
    deleteTask(api, id);
    setTimeout(() => {
      route.params.reloadTasks();
    }, 1000)
    setTimeout(() => {
      setDeleteVisible(false);
    }, 3000);
  }

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

  let overdue = tasks[0];
  let today = tasks[1];
  let future = tasks[2];

  const calculateGaps = () => {
    todayDate = new Date();
    future = future.flatMap(tasks => {
      let futureDayGaps = [];
      let date = new Date(tasks[1].date);
      let daysDifference = Math.ceil(Math.abs(date - todayDate) / (1000 * 60 * 60 * 24));

      if (daysDifference > 1) {
        for (let i = 1; i < daysDifference; i++) {
          let gapDate = new Date(todayDate);
          gapDate.setDate(gapDate.getDate() + i);
          futureDayGaps.push({time: gapDate.toLocaleDateString('en-US', {weekday: 'short', day: 'numeric', month: 'short'}), normalDate: gapDate});
        }
        todayDate = new Date(tasks[1].date);
        return [futureDayGaps, [...tasks]];
      }

      todayDate = new Date(tasks[1].date);
      return [tasks];
    });
  }

  calculateGaps();

  const renderCircle = (rowData, sectionID, rowID, darkTheme) => {

    let circleColor = {}
    if ("dateChange" in rowData) {
      circleColor = {
        borderColor: "#cccccc",
        marginTop: sectionID == 0 ? 0 : 15,
      };
    }
    else if ("overdue" in rowData) {
      circleColor = {
        borderColor: "#a32424",
      };
    }

    let circleSize = 20;
    let circleStyle = {
      padding: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      borderColor: "#007AFF",
      borderStyle: "solid",
      borderWidth: 2,
      left: 22 - circleSize / 2 - (2 - 1) / 2,
    }

    if ("dateChange" in rowData) {
      return(
        <TouchableRipple style={[styles.circle, circleStyle, circleColor, {backgroundColor: `${darkTheme ? "rgb(26, 28, 30)" : "rgb(253, 252, 255)"}`}]} onPress={() => { if (!("overdue" in rowData)) { addNewTask() } }}>{ "overdue" in rowData ? <></> : <Icon size={14} source="plus-thick" color={"#999999"}></Icon>}</TouchableRipple>
      );
    }
    return(
      <TouchableRipple style={[styles.circle, circleStyle, circleColor, {backgroundColor:  theme.colors.background}]} onPress={() => complete(rowData.id)}><></></TouchableRipple>
    );
  }

  const renderTask = (rowData, sectionID, rowID, darkTheme) => {

    let theme = {
      background : `${darkMode ? "rgb(26, 28, 30)" : "rgb(253, 252, 255)"}`,
      grey : `${darkTheme ? "#cbcbcb" : "#4d4d4d"}`,
      grey1 : `${darkTheme ? "#b6b6b6" : "#616161"}`
    }

    if ("dateChange" in rowData) {
      return(
        <View style={{flex:1, marginTop: sectionID == 0 ? -17 : -3}}>
          <Text style={{ fontWeight: 'bold', color: theme.grey}} variant="headlineMedium">{rowData.date}</Text>
        </View>
      );
    }

    let chipBgColor = "#ebdefa"
    if (!("event" in rowData)) {
      chipBgColor = rowData.priority == "1" ? colors.priority_1_background : rowData.priority == "2" ? colors.priority_2_background : rowData.priority == "3" ? colors.priority_3_background : colors.priority_4_background;
    }

    if (rowData.description == "") {
      return(
        <Menu visible={menusVisible[rowData.index]} onDismiss={() => { menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); }} anchor={
          <TouchableRipple style={{flex:1, marginTop: sectionID == 0 ? 1 : 0}} onLongPress={() => { menusVisible[rowData.index] = true; setMenusVisible([...menusVisible]); }}>
            <>
            <View style={{flex:1, marginTop:-11}}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ fontWeight: 'bold', color: theme.grey1, marginRight: 3}}>{rowData.time}</Text>
                <View style={{ marginTop: sectionID == 0 ? 0 : -2, height: 25, borderRadius: 8, backgroundColor: chipBgColor, paddingHorizontal: 6, paddingVertical: 0, minWidth: 25, display: "flex", justifyContent: "center" }}>
                  {
                    "event" in rowData ?
                      <Text variant="labelMedium" style={{ fontWeight: "bold", color: "#000" }}>EVENT</Text> :
                      <Icon size={22} source={rowData.priority == "1" ? "roman-numeral-1" : rowData.priority == "2" ? "roman-numeral-2" : rowData.priority == "3" ? "roman-numeral-3" : "roman-numeral-4"} color="#000"></Icon>
                  }
                </View>
              </View>
              <Text style={{ fontWeight: 'bold' }} variant="titleLarge">{rowData.title}</Text>
              { rowData.tags.map((tag, index)=> <Chip key={index} style={{ alignSelf: "flex-start", backgroundColor: colors[tags[tag]] }} textStyle={{ color: "#000" }}>{tag}</Chip>) }
            </View>
            </>
          </TouchableRipple>
        }>
          <Menu.Item onPress={() => { deleteT(rowData.id); menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); }} leadingIcon="close" title="Delete" />
          <Menu.Item onPress={() => { setTaskToEdit(rowData); taskToEdit = rowData; menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); editSheetModalRef.current?.present(); }} leadingIcon="square-edit-outline" title="Edit" />
        </Menu>
      );
    }

    return(
      <Menu visible={menusVisible[rowData.index]} onDismiss={() => { menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); }} anchor={
        <TouchableRipple style={{flex:1, marginTop: sectionID == 0 ? 1 : -11}} onLongPress={() => { menusVisible[rowData.index] = true; setMenusVisible([...menusVisible]); }}>
          <>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ fontWeight: 'bold', color: theme.grey1, marginRight: 3}}>{rowData.time}</Text>
              <View style={{ marginTop: sectionID == 0 ? 0 : -2, height: 25, borderRadius: 8, backgroundColor: chipBgColor, paddingHorizontal: 6, paddingVertical: 0, minWidth: 25, display: "flex", justifyContent: "center" }}>
                {
                  "event" in rowData ?
                    <Text variant="labelMedium" style={{ fontWeight: "bold", color: "#000" }}>EVENT</Text> :
                    <Icon size={22} source={rowData.priority == "1" ? "roman-numeral-1" : rowData.priority == "2" ? "roman-numeral-2" : rowData.priority == "3" ? "roman-numeral-3" : "roman-numeral-4"} color="#000"></Icon>
                }
              </View>
            </View>
            <Text style={{ fontWeight: 'bold' }} variant="titleLarge">{rowData.title}</Text>
            <Text variant="titleMedium">{rowData.description}</Text>
            { rowData.tags.map((tag, index) => <Chip key={index} style={{ alignSelf: "flex-start", backgroundColor: colors[tags[tag]] }} textStyle={{ color: "#000" }}>{tag}</Chip>) }
          </>
        </TouchableRipple>
      }>
        <Menu.Item onPress={() => { deleteT(rowData.id); menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); }} leadingIcon="close" title="Delete" />
        <Menu.Item onPress={() => { setTaskToEdit(rowData); taskToEdit = rowData; console.log(taskToEdit); menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); editSheetModalRef.current?.present(); }} leadingIcon="square-edit-outline" title="Edit" />
      </Menu>
    );
  }

  return (
    <>

      <View style={{ display: "flex", flexDirection: "row", marginBottom: 9, marginTop: 2 }}>
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


      <ScrollView>

      {
        overdue.map((dailyTasks, index) => {
          return(
            <Timeline
              style={{ marginBottom: 2 }}
              key={`${index}-${darkMode}`}
              innerCircle="dot"
              lineColor="#a32424"
              showTime={false}
              data={dailyTasks}
              theme={theme}
              renderDetail={(rowData, sectionID, rowID) => { return renderTask(rowData, sectionID, rowID, darkMode); }}
              renderCircle={(rowData, sectionID, rowID) => { return renderCircle(rowData, sectionID, rowID, darkMode); }}
              options={{ extraData: darkMode, refreshing: true }} />
          );
        })
      }

      <Text style={{ fontWeight: 'bold', textAlign: "center", marginTop: 5 }} variant="displayMedium">Today</Text>
      <Text style={{ textAlign: "center", marginBottom: 10 }} variant="titleSmall">{new Date().toLocaleDateString('en-US', {weekday: 'short', day: 'numeric', month: 'short'})}</Text>

      <Timeline
        key={`${darkMode}`}
        style={{ marginBottom: 15 }}
        innerCircle="dot"
        dotColor="#eeeeee"
        showTime={false}
        data={today}
        renderDetail={(rowData, sectionID, rowID) => { return renderTask(rowData, sectionID, rowID, darkMode); }}
        renderCircle={ (rowData, sectionID, rowID) => { return renderCircle(rowData, sectionID, rowID, darkMode); }}
        options={{ extraData: darkMode, refreshing: true }} />

      {
        future.map((dailyTasks, index) => {
          if ("dateChange" in dailyTasks[0]) {
            return(
              <Timeline
                style={{ marginTop: 15, marginBottom: 2 }}
                key={`${index}-${darkMode}`}
                innerCircle="dot"
                dotColor={theme.colors.background}
                showTime={false}
                data={dailyTasks}
                renderDetail={(rowData, sectionID, rowID) => { return renderTask(rowData, sectionID, rowID, darkMode); }}
                renderCircle={(rowData, sectionID, rowID) => { return renderCircle(rowData, sectionID, rowID, darkMode); }} />
            );
          }
          else {
            return dailyTasks.map((task, i) => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple style={{ padding: "auto", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 20 / 2, backgroundColor: theme.colors.background, borderColor: "#bbbbbb", borderStyle: "solid", borderWidth: 2, left: 22 - 20 / 2 - (2 - 1) / 2, marginTop: 6 }} onPress={() => addNewTask()}><Icon size={14} source="plus-thick" color={"#999999"}></Icon></TouchableRipple>
                <Text style={{ fontWeight: 700, marginLeft: 18, color: theme.additionalColors.grey1, marginTop: 2 }} key={i} variant="titleLarge"> {task.time}</Text>
              </View>
            ));
          }
        })
      }

      </ScrollView>
      <FAB onPress={() => { addNewTask(); } } icon="plus" style={styles.fab} />
      <Snackbar visible={addVisible}>Added new task!</Snackbar>
      <Snackbar visible={completeVisible}>Completed task!</Snackbar>
      <Snackbar visible={deleteVisible}>Deleted task!</Snackbar>

      <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
        >
        <BottomSheetView style={styles.contentContainer}>
          <AddPanel sheetRef={bottomSheetModalRef} reload={route.params.reloadTasks} reloadTags={route.params.reloadTags} defaultDate={addTaskDate}/>
        </BottomSheetView>
      </BottomSheetModal>

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
}

export default TimelineComponent;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    zIndex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});