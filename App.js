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

  // const theme = {
  //   light: {
  //     "colors": {
  //       "primary": "rgb(0, 95, 175)",
  //       "onPrimary": "rgb(255, 255, 255)",
  //       "primaryContainer": "rgb(212, 227, 255)",
  //       "onPrimaryContainer": "rgb(0, 28, 58)",
  //       "secondary": "rgb(0, 99, 155)",
  //       "onSecondary": "rgb(255, 255, 255)",
  //       "secondaryContainer": "rgb(206, 229, 255)",
  //       "onSecondaryContainer": "rgb(0, 29, 51)",
  //       "tertiary": "rgb(0, 90, 194)",
  //       "onTertiary": "rgb(255, 255, 255)",
  //       "tertiaryContainer": "rgb(216, 226, 255)",
  //       "onTertiaryContainer": "rgb(0, 26, 66)",
  //       "error": "rgb(186, 26, 26)",
  //       "onError": "rgb(255, 255, 255)",
  //       "errorContainer": "rgb(255, 218, 214)",
  //       "onErrorContainer": "rgb(65, 0, 2)",
  //       "background": "rgb(253, 252, 255)",
  //       "onBackground": "rgb(26, 28, 30)",
  //       "surface": "rgb(253, 252, 255)",
  //       "onSurface": "rgb(26, 28, 30)",
  //       "surfaceVariant": "rgb(224, 226, 236)",
  //       "onSurfaceVariant": "rgb(67, 71, 78)",
  //       "outline": "rgb(116, 119, 127)",
  //       "outlineVariant": "rgb(195, 198, 207)",
  //       "shadow": "rgb(0, 0, 0)",
  //       "scrim": "rgb(0, 0, 0)",
  //       "inverseSurface": "rgb(47, 48, 51)",
  //       "inverseOnSurface": "rgb(241, 240, 244)",
  //       "inversePrimary": "rgb(165, 200, 255)",
  //       "elevation": {
  //         "level0": "transparent",
  //         "level1": "rgb(240, 244, 251)",
  //         "level2": "rgb(233, 239, 249)",
  //         "level3": "rgb(225, 235, 246)",
  //         "level4": "rgb(223, 233, 245)",
  //         "level5": "rgb(218, 230, 244)"
  //       },
  //       "surfaceDisabled": "rgba(26, 28, 30, 0.12)",
  //       "onSurfaceDisabled": "rgba(26, 28, 30, 0.38)",
  //       "backdrop": "rgba(45, 49, 56, 0.4)"
  //     }
  //   },
  //   dark: {
  //     "colors": {
  //       "primary": "rgb(165, 200, 255)",
  //       "onPrimary": "rgb(0, 49, 95)",
  //       "primaryContainer": "rgb(0, 71, 134)",
  //       "onPrimaryContainer": "rgb(212, 227, 255)",
  //       "secondary": "rgb(150, 203, 255)",
  //       "onSecondary": "rgb(0, 51, 83)",
  //       "secondaryContainer": "rgb(0, 74, 118)",
  //       "onSecondaryContainer": "rgb(206, 229, 255)",
  //       "tertiary": "rgb(173, 198, 255)",
  //       "onTertiary": "rgb(0, 46, 106)",
  //       "tertiaryContainer": "rgb(0, 68, 149)",
  //       "onTertiaryContainer": "rgb(216, 226, 255)",
  //       "error": "rgb(255, 180, 171)",
  //       "onError": "rgb(105, 0, 5)",
  //       "errorContainer": "rgb(147, 0, 10)",
  //       "onErrorContainer": "rgb(255, 180, 171)",
  //       "background": "rgb(26, 28, 30)",
  //       "onBackground": "rgb(227, 226, 230)",
  //       "surface": "rgb(26, 28, 30)",
  //       "onSurface": "rgb(227, 226, 230)",
  //       "surfaceVariant": "rgb(67, 71, 78)",
  //       "onSurfaceVariant": "rgb(195, 198, 207)",
  //       "outline": "rgb(141, 145, 153)",
  //       "outlineVariant": "rgb(67, 71, 78)",
  //       "shadow": "rgb(0, 0, 0)",
  //       "scrim": "rgb(0, 0, 0)",
  //       "inverseSurface": "rgb(227, 226, 230)",
  //       "inverseOnSurface": "rgb(47, 48, 51)",
  //       "inversePrimary": "rgb(0, 95, 175)",
  //       "elevation": {
  //         "level0": "transparent",
  //         "level1": "rgb(33, 37, 41)",
  //         "level2": "rgb(37, 42, 48)",
  //         "level3": "rgb(41, 47, 55)",
  //         "level4": "rgb(43, 49, 57)",
  //         "level5": "rgb(46, 52, 62)"
  //       },
  //       "surfaceDisabled": "rgba(227, 226, 230, 0.12)",
  //       "onSurfaceDisabled": "rgba(227, 226, 230, 0.38)",
  //       "backdrop": "rgba(45, 49, 56, 0.4)"
  //     }
  //   }
  //  }


  // const darkTheme = {
  //   ...MD3DarkTheme,
  //   additionalColors: {
  //     "grey": "#cbcbcb",
  //     "grey1": "#b6b6b6",
  //   },
  //   colors: {
  //     ...MD3DarkTheme.colors,
  //     "primary": "rgb(165, 200, 255)",
  //     "onPrimary": "rgb(0, 49, 95)",
  //     "primaryContainer": "rgb(0, 71, 134)",
  //     "onPrimaryContainer": "rgb(212, 227, 255)",
  //     "secondary": "rgb(150, 203, 255)",
  //     "onSecondary": "rgb(0, 51, 83)",
  //     "secondaryContainer": "rgb(0, 74, 118)",
  //     "onSecondaryContainer": "rgb(206, 229, 255)",
  //     "tertiary": "rgb(173, 198, 255)",
  //     "onTertiary": "rgb(0, 46, 106)",
  //     "tertiaryContainer": "rgb(0, 67, 149)",
  //     "onTertiaryContainer": "rgb(216, 226, 255)",
  //     "error": "rgb(255, 180, 171)",
  //     "onError": "rgb(105, 0, 5)",
  //     "errorContainer": "rgb(147, 0, 10)",
  //     "onErrorContainer": "rgb(255, 180, 171)",
  //     "background": "rgb(26, 28, 30)",
  //     "onBackground": "rgb(227, 226, 230)",
  //     "surface": "rgb(26, 28, 30)",
  //     "onSurface": "rgb(227, 226, 230)",
  //     "surfaceVariant": "rgb(67, 71, 78)",
  //     "onSurfaceVariant": "rgb(195, 198, 207)",
  //     "outline": "rgb(141, 145, 153)",
  //     "outlineVariant": "rgb(67, 71, 78)",
  //     "shadow": "rgb(0, 0, 0)",
  //     "scrim": "rgb(0, 0, 0)",
  //     "inverseSurface": "rgb(227, 226, 230)",
  //     "inverseOnSurface": "rgb(47, 48, 51)",
  //     "inversePrimary": "rgb(0, 95, 175)",
  //     "elevation": {
  //       "level0": "transparent",
  //       "level1": "rgb(33, 37, 41)",
  //       "level2": "rgb(37, 42, 48)",
  //       "level3": "rgb(41, 47, 55)",
  //       "level4": "rgb(43, 49, 57)",
  //       "level5": "rgb(46, 52, 62)"
  //     },
  //     "surfaceDisabled": "rgba(227, 226, 230, 0.12)",
  //     "onSurfaceDisabled": "rgba(227, 226, 230, 0.38)",
  //     "backdrop": "rgba(45, 49, 56, 0.4)"
  //   }
  // }

  // const lightTheme = {
  //   ...MD3LightTheme,
  //   additionalColors: {
  //     "grey": "#4d4d4d",
  //     "grey1": "#616161",
  //   },
  //   colors: {
  //     ...MD3LightTheme.colors,
  //     "primary": "rgb(0, 95, 175)",
  //     "onPrimary": "rgb(255, 255, 255)",
  //     "primaryContainer": "rgb(212, 227, 255)",
  //     "onPrimaryContainer": "rgb(0, 28, 58)",
  //     "secondary": "rgb(0, 99, 155)",
  //     "onSecondary": "rgb(255, 255, 255)",
  //     "secondaryContainer": "rgb(206, 229, 255)",
  //     "onSecondaryContainer": "rgb(0, 29, 51)",
  //     "tertiary": "rgb(0, 90, 194)",
  //     "onTertiary": "rgb(255, 255, 255)",
  //     "tertiaryContainer": "rgb(216, 226, 255)",
  //     "onTertiaryContainer": "rgb(0, 26, 66)",
  //     "error": "rgb(186, 26, 26)",
  //     "onError": "rgb(255, 255, 255)",
  //     "errorContainer": "rgb(255, 218, 214)",
  //     "onErrorContainer": "rgb(65, 0, 2)",
  //     "background": "rgb(253, 252, 255)",
  //     "onBackground": "rgb(26, 28, 30)",
  //     "surface": "rgb(253, 252, 255)",
  //     "onSurface": "rgb(26, 28, 30)",
  //     "surfaceVariant": "rgb(224, 226, 236)",
  //     "onSurfaceVariant": "rgb(67, 71, 78)",
  //     "outline": "rgb(116, 119, 127)",
  //     "outlineVariant": "rgb(195, 198, 207)",
  //     "shadow": "rgb(0, 0, 0)",
  //     "scrim": "rgb(0, 0, 0)",
  //     "inverseSurface": "rgb(47, 48, 51)",
  //     "inverseOnSurface": "rgb(241, 240, 244)",
  //     "inversePrimary": "rgb(165, 200, 255)",
  //     "elevation": {
  //       "level0": "transparent",
  //       "level1": "rgb(240, 244, 251)",
  //       "level2": "rgb(233, 239, 249)",
  //       "level3": "rgb(225, 235, 246)",
  //       "level4": "rgb(223, 233, 245)",
  //       "level5": "rgb(218, 230, 244)"
  //     },
  //     "surfaceDisabled": "rgba(26, 28, 30, 0.12)",
  //     "onSurfaceDisabled": "rgba(26, 28, 30, 0.38)",
  //     "backdrop": "rgba(45, 49, 56, 0.4)"
  //   },
  // };

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

  async function requestUserPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access push notifications was denied');
      return;
    }
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

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

  React.useEffect(() => {
    handleSettingsFile();
    requestUserPermission();
  });


  let [darkMode, setDarkMode] = useState(true);

  const [firstRun, setFirstRun] = useState(true);

  const handleBackToMain = () => {
    setFirstRun(false);
  }

  const handleBackToLanding = () => {
    setFirstRun(true);
  }

  const ifFileExists = async () => {
    const fileUri = FileSystem.documentDirectory + "token.json";
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) { setFirstRun(false); }
  }

  ifFileExists();

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
