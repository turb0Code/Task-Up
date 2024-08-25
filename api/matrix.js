import * as FileSystem from 'expo-file-system';

// RETURNS NUMBER OF DAYS TREATED AS URGENT FROM LOCAL STORAGE
const readUrgentDays = async () => {
    const settingsFileUri = FileSystem.documentDirectory + "settings.json";
    const fileContents = await FileSystem.readAsStringAsync(settingsFileUri, { encoding: FileSystem.EncodingType.UTF8 });
    const jsonData = JSON.parse(fileContents);
    return jsonData["urgentDays"];
}

// RETURNS OBJECT OF FOUR ARRAYS PREPARED TO DISPLAY IN MATRIX
const arrange = (tasks, days) => {
    tasks = tasks.filter(task => {
        if (task.due == null || task.labels.includes("EVENT")) { return false; }
        return true;
    });

    // create two empty arrays where tasks are grouped
    let urgent = [];
    let notUrgent = [];

    tasks.forEach(task => {
        let dueDate = new Date(task.due.date.toString());
        if (dueDate <= days) { urgent.push(task); }
        else { notUrgent.push(task); }
    });

    urgent = urgent.map((task, idx) => { return transformTask(task, idx); });

    notUrgent = notUrgent.map((task, idx) => { return transformTask(task, idx); });

    // create two epmty arrays to divide urgenr tasks
    let urgentImportant = [];
    let urgentUnimportant = [];

    urgent.forEach(task => {
        if (task.priority > 2) { urgentImportant.push(task); }
        else { urgentUnimportant.push(task); }
    });

    // create two epmty arrays to divide not urgennt tasks
    let notUrgentImportant = [];
    let notUrgentUnimportant = [];

    notUrgent.forEach(task => {
        if (task.priority > 2) { notUrgentImportant.push(task); }
        else { notUrgentUnimportant.push(task); }
    });

    return {uI: urgentImportant, nuI: notUrgentImportant, uUI: urgentUnimportant, nuUI: notUrgentUnimportant};
}

export const matrixArrange = (tasks) => {

    return new Promise((resolve, reject) => {

        readUrgentDays().then(urgentDays => {
            var sevenDays = new Date();
            let output = null;
            sevenDays.setDate(sevenDays.getDate() + urgentDays);
            output = arrange(tasks, sevenDays); // Ensure this function returns a value
            resolve(output); // Resolve the promise with the output
        }).catch(error => {
            reject(error); // Reject the promise if there's an error
        });
    });
}

// TRANSLATES TASK FROM SERVER TO CLIENT VERSION
const transformTask = (task, index) => {
    if (task.labels.includes("EVENT")) {
        return {
            id: task.id,
            index: index,
            date: task.due.date,
            time: task.due.string,
            title: task.content,
            description: task.description,
            tags: task.labels.filter(tag => tag != "EVENT"),
            priority: task.priority,
            event: true
        };
    }
    return {
        id: task.id,
        index: index,
        date: task.due.date,
        time: task.due.string,
        title: task.content,
        description: task.description,
        tags: task.labels,
        priority: task.priority
    };
}