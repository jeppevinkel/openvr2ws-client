import {OpenVR2WS} from './OpenVR2WS';

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
});

client.OnMessage.on((message) => {
    console.log('unhandled message', message);

});

client.init().then(async () => {
    console.log('Ready!');
});