import * as FileSystem from 'expo-file-system';

export const apiAddTask = async (api, task, offilneTask) => {
    api.addTask({
        content: task.title,
        description: task.description,
        due_date: task.date,
        due_datetime: task.datetime,
        due_string: task.due_string,
        priority: task.priority,
        labels: task.tags,
        isRecurring: true,
        dueLang: "en",
        timezone: "Europe/Warsaw"
    })
        .then((task) => console.log(task))
        .catch(async (error) =>  {
            console.log(error);
            const addFileUri = FileSystem.documentDirectory + "add.json";
            const fileInfo = await FileSystem.getInfoAsync(addFileUri);
            let data = [];
            if (fileInfo.exists) {
                let data = await FileSystem.readAsStringAsync(addFileUri, { encoding: FileSystem.EncodingType.UTF8 });
                data = JSON.parse(data);
            }
            data.push(task);
            await FileSystem.writeAsStringAsync(addFileUri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
        })
    const tasksFileUri = FileSystem.documentDirectory + "tasks.json";
    const fileContents = await FileSystem.readAsStringAsync(tasksFileUri, { encoding: FileSystem.EncodingType.UTF8 })
    var object = JSON.parse(fileContents);

    object.first.push(offilneTask);
    var updatedData = JSON.stringify(object, null, 2);
    await FileSystem.writeAsStringAsync(tasksFileUri, updatedData, { encoding: FileSystem.EncodingType.UTF8 });
}
