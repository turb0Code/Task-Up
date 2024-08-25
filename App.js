import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import DarkMode from './navigation/DarkMode.js';
import Landing from './navigation/Landing.js';
import MainView from './navigation/Main.js';


export default function App() {

  // DARK THEME COLORS
  const darkTheme = {
    ...MD3DarkTheme,
    additionalColors: {
      "grey": "#cbcbcb",
      "grey1": "#b6b6b6",
    },
    colors: {
      ...MD3DarkTheme.colors,
      "primary": "rgb(173, 198, 255)",
      "onPrimary": "rgb(0, 46, 105)",
      "primaryContainer": "rgb(0, 68, 147)",
      "onPrimaryContainer": "rgb(216, 226, 255)",
      "secondary": "rgb(159, 202, 255)",
      "onSecondary": "rgb(0, 50, 88)",
      "secondaryContainer": "rgb(0, 73, 125)",
      "onSecondaryContainer": "rgb(209, 228, 255)",
      "tertiary": "rgb(126, 208, 255)",
      "onTertiary": "rgb(0, 52, 74)",
      "tertiaryContainer": "rgb(0, 76, 106)",
      "onTertiaryContainer": "rgb(197, 231, 255)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(27, 27, 31)",
      "onBackground": "rgb(227, 226, 230)",
      "surface": "rgb(27, 27, 31)",
      "onSurface": "rgb(227, 226, 230)",
      "surfaceVariant": "rgb(68, 71, 79)",
      "onSurfaceVariant": "rgb(196, 198, 208)",
      "outline": "rgb(142, 144, 153)",
      "outlineVariant": "rgb(68, 71, 79)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(227, 226, 230)",
      "inverseOnSurface": "rgb(48, 48, 51)",
      "inversePrimary": "rgb(0, 91, 193)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(34, 36, 42)",
        "level2": "rgb(39, 41, 49)",
        "level3": "rgb(43, 46, 56)",
        "level4": "rgb(45, 48, 58)",
        "level5": "rgb(47, 51, 62)"
      },
      "surfaceDisabled": "rgba(227, 226, 230, 0.12)",
      "onSurfaceDisabled": "rgba(227, 226, 230, 0.38)",
      "backdrop": "rgba(46, 48, 56, 0.4)"
    }
  }

  // LIGHT THEME COLORS
  const lightTheme = {
    ...MD3LightTheme,
    additionalColors: {
      "grey": "#4d4d4d",
      "grey1": "#616161",
    },
    colors: {
      ...MD3LightTheme.colors,
      "primary": "rgb(0, 91, 193)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(216, 226, 255)",
      "onPrimaryContainer": "rgb(0, 26, 65)",
      "secondary": "rgb(4, 97, 163)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(209, 228, 255)",
      "onSecondaryContainer": "rgb(0, 29, 54)",
      "tertiary": "rgb(0, 101, 139)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(197, 231, 255)",
      "onTertiaryContainer": "rgb(0, 30, 45)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(254, 251, 255)",
      "onBackground": "rgb(27, 27, 31)",
      "surface": "rgb(254, 251, 255)",
      "onSurface": "rgb(27, 27, 31)",
      "surfaceVariant": "rgb(225, 226, 236)",
      "onSurfaceVariant": "rgb(68, 71, 79)",
      "outline": "rgb(116, 119, 127)",
      "outlineVariant": "rgb(196, 198, 208)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(48, 48, 51)",
      "inverseOnSurface": "rgb(242, 240, 244)",
      "inversePrimary": "rgb(173, 198, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(241, 243, 252)",
        "level2": "rgb(234, 238, 250)",
        "level3": "rgb(226, 233, 248)",
        "level4": "rgb(224, 232, 248)",
        "level5": "rgb(218, 229, 246)"
      },
      "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
      "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
      "backdrop": "rgba(46, 48, 56, 0.4)"
    },
  };

  // function to request needed permissions
  async function requestUserPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access push notifications was denied');
      return;
    }
  }

  // setting up notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // preparing settings files in local storage
  const handleSettingsFile = async () => {
    const settingsFileUri = FileSystem.documentDirectory + "settings.json";
    const fileInfo = await FileSystem.getInfoAsync(settingsFileUri);
    if (fileInfo.exists) {
      const fileContents = await FileSystem.readAsStringAsync(settingsFileUri, { encoding: FileSystem.EncodingType.UTF8 });
      const jsonData = JSON.parse(fileContents);
      setDarkMode(jsonData["darkMode"]);
      console.log(jsonData);
    }
    else {
      const settingsFile = JSON.stringify({ urgentDays: 7, darkMode: darkMode });
      await FileSystem.writeAsStringAsync(settingsFileUri, settingsFile, { encoding: FileSystem.EncodingType.UTF8 });
    }
  }

  // setting up settings and notifications
  React.useEffect(() => {
    handleSettingsFile();
    requestUserPermission();
  });


  // THEME
  let [darkMode, setDarkMode] = useState(true);

  // DEFINE FIRST RUN
  const [firstRun, setFirstRun] = useState(true);

  // BACK HANDLES
  const handleBackToMain = () => {
    setFirstRun(false);
  }

  const handleBackToLanding = () => {
    setFirstRun(true);
  }

  // CHECK IF FIRST RUN
  const ifFileExists = async () => {
    const fileUri = FileSystem.documentDirectory + "token.json";
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) { setFirstRun(false); }
  }

  ifFileExists();  // calling the function

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <GestureHandlerRootView style={[styles.container, {backgroundColor: `${darkMode ? darkTheme.colors.background : lightTheme.colors.background}`}]}>
        <DarkMode.Provider value={{ darkMode, setDarkMode }}>
          <PaperProvider theme={darkMode ? darkTheme : lightTheme}>

            {firstRun ? (
              <Landing handleBackToMain={handleBackToMain} />
            ) : (
              <MainView handleBackToLanding={handleBackToLanding} />
            )}

          </PaperProvider>
        </DarkMode.Provider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});
