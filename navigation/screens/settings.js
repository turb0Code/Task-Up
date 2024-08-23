import * as FileSystem from 'expo-file-system';
import React from 'react';
import { View } from 'react-native';
import { Button, Chip, IconButton, Snackbar, Switch, Text } from 'react-native-paper';
import DarkMode from "../DarkMode.js";

const Settings = ({ route }) => {

  let { darkMode, setDarkMode } = React.useContext(DarkMode);

  let [darkTheme, setDarkTheme] = React.useState(darkMode);
  const [tokenDelSnack, setTokenDelSnack] = React.useState(false);
  const [urgentDays, setUrgentDays] = React.useState(7);

  const deleteTokenFile = async () => {
    const fileUri = FileSystem.documentDirectory + 'token.json';
    await FileSystem.deleteAsync(fileUri);

    setTokenDelSnack(true);
    setTimeout(() => {
      setTokenDelSnack(false)
      route.params.handleBackToLanding();
    }, 3000);
  }

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
      <View style={{ width: "90%", height: 60, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant="titleMedium" style={{ fontSize: 18 }}>Dark theme</Text>
        <Switch value={darkMode} onValueChange={() => { setDarkTheme(!darkMode); darkTheme = !darkMode; setDarkMode(darkTheme); updateSettingsFile(); }} />
      </View>

      <View style={{ width: "90%", height: 60, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text variant="titleMedium" style={{ fontSize: 18 }}>Urgent days</Text>
        <View style={{ display: "flex", flexDirection: "row", width: 140, justifyContent: "space-between"}}>
          <IconButton icon="minus" compact={true} mode="contained" onPress={() => { setUrgentDays(urgentDays - 1); updateSettingsFile(); }} style={{ width: 40 }}></IconButton>
          <Chip style={{ marginTop: 5, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", textAlignVertical: "center", paddingTop: 4, borderRadius: 20}} textStyle={{ alignContent: "center", alignItems: "center", alignSelf: "center", textAlignVertical: "center", textAlign: "center", justifyContent: "center"}}>{urgentDays}</Chip>
          <IconButton icon="plus" compact={true} mode="contained" onPress={() => { setUrgentDays(urgentDays + 1); updateSettingsFile(); }} style={{ width: 40 }}></IconButton>
        </View>
      </View>

      <View style={{ height: 60, display: "flex", flexDirection: "row" }}>
        <Button mode="contained" onPress={() => deleteTokenFile()} style={{ width: 200, marginTop: 20 }}>Delete Token</Button>
      </View>
      <Snackbar visible={tokenDelSnack}>Logged out (token deleted)</Snackbar>
    </View>
  );
};

export default Settings;
