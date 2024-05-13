# openvr2ws-client
[![npm (scoped)](https://img.shields.io/npm/v/openvr2ws-client)](https://www.npmjs.com/package/openvr2ws-client)

## Installation
Use [npm] to install the package.

```bash
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

## Docs

[https://jeppevinkel.github.io/openvr2ws-client](https://jeppevinkel.github.io/openvr2ws-client/)

## Contributing
Pull requests are welcome. For design changes, please open an issue to discuss what you would like to change.

## License
[MIT]

[npm]: https://www.npmjs.com
[MIT]: https://opensource.org/licenses/MIT