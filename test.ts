import {OpenVR2WS} from './OpenVR2WS';

const client = new OpenVR2WS();

client.OnStatus.on(async (status) => {
    const cumulativeStats = await client.getCumulativeStatsAsync();

    console.log('cumulativeStats', cumulativeStats);
});

client.OnMessage.on((message) => {
    console.log('unhandled message', message);

});

client.init().then(async () => {
    console.log('Ready!');
});