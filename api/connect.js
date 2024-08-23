import { TodoistApi } from '@doist/todoist-api-typescript';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import * as Notifications from 'expo-notifications';

export const getApi = async () => {

    // await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "My test notification",
    //       body: 'Here is the notification body',
    //     },
    //     trigger: { seconds: 10 },
    // });

    const tokenFileUri = FileSystem.documentDirectory + "token.json";
    const fileContents = await FileSystem.readAsStringAsync(tokenFileUri, { encoding: FileSystem.EncodingType.UTF8 })
    const jsonData = JSON.parse(fileContents);
    let api = new TodoistApi(jsonData["token"]);
    return api;
}

export const getAllTasks = async (api) => {

    let connected = (await Network.getNetworkStateAsync()).isConnected;

    let allTasks = [];

    if (connected) {
        console.log("ONLINE");
        await api.getTasks()
            .then((tasks) => { allTasks = tasks; })
            .catch((error) => console.log(error))
    }
    else {
        console.log("FROM FILE!");
        const tasksFileUri = FileSystem.documentDirectory + "tasks.json";
        const fileContents = await FileSystem.readAsStringAsync(tasksFileUri, { encoding: FileSystem.EncodingType.UTF8 })
        const jsonData = JSON.parse(fileContents);
        allTasks = jsonData;
    }


    const tasksFileUri = FileSystem.documentDirectory + "tasks.json";
    await FileSystem.writeAsStringAsync(tasksFileUri, JSON.stringify(allTasks), { encoding: FileSystem.EncodingType.UTF8 });

    let index = 0;
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].labels.includes("REMINDER")) {
            allTasks[i].labels = allTasks[i].labels.filter(label => label != "REMINDER");
            let endIndex =  allTasks[i].description.indexOf("!", 2);
            let reminders = allTasks[i].description.substring(1, endIndex).split("*");
            allTasks[i].description = allTasks[i].description.substring(endIndex+1+1);
            const remindersFileUri = FileSystem.documentDirectory + "reminders.json";
            const fileInfo = await FileSystem.getInfoAsync(remindersFileUri);
            let jsonData = { ids: [] }
            if (fileInfo.exists) {
                const fileContents = await FileSystem.readAsStringAsync(remindersFileUri, { encoding: FileSystem.EncodingType.UTF8 })
                jsonData = JSON.parse(fileContents);
            }
            if (!(jsonData.ids.includes(allTasks[i].id))) {
                console.log("REMINDER");
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `${allTasks[i].content}`,
                        body: "Click to open app and check task details",
                    },
                    trigger: { seconds: 10 },
                });
                jsonData.ids.push(allTasks[i].id);
                await FileSystem.writeAsStringAsync(remindersFileUri, JSON.stringify(jsonData), { encoding: FileSystem.EncodingType.UTF8 });
            }
        }
        if (allTasks[i].due == null) {
            let task = allTasks[i];
            allTasks.splice(i, 1);
            allTasks.splice(0, 0, task);
            index++;
        }
        else if (!("datetime" in allTasks[i].due) || "EVENT" in allTasks[i].labels) {
            let task = allTasks[i];
            allTasks.splice(i, 1);
            allTasks.splice(index, 0, task);
            index++;
        }
    }


    allTasks.sort((x, y) => {
        if (x.due != null && y.due != null) {
            if ("datetime" in x.due && "datetime" in y.due) { return new Date((x.due.datetime).toString()) - new Date((y.due.datetime).toString()); }
            return new Date((x.due.date).toString()) - new Date((y.due.date).toString());
        }
        return 0;
    })

    return allTasks;
}
