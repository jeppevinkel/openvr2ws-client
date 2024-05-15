import {OpenVR2WS} from './OpenVR2WS';
import {InputSourceEnum} from './enums';

const client = new OpenVR2WS();

client.OnStatus.on(async (status) => {
    try {
        const cumulativeStats = await client.getCumulativeStatsAsync();
        console.log('cumulativeStats', cumulativeStats);
    } catch (e) {
        console.error(e);
    }

    try {
        const playArea = await client.getPlayAreaAsync();
        console.log('playArea', playArea);
    } catch (e) {
        console.error(e);
    }

    try {
        const applicationInfo = await client.getApplicationInfoAsync();
        console.log('applicationInfo', {
            Type: applicationInfo.Type,
            Key: applicationInfo.Key,
            Message: applicationInfo.Message,
            Data: {
                AppId: applicationInfo.Data.AppId,
                SessionStart: applicationInfo.Data.SessionStart
            },
            Nonce: applicationInfo.Nonce
        });
    } catch (e) {
        console.error(e);
    }

    try {
        const deviceIds = await client.getDeviceIdsAsync();
        console.log('deviceIds', {
            Type: deviceIds.Type,
            Key: deviceIds.Key,
            Message: deviceIds.Message,
            Data: {
                DeviceToIndex: deviceIds.Data.DeviceToIndex,
                SourceToIndex: deviceIds.Data.SourceToIndex
            },
            Nonce: deviceIds.Nonce
        });

        console.log('hasHead', deviceIds.Data.SourceToIndex.has(InputSourceEnum.Head));
    } catch (e) {
        console.error(e);
    }
});

client.OnMessage.on((message) => {
    console.log('unhandled message', message);

});

client.init().then(async () => {
    console.log('Ready!');
});