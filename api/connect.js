import { TodoistApi } from '@doist/todoist-api-typescript';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import * as Notifications from 'expo-notifications';
import { apiAddTask } from './add-task';
import { completeTask } from './complete';
import { deleteTask } from './delete';

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

        const addFileUri = FileSystem.documentDirectory + "add.json";
        fileInfo = await FileSystem.getInfoAsync(addFileUri);
        if (fileInfo.exists) {
            let fileContent = await FileSystem.readAsStringAsync(addFileUri, { encoding: FileSystem.EncodingType.UTF8 });
            let data = JSON.parse(fileContent);
            data.forEach( async task => {
                await apiAddTask(api, task, null);
            });
            await FileSystem.writeAsStringAsync(addFileUri, JSON.stringify([]), { encoding: FileSystem.EncodingType.UTF8 });
        }

        const deleteFileUri = FileSystem.documentDirectory + "delete.json";
        let fileInfo = await FileSystem.getInfoAsync(deleteFileUri);
        if (fileInfo.exists) {
            let fileContent = await FileSystem.readAsStringAsync(deleteFileUri, { encoding: FileSystem.EncodingType.UTF8 });
            let data = JSON.parse(fileContent);
            data.forEach(async id => {
                await deleteTask(api, id);
            });
            await FileSystem.writeAsStringAsync(deleteFileUri, JSON.stringify([]), { encoding: FileSystem.EncodingType.UTF8 });
        }

        const completeFileUri = FileSystem.documentDirectory + "complete.json";
        fileInfo = await FileSystem.getInfoAsync(deleteFileUri);
        if (fileInfo.exists) {
            let fileContent = await FileSystem.readAsStringAsync(completeFileUri, { encoding: FileSystem.EncodingType.UTF8 });
            let data = JSON.parse(fileContent);
            data.forEach( async id => {
                await completeTask(api, id);
            });
            await FileSystem.writeAsStringAsync(completeFileUri, JSON.stringify([]), { encoding: FileSystem.EncodingType.UTF8 });
        }

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

    const remindersFileUri = FileSystem.documentDirectory + "reminders.json";
    const fileInfo = await FileSystem.getInfoAsync(remindersFileUri);
    let jsonData = { ids: [] }
    if (fileInfo.exists) {
        const fileContents = await FileSystem.readAsStringAsync(remindersFileUri, { encoding: FileSystem.EncodingType.UTF8 })
        jsonData = JSON.parse(fileContents);
    }

    let index = 0;
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].labels.includes("REMINDER")) {

            allTasks[i].labels = allTasks[i].labels.filter(label => label != "REMINDER");
            let endIndex =  allTasks[i].description.indexOf("!", 2);
            let reminders = allTasks[i].description.substring(2, endIndex).split("*");
            allTasks[i].description = allTasks[i].description.substring(endIndex+1+1);

            reminders.forEach(async (reminder) =>  {
                let trigger = new Date();

                const [datePart, timePart] = reminder.split("-"); // Split date and time
                const [hours, minutes] = timePart.split(":"); // Split hours and minutes

                trigger.setHours(Number(hours));
                trigger.setMinutes(Number(minutes - 1));
                trigger.setSeconds(0);
                trigger.setMilliseconds(0);

                trigger.setDate(trigger.getDate() + Number(reminder.split("-")[0]));
                let month = trigger.getMonth() + 1;

                let seconds = getSecondsUntilDate({
                    month: month,
                    day: trigger.getDate(),
                    hour: trigger.getHours(),
                    minute: trigger.getMinutes(),
                })

                if (trigger < new Date) {
                    console.log("Cancelled notification because trigger is before today");
                } else {
                    if (!jsonData.ids.includes(allTasks[i].id)) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `${allTasks[i].content}`,
                                body: "Click to open app and check task details",
                            },
                            trigger: {
                                seconds: seconds,
                                repeats: false
                            }
                        });
                        console.log("CREATED NOTIFICATION");
                        jsonData.ids.push(allTasks[i].id);
                    }
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

    await FileSystem.writeAsStringAsync(remindersFileUri, JSON.stringify(jsonData), { encoding: FileSystem.EncodingType.UTF8 });


    allTasks.sort((x, y) => {
        if (x.due != null && y.due != null) {
            if ("datetime" in x.due && "datetime" in y.due) { return new Date((x.due.datetime).toString()) - new Date((y.due.datetime).toString()); }
            return new Date((x.due.date).toString()) - new Date((y.due.date).toString());
        }
        return 0;
    })

    return allTasks;
}

const getSecondsUntilDate = ({ day, month, hour, minute }) => {
    const now = new Date();
    let date = new Date(now.getFullYear(), month - 1, day, hour, minute, 0);
    let diff = date.getTime() - now.getTime();
    if (diff > 0) {
      return Math.floor(diff / 1000);
    } else {
      date = new Date(now.getFullYear() + 1, month, day, hour, minute);
      diff = date.getTime() - now.getTime();
      return Math.floor(diff / 1000);
    }
};
