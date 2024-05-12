# openvr2ws-client

## Installation
Install through npm.
```npm
npm install openvr2ws-client
```

## Usage

### TypeScript project

```typescript
import {OpenVR2WS} from './OpenVR2WS';

const client = new OpenVR2WS();

// This event will return true when connected and false when disconnected.
client.OnStatus.on(async (status) => {
    if (status) {
        // Async methods will return the response.
        // These responses will not go through the message event.
        const cumulativeStats = await client.getCumulativeStatsAsync();

        console.log('cumulativeStats', cumulativeStats);
    }
});

// Any messages that don't have a nonce matching an async call will come through this event.
client.OnMessage.on((message) => {
    console.log('message', message);

});

// WARNING: Don't perform any requests inside this.
// The webSocket connection is not guaranteed to be fully ready yet.
client.init().then(async () => {
    console.log('Ready!');
});
```