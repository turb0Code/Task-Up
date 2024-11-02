import * as FileSystem from 'expo-file-system';

// COMPLETES TASK ON SERVER USING API
export const completeTask = async (api, id) => {
    api.closeTask(id)
        .then((isSuccess) => isSuccess ? console.log("Task completed successfully") : console.log("Task not completed"))
        .catch(async (error) => {
            console.log(error)
            const deleteFileUri = FileSystem.documentDirectory + "complete.json";
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
    let object = JSON.parse(fileContents);
    object = object.filter(task => { if (task.id != id) { return task } else { return null } })

    let updatedData = JSON.stringify(object, null, 2);
    await FileSystem.writeAsStringAsync(tasksFileUri, updatedData, { encoding: FileSystem.EncodingType.UTF8 });
}