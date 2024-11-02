import * as FileSystem from 'expo-file-system';

// DELETES TASK ON SERVER USING API
export const deleteTask = async (api, id) => {
    api.deleteTask(id)
        .then((isSuccess) => console.log("Deleted task with id " + task.id))
        .catch(async (error) => {
            console.log(error);
            const deleteFileUri = FileSystem.documentDirectory + "delete.json";
            const fileInfo = await FileSystem.getInfoAsync(deleteFileUri);
            let data = [];
            if (fileInfo.exists) {
                let data = await FileSystem.readAsStringAsync(deleteFileUri, { encoding: FileSystem.EncodingType.UTF8 });
                data = JSON.parse(data);
            }
            data.push(id);
            await FileSystem.writeAsStringAsync(deleteFileUri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
        })
    const tasksFileUri = FileSystem.documentDirectory + "tasks.json";
    const fileContents = await FileSystem.readAsStringAsync(tasksFileUri, { encoding: FileSystem.EncodingType.UTF8 })
    var object = JSON.parse(fileContents);
    object = object.filter(task => { if (task.id != id) { return task } else { return null } })

    var updatedData = JSON.stringify(object, null, 2);
    await FileSystem.writeAsStringAsync(tasksFileUri, updatedData, { encoding: FileSystem.EncodingType.UTF8 });
}