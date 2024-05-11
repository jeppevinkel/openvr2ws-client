import {toSha256} from './utils/encrypting';
import Event from './utils/event';
import {WebSocket} from "isomorphic-ws";
// import WebSocket from 'ws';

export type OpenVR2WSConfig = {
    host: string
    port: number
    password?: string
}

export interface ISimpleEventHandler<TArgs> {
    (args: TArgs): void;
}

export class OpenVR2WS {
    private _config: OpenVR2WSConfig;
    private _password?: string;
    private _socket?: WebSocket;
    private _connected: boolean = false;

    constructor(config: OpenVR2WSConfig = {host: '127.0.0.1', port: 7708}) {
        this._config = config;
    }

    async init() {
        if (this._config.password !== undefined) {
            this._password = await toSha256(this._config.password);
        }

        this._socket = new WebSocket(`ws://${this._config.host}:${this._config.port}`) as WebSocket;
        this._socket.onopen = (event) => {
            this._connected = true;
            this._onStatus.trigger(true);
        };
        this._socket.onclose = (event) => {
            this._connected = false;
            this._onStatus.trigger(false);
        };
    }

    // Events
    private readonly _onStatus = new Event<boolean>();
    private readonly _onAppId = new Event<string>();

    public get OnStatus() {
        return this._onStatus.expose();
    }

    public get OnAppId() {
        return this._onAppId.expose();
    }
}