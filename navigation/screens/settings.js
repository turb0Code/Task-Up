import * as FileSystem from 'expo-file-system';
import React from 'react';
import { View } from 'react-native';
import { Button, Chip, IconButton, Snackbar, Switch, Text } from 'react-native-paper';
import DarkMode from "../DarkMode.js";


const Settings = ({ route }) => {

  // read settings file
  const readSettingsFile = async () => {
    const settingsFileUri = FileSystem.documentDirectory + "settings.json";
    const fileContents = await FileSystem.readAsStringAsync(settingsFileUri, { encoding: FileSystem.EncodingType.UTF8 });
    const jsonData = JSON.parse(fileContents);
    return jsonData;
    return jsonData["urgentDays"];
  }

  // THEME
  let { darkMode, setDarkMode } = React.useContext(DarkMode);
  let [darkTheme, setDarkTheme] = React.useState(darkMode);

  // NUMBER OF DAYS TREATED AS URGENT
  const [urgentDays, setUrgentDays] = React.useState(7);

  // DELETE TOKEN
  const [tokenDelSnack, setTokenDelSnack] = React.useState(false);

  // READ SETTINGS FROM FILE
  React.useEffect(() => {
    readSettingsFile()
      .then((settings) => {
        setUrgentDays(settings["urgentDays"]);
      });
  }, []);

  // function to handle deleting token from local storage
  const deleteTokenFile = async () => {
    const fileUri = FileSystem.documentDirectory + 'token.json';
    await FileSystem.deleteAsync(fileUri);

    setTokenDelSnack(true);
    setTimeout(() => {
      setTokenDelSnack(false)
      route.params.handleBackToLanding();
    }, 3000);
  }

  // function to handle updating settings in settings file in local storage
  const updateSettingsFile = async () => {
    const settingsFileUri = FileSystem.documentDirectory + "settings.json";
    let settings = {
      urgentDays: urgentDays,
      darkMode: darkTheme,
    };
    console.log(settings);
    const settingsFile = JSON.stringify(settings);

    await FileSystem.writeAsStringAsync(settingsFileUri, settingsFile, { encoding: FileSystem.EncodingType.UTF8 });
  }

  return (
    <View style={{ width: "100%", alignItems: "center", justifyContent: "center", alignContent: "center" }}>


      {/* DARK THEME SWITCH */}
      <View style={{ width: "90%", height: 60, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

        <Text variant="titleMedium" style={{ fontSize: 18 }}>Dark theme</Text>
        <Switch value={darkMode} onValueChange={() => { setDarkTheme(!darkMode); darkTheme = !darkMode; setDarkMode(darkTheme); updateSettingsFile(); }} />

      </View>


      {/* URGENT DAYS SETTING */}
      <View style={{ width: "90%", height: 60, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>

        <Text variant="titleMedium" style={{ fontSize: 18 }}>Urgent days</Text>

        <View style={{ display: "flex", flexDirection: "row", width: 140, justifyContent: "space-between"}}>

          <IconButton icon="minus" compact={true} mode="contained" onPress={() => { setUrgentDays(urgentDays - 1); updateSettingsFile(); }} style={{ width: 40 }}></IconButton>
          <Chip style={{ marginTop: 5, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", textAlignVertical: "center", paddingTop: 4, borderRadius: 20}} textStyle={{ alignContent: "center", alignItems: "center", alignSelf: "center", textAlignVertical: "center", textAlign: "center", justifyContent: "center"}}>{urgentDays}</Chip>
          <IconButton icon="plus" compact={true} mode="contained" onPress={() => { setUrgentDays(urgentDays + 1); updateSettingsFile(); }} style={{ width: 40 }}></IconButton>

        </View>

      </View>

      {/* CHIPS */}
      <View style={{ width: "90%", height: 60, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

        {/* TODO: show here tags as chips */}
        <Text variant="titleMedium" style={{ fontSize: 18 }}>Tags</Text>

      </View>


      {/* DELETE TOKEN BUTTON */}
      <View style={{ height: 60, display: "flex", flexDirection: "row" }}>
        <Button mode="contained" onPress={() => deleteTokenFile()} style={{ width: 200, marginTop: 20 }}>Delete Token</Button>
      </View>


      {/* SNACKBARS */}
      <Snackbar visible={tokenDelSnack}>Logged out (token deleted)</Snackbar>


    </View>
  );
};

export default Settings;
