import { TodoistApi } from '@doist/todoist-api-typescript';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import * as Notifications from 'expo-notifications';

// RETURNS CONNECTION OBJECT TO API
export const getApi = async () => {
    const tokenFileUri = FileSystem.documentDirectory + "token.json";
    const fileContents = await FileSystem.readAsStringAsync(tokenFileUri, { encoding: FileSystem.EncodingType.UTF8 })
    const jsonData = JSON.parse(fileContents);
    let api = new TodoistApi(jsonData["token"]);
    return api;
}


// RETURNS ALL TASKS FROM API
export const getAllTasks = async (api) => {

    const tasksFileUri = FileSystem.documentDirectory + "tasks.json";
    let connected = (await Network.getNetworkStateAsync()).isConnected;

    let allTasks = [];

    if (connected) {
        await api.getTasks()
            .then((tasks) => { allTasks = tasks; })
            .catch((error) => console.log(error))
    }
    else {
        const fileContents = await FileSystem.readAsStringAsync(tasksFileUri, { encoding: FileSystem.EncodingType.UTF8 })
        const jsonData = JSON.parse(fileContents);
        allTasks = jsonData;
    }

    await FileSystem.writeAsStringAsync(tasksFileUri, JSON.stringify(allTasks), { encoding: FileSystem.EncodingType.UTF8 });

    let index = 0;
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].labels.includes("REMINDER")) {

            console.log(allTasks[i].description);

            allTasks[i].labels = allTasks[i].labels.filter(label => label != "REMINDER");
            let endIndex =  allTasks[i].description.indexOf("!", 2);
            let reminders = allTasks[i].description.substring(2, endIndex).split("*");
            allTasks[i].description = allTasks[i].description.substring(endIndex+1+1);

            console.log(reminders);

            const remindersFileUri = FileSystem.documentDirectory + "reminders.json";
            const fileInfo = await FileSystem.getInfoAsync(remindersFileUri);
            let jsonData = { ids: [] }
            if (fileInfo.exists) {
                const fileContents = await FileSystem.readAsStringAsync(remindersFileUri, { encoding: FileSystem.EncodingType.UTF8 })
                jsonData = JSON.parse(fileContents);
            }

            reminders.forEach(async (reminder) =>  {
                let trigger = new Date();
                trigger.setHours(Number(reminder.split("-")[1].split(":")[0]) + 2);
                console.log(Number(reminder.split("-")[1].split(":")[0]) + 2);
                trigger.setMinutes(Number(reminder.split("-")[1].split(":")[1]));
                trigger.setSeconds(0);
                trigger.setMilliseconds(0);
                trigger.setDate(trigger.getDate() + Number(reminder.split("-")[0]));
                let now = new Date();
                now.setHours(Number(now.getHours() + 2));
                let secs = Math.round((trigger.getTime() - now.getTime()) / 1000);
                console.log(now.toISOString());
                console.log(trigger.toISOString());
                console.log(secs);

                if (!jsonData.ids.includes(allTasks[i].id)) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `${allTasks[i].content}`,
                            body: "Click to open app and check task details",
                        },
                        trigger: { seconds: secs }
                        // trigger
                    });
                    jsonData.ids.push(allTasks[i].id);
                    await FileSystem.writeAsStringAsync(remindersFileUri, JSON.stringify(jsonData), { encoding: FileSystem.EncodingType.UTF8 });
                }
            });

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
