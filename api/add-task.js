export const apiAddTask = (api, task) => {
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
        .catch((error) => {
            console.log(error);
            // task = JSON.stringify(task, null, 2);
            // fs.writeFile('added.json', task, (err) => {
            //     if (err) throw err;
            //     console.log('Saved added to sync later.');
            // });
        })
    // var data = fs.readFileSync('./tasks.json');
    // var object = JSON.parse(data);
    // console.log(object);
    // object.first.push(task);
    // var updatedData = JSON.stringify(object, null, 2);
    // fs.writeFileSync('./tasks.json', updatedData);
}
