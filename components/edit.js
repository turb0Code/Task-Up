import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DAY_OF_WEEK } from '@react-native-community/datetimepicker/src/constants';
import React from 'react';
import { TextInput, View } from 'react-native';
import { Button, Checkbox, Chip, Divider, Icon, TextInput as MaterialTextInput, Menu, Modal, Portal, Text, TouchableRipple, useTheme } from 'react-native-paper';
import WheelPicker from 'react-native-wheely';
import TagsContext from '../navigation/Tags.js';
import { colors } from './colors.js';


const EditPanel = ({ sheetRef, reload, reloadTags, task }) => {

  console.log("DASDAS");
  console.log(task);

  // THEME
  let theme = useTheme();

  // TAKE REAL TASK
  task.date = new Date(task.date);

  // TITLE AND DESCRIPTION
  let [title, setTitle] = React.useState(task.title);
  let [description, setDescription] = React.useState(task.description);

  // PRIORITY
  let [priority, setPriority] = React.useState(task.priority);
  let [priorityText, setPriorityText] = React.useState(
    task.priority == "1" ? "None I" : task.priority == "2" ? "Low II" : task.priority == "3" ? "Mid III" : task.priority == "4" ? "High IV" : "Priority"
  );

  // TAGS
  let possibleTags = React.useContext(TagsContext);
  let tags = React.useContext(TagsContext);
  let [pickedTags, setPickedTags] = React.useState(task.tags);
  possibleTags = Object.keys(possibleTags).filter(tag => tag != "REMINDER" && tag != "EVENT");
  let [createTag, setCreateTag] = React.useState(false);
  let [pickedTagColor, setPickedTagColor] = React.useState("slamon");
  let [newTagName, setNewTagName] = React.useState("");

  // EVENT
  let [event, setEvent] = React.useState("event" in task ? true : false);

  // TAGS AND PRIORITY MENUS
  const [tagMenuVisible, setTagMenuVisible] = React.useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = React.useState(false);
  const [alertsMenuVisible, setAlertsMenuVisible] = React.useState(false);
  const [repeatMenuVisible, setRepeatMenuVisible] = React.useState(false);
  let [priorityColor, setPriorityColor] = React.useState(
    task.priority == "1" ? colors.priority_1 : task.priority == "2" ? colors.priority_2 : task.priority == "3" ? colors.priority_3 : task.priority == "4" ? colors.priority_4 : "#5E35B1"
  );

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
  const [date, setDate] = React.useState(new Date());
  let [time, setTime] = React.useState(null);
  const [maxDate] = React.useState(new Date('2030'));
  const [firstDayOfWeek] = React.useState(DAY_OF_WEEK.Monday);
  const [dateFormat] = React.useState('longdate');
  const [dayOfWeekFormat] = React.useState('{dayofweek.abbreviated(2)}',);
  let [pickedDate, setPickedDate] = React.useState(`${task.date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`);
  let [pickedTime, setPickedTime] = React.useState("Time");

  const onPickDate = (event, date) => {
    setPickDate(false);
    setDate(new Date(date.getTime() + 2 * 60 * 60 * 1000));
    let today = new Date().toLocaleDateString('en-US', {month: 'short',day: 'numeric'});
    date = date.toLocaleDateString('en-US', {month: 'short',day: 'numeric'});
    if (event.type == "set" && date != today) {
      setPickedDate(date);
    }
    else {
      setPickedDate("Today");
    }
  }

  const onPickTime = (event, date) => {
    setPickTime(false);
    if (event.type == "set") {
      setPickedTime(`${date.getHours()}:${date.getMinutes()}`);
      setTime(date);
    }
  }

  const editTask = () => {

  }

  return(
    <View style={{ width: "100%", paddingLeft: 10, paddingRight: 10, paddingTop: 0, backgroundColor: theme.colors.background}}>


      {/* TIME AND PRIORITY ROW */}
      <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 0 }}>

        {/* DATE */}
        <Button onPress={() => { setPickDate(true); }} icon="calendar" style={{ width: "auto", borderRadius: 8, marginTop: 1.5, alignSelf: "flex-start", marginLeft: -12, paddingTop: 2 }} labelStyle={{ fontSize: 15, marginTop: 0, marginBottom: 0, marginLeft: 13, marginRight: 0 }} contentStyle={{ marginHorizontal: 0, paddingTop: 2 }} textColor={task.overdue == true ? "#a32424" : theme.colors.primary}>{pickedDate}</Button>

        {/* PRIORITY PICKER */}
        <Menu
          style={{ borderRadius: 9 }}
          visible={priorityMenuVisible}
          onDismiss={closePriorityMenu}
          anchor={
            <Chip onPress={openPriorityMenu} compact={true} icon={() => <Icon color="#000000" size={16} source="flag-triangle"></Icon>} style={{ width: "auto", borderRadius: 8, alignSelf: "flex-end", backgroundColor: `rgba(${priorityColor.background}, 0.6)`, marginTop: 0, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }} textStyle={{ color: "black", marginTop: 0, marginBottom: 0 }} labelStyle={{ fontSize: 16, marginTop: 0, marginBottom: "auto", marginLeft: 12, marginRight: 0, color: "black", alignSelf: "center", padding: 0 }}>{priorityText}</Chip>
        }>

          <Menu.Item onPress={() => { setPriority(4); setPriorityText("High IV"); setPriorityColor(colors.priority_4); closePriorityMenu(); }} title="High Priority" />
          <Menu.Item onPress={() => { setPriority(3); setPriorityText("Mid III"); setPriorityColor(colors.priority_3); closePriorityMenu(); }} title="Medium Priority" />
          <Menu.Item onPress={() => { setPriority(2); setPriorityText("Low II"); setPriorityColor(colors.priority_2); closePriorityMenu(); }} title="Low Priority" />
          <Menu.Item onPress={() => { setPriority(1); setPriorityText("None I"); setPriorityColor(colors.priority_1); closePriorityMenu(); }} title="No Priority" />
          <Menu.Item onPress={() => { setEvent(!event); setPriorityText("EVENT"); setPriorityColor(colors.event); closePriorityMenu(); }} title="EVENT" />

        </Menu>
      </View>

      {/* TITLE AND DESCRIPTION */}
      <BottomSheetTextInput value={title} onChangeText={setTitle} placeholder="What would you like to do?" style={{ marginTop: 3, marginBottom: 0, height: 30, fontSize: 20, fontWeight: "bold", color: theme.colors.onBackground }} placeholderTextColor={theme.colors.onBackground} />
      <TextInput value={description} onChangeText={setDescription} placeholder="Description" style={{ height: 20, fontSize: 16, color: theme.colors.onBackground }} placeholderTextColor={theme.colors.onBackground}></TextInput>

      {/* TAGS */}
      <View style={{ flexDirection: "row", height: 35, marginTop: 70, marginLeft: 0 }}>

        {
          pickedTags.map((tag, index) => {
            if (tag != "REMINDER" && tag != "EVENT") {
              return( <Chip key={index} onClose={() => { setPickedTags(pickedTags.filter(t => t != tag)) }} closeIcon="close" compact={true} style={{ marginRight: 5, marginTop: 2, backgroundColor: colors[tags[tag]] }}>{tag}</Chip> );
            }
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


      {/* SECOND ROW */}
      <View style={{ flexDirection: "row", marginTop: 10, width: "100%", justifyContent: "space-between", alignSelf: "center", gap: 6 }}>

        {/* TIME PICKER */}
        <Button onPress={() => { setPickTime(true); }} icon="clock-outline" mode="outlined" style={{ width: 107, borderRadius: 10 }}>{pickedTime}</Button>

        {/* REMINDERS PICKER MENU */}
        <Menu
          style={{ flex: 1, borderRadius: 10 }}
          visible={alertsMenuVisible}
          onDismiss={closeAlertMenu}
          anchor={
            <Button disabled={time == null ? true : false} onPress={openAlertMenu} icon="bell" mode="outlined" style={{ width: 107, borderRadius: 10 }}>{reminderCounter == 0 ? "Alerts" : reminderCounter}</Button>
        }>

          {
            options.map((option, index) => {
              return(
                <View style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                  <Checkbox status={pickedReminders[index]? 'checked' : 'unchecked'} onPress={() => { closeAlertMenu(); handleCheckBox(index); changeReminder(option.daysBefore, new Date(time.getTime()-60*60*1000*option.hoursBefore), index, option.custom); setReminderRender(option.title); }} title={option.label} />
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
            <Button onPress={openRepeatMenu} icon="repeat" mode="outlined" style={{ width: 107, borderRadius: 10 }}>{repeatString}</Button>
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
      <Button onPress={editTask} icon="plus-thick" mode="contained-tonal" style={{ borderRadius: 10, marginTop: 10 }}>Edit task</Button>


      {/* CARD FOR CREATING NEW TAG */}
      <Portal>

        <Modal visible={createTag} onDismiss={() => { setCreateTag(false); }} contentContainerStyle={{ padding: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>

          <View style={{ width: "100%", backgroundColor: theme.colors.background, padding: 10, borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>

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

          <View style={{ width: "80%", backgroundColor: theme.colors.background, padding: 10, borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

              <WheelPicker
                selectedIndicatorStyle={{ backgroundColor: theme.colors.elevation.level3 }}
                itemTextStyle={{ color: theme.colors.onBackground }}
                itemStyle={{ backgroundColor: theme.colors.elevation.level0 }}
                selectedIndex={daysBefore}
                options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]}
                onChange={(index) => setDaysBefore(index)}
              />

              <Text style={{ marginLeft: 10, marginRight: 10 }}>days</Text>

              <WheelPicker
                selectedIndicatorStyle={{ backgroundColor: theme.colors.elevation.level3 }}
                itemTextStyle={{ color: theme.colors.onBackground }}
                itemStyle={{ backgroundColor: theme.colors.elevation.level0 }}
                selectedIndex={customHours}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]}
                onChange={(index) => setCustomHours(index)}
              />

              <Text style={{ marginLeft: 5, marginRight: 5 }}>:</Text>

              <WheelPicker
                selectedIndicatorStyle={{ backgroundColor: theme.colors.elevation.level3 }}
                itemTextStyle={{ color: theme.colors.onBackground }}
                itemStyle={{ backgroundColor: theme.colors.elevation.level0 }}
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

export default EditPanel;