import {toSha256} from './utils/encrypting';
import Event from './utils/event';
import {WebSocket} from 'isomorphic-ws';
import assert from 'node:assert';
// import WebSocket from 'ws';
import * as crypto from 'node:crypto';
import {RequestKeyEnum} from './enums/requestKeyEnum';
import {CumulativeStatsResponse, PlayAreaResponse, Response} from './types';
import {ResponseTypeEnum} from './enums/responseTypeEnum';
import {ResponseKeyEnum} from './enums/responseKeyEnum';

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
    private _requests = new Map<string, (value: any) => void>();

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
        this._socket.onmessage = this.handleMessage.bind(this);
    }

    // Events
    private readonly _onStatus = new Event<boolean>();
    private readonly _onAppId = new Event<string>();
    private readonly _onMessage = new Event<Response>();

    public get OnStatus() {
        return this._onStatus.expose();
    }

    public get OnAppId() {
        return this._onAppId.expose();
    }

    public get OnMessage() {
        return this._onMessage.expose();
    }

    // region requests

    public getCumulativeStats(nonce: string | undefined = undefined) {
        this.sendRequest({
            Key: RequestKeyEnum.CumulativeStats,
            Nonce: nonce
        });
    }

    public async getCumulativeStatsAsync() {
        let nonce = crypto.randomUUID();
        this.getCumulativeStats(nonce);

        return new Promise<CumulativeStatsResponse>((resolve, reject) => {
            setTimeout(() => reject('Request timed out.'), 10000);
            this._requests.set(nonce, resolve);
        });
    }

    public getPlayArea(nonce: string | undefined = undefined) {
        this.sendRequest({
            Key: RequestKeyEnum.PlayArea,
            Nonce: nonce
        });
    }

    public async getPlayAreaAsync() {
        let nonce = crypto.randomUUID();
        this.getPlayArea(nonce);

        return new Promise<PlayAreaResponse>((resolve, reject) => {
            setTimeout(() => reject('Request timed out.'), 10000);
            this._requests.set(nonce, resolve);
        });
    }

    // endregion

    private sendRequest(data: object) {
        assert(this._connected && this._socket, 'WebSocket isn\'t connected');
        this._socket.send(JSON.stringify(data));
    }

    private handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data) as Response;
        if (data?.Nonce && this._requests.has(data.Nonce)) {
            const resolve = this._requests.get(data.Nonce);
            this._requests.delete(data.Nonce);

            resolve!(data);
            return;
        }

        this._onMessage.trigger(data);
    }
}