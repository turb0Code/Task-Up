import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

export const getAllTags = async (api) => {

    let connected = (await Network.getNetworkStateAsync()).isConnected;

    let tags = {};

    if (connected) {
        console.log("ONLINE");
        await api.getLabels()
            .then((labels) => {
                labels.forEach(tag => {
                    tags[tag.name] = tag.color
                });
            })
            .catch((error) => console.log(error))
    } else {
        console.log("FROM FILE!");
        const tagsFileUri = FileSystem.documentDirectory + "tags.json";
        const fileContents = await FileSystem.readAsStringAsync(tagsFileUri, { encoding: FileSystem.EncodingType.UTF8 })
        const jsonData = JSON.parse(fileContents);
        tags = jsonData;
    }

    const tagsFileUri = FileSystem.documentDirectory + "tags.json";
    await FileSystem.writeAsStringAsync(tagsFileUri, JSON.stringify(tags), { encoding: FileSystem.EncodingType.UTF8 });

    return tags;
}

export const apiAddTag = (api, tag) => {
    api.addLabel(tag)
        .then((label) => console.log(label))
        .catch((error) => console.log(error))
}