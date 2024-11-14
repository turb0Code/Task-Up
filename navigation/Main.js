import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Icon, useTheme } from "react-native-paper";
import { getAllTasks, getApi } from "../api/connect.js";
import { getAllTags } from "../api/tags.js";
import TagsContext from "./Tags.js";
import TasksContext from "./Tasks.js";
import Calendar from './screens/calendar.js';
import Matrix from './screens/matrix.js';
import Settings from './screens/settings.js';
import TimelineComponent from "./screens/timeline.js";

function MainView({ handleBackToLanding }) {

  // THEME
  let theme = useTheme();

  // TASKS AND TAGS
  let [tasks, setTasks] = React.useState([]);
  let [tags, setTags] = React.useState([]);

  // first load tasks and tags
  React.useEffect(() => {
    console.log('This will run only once when the component mounts');

    const getTasks = async (api) => {
      let tmpTasks = getAllTasks(api);
      return tmpTasks;
    }

    const getTags = async (api) => {
      let tmpTags = getAllTags(api);
      return tmpTags;
    }

    getApi().then(api => {
      getTasks(api)
        .then((t) => { setTasks(t); });

      getTags(api)
        .then((t) => { setTags(t); })
        .catch((err) => { console.log(err) });

      setInterval(() => {
        getTasks(api)
          .then((t) => { setTasks(t); });

        getTags(api)
          .then((t) => { setTags(t); });
      }, 180000)
    });
  }, []);

  // function to reload tasks and tags
  const reloadTasks = () => {
    console.log("Reloading tasks...");

    const getTasks = async (api) => {
      let tmpTasks = getAllTasks(api);
      return tmpTasks;
    }

    const getTags = async (api) => {
      let tmpTags = getAllTags(api);
      return tmpTags;
    }

    getApi().then(api => {
      getTasks(api)
        .then((t) => { setTasks(t); });

      getTags(api)
        .then((t) => { setTags(t); });
    });
  }

  // reload tags
  const reloadTags = () => {
    const getTags = async (api) => {
      let tmpTags = getAllTags(api);
      return tmpTags;
    }
    getApi().then(api => {
      getTags()
        .then((t) => { console.log("BB"); setTags(t); });
    });
  }

  // routes names
  const timelineName = "Timeline";
  const calendarName = "Calendar";
  const matrixName = "Matrix";
  const settingsName = "Settings";

  // navigator
  const Tab = createBottomTabNavigator();

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <TagsContext.Provider value={tags}>
        <NavigationContainer theme={theme}>
          <BottomSheetModalProvider>
          <Tab.Navigator
            initialRouteName={timelineName}
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: "rgb(0, 95, 175)",
              headerShadowVisible: false,
              tabBarInactiveTintColor: "grey",
              tabBarLabelStyle: {
                "paddingBottom": 5,
                "fontSize": 11
              },
              headerTintColor: theme.colors.onBackground,
              headerStyle: {
                backgroundColor: theme.colors.background,
                height: 70,
                elevation: 0,
              },
              tabBarStyle: [
                {
                  display: "flex",
                  elevation: 0,
                },
                null,
              ],
              tabBarStyle: {
                elevation: 0,
                height: 60,
                padding: 9,
                backgroundColor: theme.colors.elevation.level2,
                shadowOpacity: 0,
                borderWidth: 0,
                borderColor: theme.colors.background,
              },
              tabBarIcon: ({ focused, color, size }) => {

                let iconName;
                let rn = route.name;

                if (rn === timelineName) { iconName = focused ? 'timeline-check' : 'timeline-check-outline'; }
                else if (rn === calendarName) { iconName = focused ? 'calendar' : 'calendar-outline'; }
                else if (rn === matrixName) { iconName = focused ? 'view-grid' : 'view-grid-outline'; }
                else if (rn === settingsName) { iconName = focused ? 'cog' : 'cog-outline'; }

                return <Icon source={iconName} size={size} color={color} />;
              },
            })}
          >

            {/* ROUTES */}
            <Tab.Screen options={{ headerTitle: 'Task Up!' }} name={timelineName} component={TimelineComponent} initialParams={{ tasks: tasks, reloadTasks: reloadTasks, reloadTags: reloadTags }} />
            <Tab.Screen name={calendarName} component={Calendar} initialParams={{ tasks: tasks, reloadTasks: reloadTasks, reloadTags: reloadTags }} />
            <Tab.Screen options={{ headerTitle: 'Eisenhower Matrix' }} name={matrixName} component={Matrix} initialParams={{ tasks: tasks, reloadTasks: reloadTasks, reloadTags: reloadTags }} />
            <Tab.Screen name={settingsName} component={Settings} initialParams={handleBackToLanding={handleBackToLanding}} />

          </Tab.Navigator>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </TagsContext.Provider>
    </TasksContext.Provider>
  );
}

export default MainView;