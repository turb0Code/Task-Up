import DateTimePicker from '@react-native-community/datetimepicker';
import { DAY_OF_WEEK } from '@react-native-community/datetimepicker/src/constants';
import React from 'react';
import { TextInput, View } from 'react-native';
import { Button, Checkbox, Chip, Divider, TextInput as MaterialTextInput, Menu, Modal, Portal, Text, TouchableRipple, useTheme } from 'react-native-paper';
import WheelPicker from 'react-native-wheely';
import { apiAddTask } from '../api/add-task.js';
import { getApi } from "../api/connect.js";
import { apiAddTag } from '../api/tags.js';
import TagsContext from '../navigation/Tags.js';
import { colors } from './colors.js';

const AddPanel = ({ sheetRef, reload, reloadTags, defaultDate }) => {

  // THEME
  let theme = useTheme();

  // API
  let api = {};
  getApi().then(a => {
    api = a;
  });

  // TITLE AND DESCRIPTION
  let [title, setTitle] = React.useState("");
  let [description, setDescription] = React.useState("");

  // PRIORITY
  let [priority, setPriority] = React.useState(1);
  let [priorityText, setPriorityText] = React.useState("Priority");

  // TAGS
  let possibleTags = React.useContext(TagsContext);
  let tags = React.useContext(TagsContext);
  let [pickedTags, setPickedTags] = React.useState([]);
  possibleTags = Object.keys(possibleTags).filter(tag => tag != "REMINDER" && tag != "EVENT");
  let [createTag, setCreateTag] = React.useState(false);
  let [pickedTagColor, setPickedTagColor] = React.useState("slamon");
  let [newTagName, setNewTagName] = React.useState("");

  // EVENT
  let [event, setEvent] = React.useState(false);

  // TAGS AND PRIORITY MENUS
  const [tagMenuVisible, setTagMenuVisible] = React.useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = React.useState(false);
  const [alertsMenuVisible, setAlertsMenuVisible] = React.useState(false);
  const [repeatMenuVisible, setRepeatMenuVisible] = React.useState(false);
  let [priorityColor, setPriorityColor] = React.useState(theme.colors.primary);

  // REPEAT
  let [recurring, setRecurring] = React.useState(false);
  let [repeatString, setRepeatString] = React.useState("Repeat");

  // REMINDERS
  let [options, setOptions] = React.useState([
    {id: 1, label: "Week Before", daysBefore: 7, hoursBefore: 0, custom: false},
    {id: 1, label: "3 days Before", daysBefore: 3, hoursBefore: 0, custom: false},
    {id: 1, label: "Day Before", daysBefore: 1, hoursBefore: 0, custom: false},
    {id: 1, label: "3h Before", daysBefore: 0, hoursBefore: 3,custom: false},
    {id: 1, label: "Hour Before", daysBefore: 0, hoursBefore: 1, custom: false},
    {id: 1, label: "30min Before", daysBefore: 0, hoursBefore: 0.5, custom: false},
  ]);
  let [pickedReminders, setPickedReminders] = React.useState(new Array(options.length).fill(false));
  let [reminders, setReminders] = React.useState([]);
  let [reminderCounter, setReminderCounter] = React.useState(0);
  let [daysBefore, setDaysBefore] = React.useState(null);
  let [remidnerTime, setRemidnerTime] = React.useState(null);
  let [reminderRender, setReminderRender] = React.useState("Alerts");
  let [addCustomBox, setAddCustomBox] = React.useState(false);
  let [customHours, setCustomHours] = React.useState(null);
  let [customMinutes, setCustomMinutes] = React.useState(null);

  const openTagMenu = () => setTagMenuVisible(true);
  const openPriorityMenu = () => setPriorityMenuVisible(true);
  const openAlertMenu = () => setAlertsMenuVisible(true);
  const openRepeatMenu = () => setRepeatMenuVisible(true);

  const closeTagMenu = () => setTagMenuVisible(false);
  const closePriorityMenu = () => setPriorityMenuVisible(false);
  const closeAlertMenu = () => setAlertsMenuVisible(false);
  const closeRepeatMenu = () => setRepeatMenuVisible(false);

  // TIME PICKER VARIABLES
  let [pickDate, setPickDate] = React.useState(false);
  let [pickTime, setPickTime] = React.useState(false);
  let [date, setDate] = React.useState(new Date());
  let [time, setTime] = React.useState(null);
  let [pickedDate, setPickedDate] = React.useState("Date");
  let [pickedTime, setPickedTime] = React.useState("Time");
  const [maxDate] = React.useState(new Date('2030'));
  const [firstDayOfWeek] = React.useState(DAY_OF_WEEK.Monday);
  const [dateFormat] = React.useState('longdate');
  const [dayOfWeekFormat] = React.useState('{dayofweek.abbreviated(2)}',);

  // FUNCTIONS
  const onPickDate = (event, date) => {
    setPickDate(false);  // close menu
    setDate(new Date(date.getTime() + 2 * 60 * 60 * 1000));

    let today = new Date().toLocaleDateString('en-US', {month: 'short',day: 'numeric'});
    date = date.toLocaleDateString('en-US', {month: 'short',day: 'numeric'});

    if (event.type == "set" && date != today) { setPickedDate(date); }
    else { setPickedDate("Today"); }
  }

  const onPickTime = (event, date) => {
    setPickTime(false);  // close menu

    if (event.type == "set") {
      setPickedTime(`${date.getHours()}:${date.getMinutes()}`);
      setTime(date);
    }
  }

  const addTag = () => {
    if (newTagName != "") {
      let tag = {
        name: newTagName,
        color: pickedTagColor
      }
      apiAddTag(api, tag);
    }
    tags[newTagName] = pickedTagColor;
    possibleTags.push(newTagName);  // add to list of tags to pick
    setPickedTags([...pickedTags, newTagName]);  // add tag as picked already
    setCreateTag(false);  // close menu
  }

  // REMINDERS FUNCTIONS
  const handleCheckBox = (index) => {
    let newPicked = [...pickedReminders];
    newPicked[index] = !newPicked[index];
    setPickedReminders(newPicked);
  }

  const addReminder = (days, hour, minutes) => {
    let reminder = {
      daysBefore: days,
      hour: `${hour}:${minutes}`
    };

    let option = {
      id: options.length + 1,
      label: `${days} days at ${hour}:${minutes}`,
      daysBefore: 0,
      hoursBefore: 0,
      custom: true
    }

    setPickedTags([...pickedTags, "REMINDER"]);
    setOptions([...options, option]);
    setReminderCounter(reminderCounter + 1);
    setPickedReminders([...pickedReminders, true]);
    setReminders([...reminders, reminder]);
  }

  const changeReminder = (days, hour, index, custom) => {
    let reminder = {
      daysBefore: days,
      hour: `${hour.getHours}:${hour.getMinutes}`
    };

    if (!pickedReminders[index]) {
      setPickedTags([...pickedTags, "REMINDER"]);
      setReminderCounter(reminderCounter + 1);
      setReminders([...reminders, reminder]);
    }
    else {
      if (custom) {
        setPickedReminders(pickedReminders.filter((v, i) => i != index));
        setOptions(options.filter((o, i) => i != index));
      }

      setReminderCounter(reminderCounter - 1);
      setReminders(reminders.filter(r => r != reminder));
    }
  }


  // PREPARES TASK DATA TO SEND IT TO THE SERVER
  const addTask = () => {
    // date
    let dateTime = "";
    let dateString = date.toLocaleDateString('en-US', {day: 'numeric', month: 'short'});
    let taskDate = [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');

    // description
    let desc = description;

    // time
    if (time != null) {
      dateTime = date.toISOString().slice(0, 10) + time.toISOString().slice(10, time.toISOString().length);
      dateString = dateString + ` ${time.getHours()}:${time.getMinutes()}`;
      taskDate = null;

      // handle reminders
      if (reminders.length > 0) {
        let remindersString = "*!";
        reminders.forEach((reminder, index) => {
          remindersString += reminder.daysBefore + "-" + reminder.hour;
          if (index != reminders.length - 1) { remindersString += "*" }
        });
        remindersString += "!*";
        desc = remindersString + description;
      }
    }

    // check if task is event
    if (event) {
      setPickedTags([...pickedTags, "EVENT"]);
      pickedTags = [...pickedTags, "EVENT"];
    }

    // handle recurring tasks
    if (recurring) { dateString = repeatString; }

    // task prepared to be sent
    let task = {
      title: title,
      description: desc,
      priority: priority,
      tags: pickedTags,
      date: taskDate,
      datetime: dateTime,
      due_string: dateString,
      recurring: recurring
    }

    // task prepared to save it when device is offline
    let offlineTask = {
      content: title,
      description: desc,
      priority: priority,
      labels: pickedTags,
      due: {
        date: taskDate,
        string: dateString,
      },
      recurring: recurring
    }

    // sending task to server
    apiAddTask(api, task);
    setTimeout(() => {
      reload();
    }, 1000);

    // close card
    sheetRef.current?.close();
  }

  return(
    <View style={{ flex: 1, width: "100%", paddingLeft: 10, paddingRight: 10, backgroundColor: theme.colors.background }}>


      {/* TITLE AND DESCRIPTION */}
      <TextInput onChangeText={setTitle} autoFocus={true} placeholder="What would you like to do?" style={{ marginTop: 5, marginBottom: 5, height: 30, fontSize: 20, fontWeight: "bold", color: theme.colors.onBackground }} placeholderTextColor={theme.colors.onBackground} />
      <TextInput onChangeText={setDescription} placeholder="Description" style={{ height: 20, fontSize: 16, color: theme.colors.onBackground }} placeholderTextColor={theme.colors.onBackground}></TextInput>

      {/* TAGS */}
      <View style={{ flexDirection: "row", height: 35, marginTop: 10 }}>

        {
          pickedTags.map((tag, index) => {
            return( <Chip key={index} onClose={() => { setPickedTags(pickedTags.filter(t => t != tag)) }} closeIcon="close" compact={true} style={{ marginRight: 5, marginTop: 2, backgroundColor: colors[tags[tag]] }}>{tag}</Chip> );
          })
        }

        <Menu
          style={{ flex: 1, borderRadius: 10 }}
          visible={tagMenuVisible}
          onDismiss={closeTagMenu}
          anchor={ pickedTags.length == 0
            ? <Button onPress={openTagMenu} mode="text" icon="plus-thick" compact={true} style={{ padding: 0, height: 40}}>Add Tag</Button>
            : <Button onPress={openTagMenu} mode="text" icon="plus-thick" compact={true} style={{ padding: 0, height: 40}}>Add</Button>
        }>

          {
            possibleTags.map((tag, index) => <Menu.Item onPress={() => { setPickedTags([...pickedTags, tag]); closeTagMenu(); }} title={tag} /> )
          }
          <Divider />
          <Menu.Item onPress={() => { setCreateTag(true); closeTagMenu(); }} title="Create tag" />

        </Menu>

      </View>

      {/* TOP ROW */}
      <View style={{ flexDirection: "row", marginTop: 12 }}>

        {/* DATE */}
        <Button onPress={() => { setPickDate(true); }} icon="calendar" mode="outlined" style={{ width: 114, borderRadius: 10, marginRight: 4 }}>{pickedDate}</Button>

        {/* TASK/EVENT BUTTON */}
        <Button onPress={() => { setEvent(!event); }} icon={event ? "calendar-alert" : "checkbox-marked-circle-outline"} mode="outlined" style={{ width: 114, borderRadius: 10, marginRight: 2, marginLeft: 2 }}>{event ? "Event" : "Task"}</Button>

        {/* PRIORITY PICKER */}
        <Menu
          style={{ flex: 1, borderRadius: 10 }}
          visible={priorityMenuVisible}
          onDismiss={closePriorityMenu}
          anchor={
            <Button onPress={openPriorityMenu} icon="flag-triangle" mode="outlined" style={{ width: 114, borderRadius: 10, marginLeft: 4}} theme={{ colors: { primary: priorityColor } }}>{priorityText}</Button>
        }>

          <Menu.Item onPress={() => { setPriority(4); setPriorityText("High IV"); setPriorityColor(colors.priority_4); closePriorityMenu(); }} title="High Priority" />
          <Menu.Item onPress={() => { setPriority(3); setPriorityText("Mid III"); setPriorityColor(colors.priority_3); closePriorityMenu(); }} title="Medium Priority" />
          <Menu.Item onPress={() => { setPriority(2); setPriorityText("Low II"); setPriorityColor(colors.priority_2); closePriorityMenu(); }} title="Low Priority" />
          <Menu.Item onPress={() => { setPriority(1); setPriorityText("None I"); setPriorityColor(colors.priority_1); closePriorityMenu(); }} title="No Priority" />

        </Menu>

      </View>


      {/* SECOND ROW */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>

        {/* TIME PICKER */}
        <Button onPress={() => { setPickTime(true); }} icon="clock-outline" mode="outlined" style={{ width: 114, borderRadius: 10, marginRight: 4 }}>{pickedTime}</Button>

        {/* REMINDERS PICKER MENU */}
        <Menu
          style={{ flex: 1, borderRadius: 10 }}
          visible={alertsMenuVisible}
          onDismiss={closeAlertMenu}
          anchor={
            <Button disabled={time == null ? true : false} onPress={openAlertMenu} icon="bell" mode="outlined" style={{ width: 114, borderRadius: 10, marginRight: 2, marginLeft: 2 }}>{reminderCounter == 0 ? "Alerts" : reminderCounter}</Button>
        }>

          {
            options.map((option, index) => {
              return(
                <View style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                  <Checkbox status={pickedReminders[index]? 'checked' : 'unchecked'} onPress={() => { closeAlertMenu(); handleCheckBox(index); changeReminder(option.daysBefore, time.getTime()-60*60*1000*option.hoursBefore, index, option.custom); setReminderRender(option.title); }} title={option.label} />
                  <Text>{option.label}</Text>
                </View>
              );
            })
          }
          <Divider />
          <Menu.Item onPress={() => { closeAlertMenu(); setAddCustomBox(true); }} title="Custom" />

        </Menu>


        {/* REPEAT PICKER MENU */}
        <Menu
          style={{ flex: 1, borderRadius: 10 }}
          visible={repeatMenuVisible}
          onDismiss={closeRepeatMenu}
          anchor={
            <Button onPress={openRepeatMenu} icon="repeat" mode="outlined" style={{ width: 114, borderRadius: 10, marginLeft: 4 }}>{repeatString}</Button>
        }>

          <Menu.Item onPress={() => { closeRepeatMenu(); setRecurring(true); setRepeatString("every month"); }} title="Monthly" />
          <Menu.Item onPress={() => { closeRepeatMenu(); setRecurring(true); setRepeatString("every week"); }} title="Weekly" />
          <Menu.Item onPress={() => { closeRepeatMenu(); setRecurring(true); setRepeatString("every day")}} title="Daily" />
          <Divider />
          <Menu.Item onPress={() => { closeRepeatMenu(); setRecurring(false); setRepeatString("Repeat")}} title="None" />

        </Menu>

      </View>


      {/* DATE PICKER CARD */}
      {
        pickDate ? <DateTimePicker
          onChange={onPickDate}
          mode="date"
          testID="dateTimePicker"
          value={date}
          firstDayOfWeek={firstDayOfWeek}
          maxDate={maxDate}
          minDate={new Date()}
          time={time}
          dateFormat={dateFormat}
          dayOfWeekFormat={dayOfWeekFormat}
          placeholderText="Pick task date"
          timeZoneName={'Europe/Prague'} /> : null
      }


      {/* TIME PICKER CARD */}
      {
        pickTime ? <DateTimePicker
          onChange={onPickTime}
          mode="time"
          testID="dateTimePicker"
          value={date}
          time={time}
          dateFormat={dateFormat}
          placeholderText="Pick task date"
          timeZoneName={'Europe/Prague'} /> : null
      }


      {/* ADD TASK BUTTON */}
      <Button onPress={addTask} icon="plus-thick" mode="contained-tonal" style={{ borderRadius: 10, marginTop: 10 }}>Add task</Button>


      {/* CARD FOR CREATING NEW TAG */}
      <Portal>

        <Modal visible={createTag} onDismiss={() => { setCreateTag(false); }} contentContainerStyle={{ padding: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>

          <View style={{ width: "100%", backgroundColor: "white", padding: 10, borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>

            <Text variant="titleLarge" style={{ width: "98%", textAlign: "left", marginBottom: 7, marginTop: 2 }}>Create new tag</Text>
            <MaterialTextInput value={newTagName} onChangeText={text => setNewTagName(text)} mode="outlined" label="Tag name" style={{ width: "100%" }}></MaterialTextInput>
            <View style={{ width: "100%", display: "flex", flexDirection: "row", marginTop: 10, justifyContent: "space-evenly" }}>

              {
                Object.entries(colors).slice(0, 10).map(([colorName, value]) =>
                {
                  let borderColor = value;
                  if (pickedTagColor == colorName) { borderColor = "#000000"}
                  return(
                    <TouchableRipple onPress={() => { setPickedTagColor(colorName); }} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: value, borderWidth: 3, borderColor: borderColor}}><></></TouchableRipple>
                  );
                })
              }

            </View>

            <View style={{ width: "100%", display: "flex", flexDirection: "row", marginTop: 7, justifyContent: "space-evenly" }}>
              {
                Object.entries(colors).slice(10, 20).map(([colorName, value]) =>
                {
                  let borderColor = value;
                  if (pickedTagColor == colorName) { borderColor = "#000000"}
                  return(
                    <TouchableRipple onPress={() => { setPickedTagColor(colorName); }} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: value, borderWidth: 3, borderColor: borderColor}}><></></TouchableRipple>
                  );
                })
              }
            </View>

            <View style={{ display: "flex", flexDirection: "row", alignContent: "space-around", marginTop: 8}}>
              <Button onPress={() => { setCreateTag(false); }} icon="close" style={{ marginRight: 25 }}>Cancel</Button>
              <Button onPress={() => { addTag(); }} icon="plus" style={{ marginLeft: 25 }}>Create</Button>
            </View>

          </View>
        </Modal>
      </Portal>


      {/* CARD FOR CREATING CUSTOM REMINDER */}
      <Portal>

        <Modal visible={addCustomBox} onDismiss={() => { setAddCustomBox(false); }} contentContainerStyle={{ padding: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>

          <View style={{ width: "80%", backgroundColor: "white", padding: 10, borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

              <WheelPicker
                selectedIndex={daysBefore}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]}
                onChange={(index) => setDaysBefore(index)}
              />

              <Text style={{ marginLeft: 10, marginRight: 10 }}>days</Text>

              <WheelPicker
                selectedIndex={customHours}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]}
                onChange={(index) => setCustomHours(index)}
              />

              <Text style={{ marginLeft: 5, marginRight: 5 }}>:</Text>

              <WheelPicker
                selectedIndex={customMinutes}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]}
                onChange={(index) => setCustomMinutes(index)}
              />

            </View>


            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Button onPress={() => { setAddCustomBox(false); }} icon="close" style={{ marginRight: 7 }}>Cancel</Button>
              <Button onPress={() => { setAddCustomBox(false); addReminder(daysBefore, customHours, customMinutes); }} icon="plus" style={{ marginLeft: 7 }}>Add alert</Button>
            </View>

          </View>
        </Modal>
      </Portal>


    </View>
  );
}

export default AddPanel;
