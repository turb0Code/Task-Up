// DELETES TASKK ON SERVER USING API
export const deleteTask = (api, id) => {
    api.deleteTask(id)
        .then((isSuccess) => console.log("Deleted task with id " + task.id))
        .catch((error) => {
            console.log(error);
        })
}