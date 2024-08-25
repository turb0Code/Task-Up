import * as FileSystem from "expo-file-system";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import DarkMode from "./DarkMode";
//import fs from 'fs';
//import https from 'https';
//import express from 'express';
//import StaticServer from 'react-native-static-server';


// WebBrowser.maybeCompleteAuthSession();
// const redirectUri = AuthSession.makeRedirectUri();

const Landing = ({ handleBackToMain }) => {

//   const discovery = {
//     authorizationEndpoint: 'https://todoist.com/oauth/authorize',
//     tokenEndpoint: 'https://todoist.com/oauth/access_token',
//    };

//   // Create and load an auth request
//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       clientId: 'e2a090aaec4e4aca8ace8ec6e22f52d5', // Replace with your Todoist client ID
//       clientSecret: 'aae7f8e54d0c4a3197c2b580e9744c1d',
//       scopes: ["data:read_write"], //"data:delete", "project:delete"], // Adjust scopes according to your needs
//       redirectUri: AuthSession.makeRedirectUri({
//         native: 'http://127.0.0.1:8000', // Replace 'your.app' with your app's scheme
//       }),
//       usePKCE: true,
//     },
//     discovery
//  );

//   React.useEffect(() => {
//     console.log(request);
//     console.log(response);
//     if (response?.type === 'success') {
//       const { access_token } = response.params;
//       console.log(access_token);
//       // Use the access token to make authenticated requests to Todoist
//     }
//   }, [response]);

//   const oauth = () => {
//     fetch("https://todoist.com/oauth/authorize?client_id=e2a090aaec4e4aca8ace8ec6e22f52d5&scope=data:read_write,data:delete,project:delete&state=1710218121052")
//       .then((response) => console.log(response))
//       .catch((error) => console.error(error))
//   }

  // THEME
  let { darkMode, setDarkMode } = React.useContext(DarkMode);
  let theme = useTheme();


  // TOKEN SAVING
  const [token, setToken] = React.useState("");

  // function to save token in local storage
  const saveToken = async () => {
    const fileUri = FileSystem.documentDirectory + "token.json";
    const tokenFile = JSON.stringify({ token: token });

    try {
      await FileSystem.writeAsStringAsync(fileUri, tokenFile, { encoding: FileSystem.EncodingType.UTF8 });
      console.log("Successfully saved token");

      handleBackToMain();
    }
    catch (error) {
      console.error("Error while saving token: " + error);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <View style={{ height: 760, width: 340, alignItems: 'center', justifyContent: 'center', borderRadius: 19, position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -170 }, { translateY: -380}] }}>
        <View style={{ height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.elevation.level2, borderRadius: 15, shadowColor: "#000000", shadowOffset: 10, shadowOpacity: 1, shadowRadius: 8, marginTop: 25 }}>

          <IconButton icon={darkMode ? "brightness-7" : "moon-waning-crescent"} size={30} style={{ position: "absolute", right: 0, top: 0, padding: 0 }} onPress={() => setDarkMode(!darkMode)} />
          <Text variant="displayLarge" style={{ fontSize: 65, marginTop: -20 }}>Task Up!</Text>
          <TextInput mode="outlined" vaule={token} onChangeText={text => setToken(text)} label="Token" style={{ width: "80%", marginTop: 55, height: 60 }} outlineStyle={{ borderRadius: 10 }}></TextInput>
          <Button onPress={() => saveToken(token)} mode="contained" style={{ width: "80%", height: 45, marginTop: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 22.5 }}>Login</Button>

        </View>
      </View>

    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});
