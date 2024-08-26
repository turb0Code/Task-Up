import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Calendar as CalendarComponent } from 'react-native-calendars';
import { Chip, FAB, Icon, Menu, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist';
import { deleteTask } from '../../api/delete.js';
import { timelineArrange } from "../../api/timeline.js";
import AddPanel from "../../components/add.js";
import { colors } from "../../components/colors.js";
import DarkMode from "../DarkMode.js";
import TagsContext from "../Tags.js";
import TasksContext from '../Tasks.js';

const Calendar = ({ route }) => {

  // THEME
  let { darkMode, setDarkMode } = React.useContext(DarkMode);
  let theme = useTheme();

  // TASKS
  let {tasks, setTasks} = React.useContext(TasksContext);

  // TAGS
  const [filter, setFilter] = React.useState("");
  let apiTags = React.useContext(TagsContext);
  let tags = apiTags;

  if (filter != "" && tasks.length > 0 )
  {
    tasks = tasks.filter(t => { if (t.labels.includes(filter)) { return t; } });
  }
  tasks = timelineArrange(tasks);

  // CALENDAR
  const INITIAL_DATE = new Date().toISOString().substring(0, 10);
  const [selected, setSelected] = React.useState(INITIAL_DATE);

  const marked = React.useMemo(() => {
    let result = {};
    tasks.forEach((t, index) => {
      if (index == 1 && t.length > 0) {
        result[t[0].date] = { marked: true };
      }
      else {
        t.forEach(day => {
          let date = new Date(day[0].normalDate);
          result[date.toISOString().substring(0, 10)] = { marked: true };
        });
      }
    });

    return {
      ...result,
      [selected]: {
        selected: true,
        disableTouchEvent: true,
      }
    };
  }, [selected]);

  //ADD TASK MODAL
  const [addTask, setAddTask] = React.useState(false);
  let [addTaskDate, setAddTaskDate] = React.useState(new Date());
  const snapPoints = React.useMemo(() => ['57%'], []);
  const bottomSheetModalRef = React.useRef(null);

  const addNewTask = () => {
    bottomSheetModalRef.current?.present();
    setAddTask(true);

  }

  // TASKS
  let [menusVisible, setMenusVisible] = React.useState(new Array(20).fill(false));
  const [presentedTasks, setPresentedTasks] = React.useState(null);
  let [taskToEdit, setTaskToEdit] = React.useState({});

  // function to delete task on server by id
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

  // function to prepare tasks for showing them below calendar
  const displayTasks = (date) => {
    let dates = Object.keys(marked).splice(Object.keys(marked).indexOf(date), 1);

    if (dates.includes(date)) {
      setPresentedTasks(<Text variant="titleLarge">Found tasks</Text>);

      if (tasks[1][0].date == date) {
        setPresentedTasks(tasks[1]);
        return;
      }

      tasks[0].forEach(day => {
        let dayDate = new Date(day[0].normalDate);
        if (dayDate.toISOString().substring(0, 10) == date) {
          day.splice(0, 1);
          setPresentedTasks(day);
          return;
        }
      });

      tasks[2].forEach(day => {
        let dayDate = new Date(day[0].normalDate);
        if (dayDate.toISOString().substring(0, 10) == date) {
          day.splice(0, 1);
          setPresentedTasks(day);
          return;
        }
      });
    }
    else {
      setPresentedTasks(null);
      return;
    }
  }

  // TIMELINE
  const renderCircle = (rowData, sectionID, rowID, darkTheme) => {

    let circleColor = {}

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

    let chipBgColor = "#ebdefa"
    if (!("event" in rowData)) {
      chipBgColor = rowData.priority == "1" ? colors.priority_1_background : rowData.priority == "2" ? colors.priority_2_background : rowData.priority == "3" ? colors.priority_3_background : colors.priority_4_background;
    }

    if (rowData.description == "") {
      return(
        <Menu visible={menusVisible[rowData.index]} onDismiss={() => { menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); }} anchor={

          <TouchableRipple style={{flex:1, marginTop: 0}} onLongPress={() => { menusVisible[rowData.index] = true; setMenusVisible([...menusVisible]); }}>
            <>
            <View style={{ flex:1, marginTop:-11 }}>

              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ fontWeight: 'bold', color: theme.grey1, marginRight: 3}}>{rowData.time}</Text>
                <View style={{ marginTop: -2, height: 25, borderRadius: 8, backgroundColor: chipBgColor, paddingHorizontal: 6, paddingVertical: 0, minWidth: 25, display: "flex", justifyContent: "center" }}>

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

        <TouchableRipple style={{flex:1, marginTop: -11}} onLongPress={() => { menusVisible[rowData.index] = true; setMenusVisible([...menusVisible]); }}>
          <>
            <View style={{ display: "flex", flexDirection: "row" }}>

              <Text style={{ fontWeight: 'bold', color: theme.grey1, marginRight: 3}}>{rowData.time}</Text>
              <View style={{ marginTop: -2, height: 25, borderRadius: 8, backgroundColor: chipBgColor, paddingHorizontal: 6, paddingVertical: 0, minWidth: 25, display: "flex", justifyContent: "center" }}>

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
        <Menu.Item onPress={() => { setTaskToEdit(rowData); taskToEdit = rowData; menusVisible[rowData.index] = false; setMenusVisible([...menusVisible]); editSheetModalRef.current?.present(); }} leadingIcon="square-edit-outline" title="Edit" />

      </Menu>
    );
  }

  return (
    <>

      {/* FILTER PANEL */}
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 0, marginTop: 2 }}>
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


      {/* CALENDER VIEW */}
      <CalendarComponent key={theme.colors.primary} markingType='dot' markedDates={marked} onDayPress={day => { setSelected(day.dateString); displayTasks(day.dateString); }} enableSwipeMonths={true} theme={{calendarBackground: theme.colors.background, selectedDayBackgroundColor: theme.colors.primaryContainer, monthTextColor: theme.colors.onBackground, arrowColor: theme.colors.onBackground, textDisabledColor: "#999999", dayTextColor: theme.colors.onBackground}}></CalendarComponent>


      {/* LIST OF TASKS FOR PICKED DAY */}
      <ScrollView style={{ marginTop: 0 }}>
        {
          presentedTasks == null ? <Text style={{ alignSelf: "center", fontWeight: "bold", marginTop: 10 }} variant="titleLarge">No planned tasks</Text> :
            <Timeline
              key={`${darkMode}`}
              style={{ marginTop: 10, marginLeft: 8 }}
              innerCircle="dot"
              dotColor="#eeeeee"
              showTime={false}
              data={presentedTasks}
              renderDetail={ (rowData, sectionID, rowID) => { return renderTask(rowData, sectionID, rowID, darkMode); }}
              renderCircle={ (rowData, sectionID, rowID) => { return renderCircle(rowData, sectionID, rowID, darkMode); }}
              options={{ extraData: darkMode, refreshing: true }} />
        }
      </ScrollView>


      {/* TASK ADD BUTTON */}
      <FAB icon="plus" style={styles.fab}/>


      {/* CARD FOR ADDING TASK */}
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


    </>
  );
};

export default Calendar;

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
  }
});
