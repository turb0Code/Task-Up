export const editTask = (api, id, data) => {
    api.updateTask(id, data)
        .then((isSuccess) => console.log(isSuccess))
        .catch((error) => console.log(error))
}