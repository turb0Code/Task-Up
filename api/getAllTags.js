import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

// RETURNS TAGS FROM API
export const getAllTags = async (api) => {

    const tagsFileUri = FileSystem.documentDirectory + "tags.json";

    let connected = (await Network.getNetworkStateAsync()).isConnected;

    let tags = {};

    if (connected) {
        await api.getLabels()
            .then((labels) => {
                labels.forEach(tag => { tags[tag.name] = tag.color; });
            })
            .catch((error) => console.log(error));
    } else {
        tags = jsonData;
    }

    await FileSystem.writeAsStringAsync(tagsFileUri, JSON.stringify(tags), { encoding: FileSystem.EncodingType.UTF8 });

    return tags;
};
