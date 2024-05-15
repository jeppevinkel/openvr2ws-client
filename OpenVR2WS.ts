import {toSha256} from './utils/encrypting';
import Event from './utils/event';
import {WebSocket} from 'isomorphic-ws';
import assert from 'node:assert';
import * as crypto from 'node:crypto';
import {InputSourceEnum, RequestKeyEnum, ResponseKeyEnum, TrackedDeviceClassEnum} from './enums';
import {ApplicationInfoResponse, CumulativeStatsResponse, DeviceIdsResponse, PlayAreaResponse, Response} from './types';

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
    private _requests = new Map<string, { resolve: (value: any) => void, transformer: (response: Response) => Response }>();

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

        return this.getResponsePromise<CumulativeStatsResponse>(nonce);
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

        return this.getResponsePromise<PlayAreaResponse>(nonce);
    }

    public getApplicationInfo(nonce: string | undefined = undefined) {
        this.sendRequest({
            Key: RequestKeyEnum.ApplicationInfo,
            Nonce: nonce
        });
    }

    public async getApplicationInfoAsync() {
        let nonce = crypto.randomUUID();
        this.getApplicationInfo(nonce);

        return this.getResponsePromise<ApplicationInfoResponse>(nonce);
    }

    public getDeviceIds(nonce: string | undefined = undefined) {
        this.sendRequest({
            Key: RequestKeyEnum.DeviceIds,
            Nonce: nonce
        });
    }

    public async getDeviceIdsAsync() {
        let nonce = crypto.randomUUID();
        this.getDeviceIds(nonce);

        return this.getResponsePromise<DeviceIdsResponse>(nonce, (response) => {
            // data.

            return response;
        });
    }

    // endregion

    private sendRequest(data: object) {
        assert(this._connected && this._socket, 'WebSocket isn\'t connected');
        this._socket.send(JSON.stringify(data));
    }

    private getResponsePromise<T>(nonce: string, transformer: (response: Response) => Response = response => response) {
        return new Promise<T>((resolve, reject) => {
            setTimeout(() => reject('Request timed out.'), 10000);
            this._requests.set(nonce, {
                resolve,
                transformer
            });
        });
    }

    private handleMessage(event: MessageEvent) {
        let data = JSON.parse(event.data) as Response;

        if (data?.Nonce && this._requests.has(data.Nonce)) {
            const request = this._requests.get(data.Nonce);
            this._requests.delete(data.Nonce);

            switch (data.Key) {
                case ResponseKeyEnum.DeviceIds:
                    let sourceToIndex = (data as {Data: {SourceToIndex: {[key: string]: number}}}).Data.SourceToIndex;
                    let sourceToIndexMap: Map<InputSourceEnum, number> = new Map();

                    Object.keys(sourceToIndex).forEach((key: string) => {
                        sourceToIndexMap.set(InputSourceEnum[key as keyof typeof InputSourceEnum], sourceToIndex[key]);
                    });

                    (data as DeviceIdsResponse).Data.SourceToIndex = sourceToIndexMap;

                    let deviceToIndex = (data as {Data: {DeviceToIndex: {[key: string]: number[]}}}).Data.DeviceToIndex;
                    let deviceToIndexMap: Map<TrackedDeviceClassEnum, Set<number>> = new Map();

                    Object.keys(deviceToIndex).forEach((key: string) => {
                        deviceToIndexMap.set(TrackedDeviceClassEnum[key as keyof typeof TrackedDeviceClassEnum], new Set(deviceToIndex[key]));
                    });

                    (data as DeviceIdsResponse).Data.SourceToIndex = sourceToIndexMap;
                    (data as DeviceIdsResponse).Data.DeviceToIndex = deviceToIndexMap;
                    break;
            }

            // data = request!.transformer(data);
            request!.resolve(data);
            return;
        }

        this._onMessage.trigger(data);
    }
}