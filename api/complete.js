export const completeTask = (api, id) => {
    api.closeTask(id)
        .then((isSuccess) => isSuccess ? console.log("Task completed successfully") : console.log("Task not completed"))
        .catch((error) => console.log(error))
}