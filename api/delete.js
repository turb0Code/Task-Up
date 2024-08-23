export const deleteTask = (api, id) => {
    // deleteFromFile("./tasks.json", task);
    // fs.readFile("./added.json", (error, data) => {
    //     if (data != undefined) {
    //         let tasks = JSON.parse(data);
    //         let index = tasks.tasks.indexOf(task);
    //         if (index != -1) {
    //             tasks.tasks.splice(index, 1);
    //             var updatedData = JSON.stringify(tasks, null, 2);
    //             fs.writeFile("./added.json", updatedData);
    //             return;
    //         }
    //     }
    // });
    api.deleteTask(id)
        .then((isSuccess) => console.log("Deleted task with id " + task.id))
        .catch((error) => {
            console.log(error);
            // addToFile("./deleted.json", task);
        })
}