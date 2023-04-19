import JsonRpcWebSocketClient, {
    MessageId as JsonRpcMessageId,
    RequestBasic as JsonRpcRequest,
} from "./JsonRpcWebSocketClient";

interface Aria2Options {
    url?: string;
    token?: string;
    timeout?: number;
}

export class Aria2Event<D> extends CustomEvent<D> {
    constructor(type: string, detail?: D) {
        super(type, {
            detail: detail
        });
    }

    readonly detail: D = super.detail;
}

export interface Aria2StateUpdateDetail {
    readyState: number;
}

export interface Aria2EventListener<D> extends EventListener {
    (evt: Aria2Event<D>): void;
}

export default class Aria2Client extends JsonRpcWebSocketClient {
    static readonly DEFAULT_ARIA2_URL = "ws://127.0.0.1:6800/jsonrpc";

    token?: string;
    timeout: number;

    eventTarget: EventTarget;

    constructor(opts?: Aria2Options) {
        let defaultOptions = {
            url: Aria2Client.DEFAULT_ARIA2_URL,
            token: undefined,
            timeout: 5000
        } as Aria2Options;
        let options = { ...defaultOptions, ...opts };
        let url: string = options.url != undefined ? options.url : Aria2Client.DEFAULT_ARIA2_URL;
        let timeout: number = options.timeout != undefined ? options.timeout : Aria2Client.DEFAULT_TIMEOUT;
        
        super(url);
        this.token = options.token;
        this.timeout = timeout;

        this.eventTarget = new EventTarget();
    }

    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) {
        this.eventTarget.addEventListener(type, callback, options);
    }

    on(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) {
        this.eventTarget.addEventListener(type, callback, options);
    }

    onOpen(callback: Aria2EventListener<Aria2StateUpdateDetail>) {
        this.addEventListener("open", callback);
    }

    onClose(callback: Aria2EventListener<Aria2StateUpdateDetail>) {
        this.addEventListener("close", callback);
    }

    buildRequest(method: string, ...params: any) : JsonRpcRequest {
        let request = {
            jsonrpc: JsonRpcWebSocketClient.VERSION,
            method: method,
            id: this.generateMessageId(),
        } as JsonRpcRequest;

        if (params != null) {
            request.params = this.buildParams(...params);
        }

        return request;
    }

    generateSecret() : string | null {
        if (this.token == null) {
            return null;
        }
        return `token:${this.token}`;
    }

    buildParams(...inputs: any) : any[] {
        let params: any[] = [];
        let secret = this.generateSecret();
        if (secret != null) {
            params.push(secret);
        }
        params.push(...inputs);
        return params;
    }

    connect(url?: string, token?: string, timeout: number = 5000) {
        if (url != undefined) {
            this.url = url;
        }
        if (token != undefined) {
            this.token = token;
        }
        if (timeout != undefined) {
            this.timeout = timeout;
        }
        this.socket = this.createSocket();
    }

    disconnect() {
        if (this.socket == undefined) {
            console.warn("未创建WebSocket客户端");
            return;
        }

        if (this.socket.readyState != WebSocket.OPEN) {
            console.warn("WebSocket连接状态不为open");
            return;
        }

        console.info("正在断开WebSocket连接");
        this.socket.close();
    }

    addUri(uris: string | string[], options?: Aria2Options, position?: number) {
        let uriList: string[] = (typeof uris === 'string') ? [ uris ] : uris;
        if (options == null && position != null) {
            options = {};
        }
        let request = this.buildRequest("aria2.addUri", uriList, options, position);
        this.sendRequest(request);
    }

    getVersion() {
        let request = this.buildRequest("aria2.getVersion");
        this.sendRequest(request);
    }

    handleOpen(event: Event) {
        super.handleOpen(event);
        let e = new Aria2Event<Aria2StateUpdateDetail>("open", {
            readyState: this.socket?.readyState
        } as Aria2StateUpdateDetail);
        this.eventTarget.dispatchEvent(e);
    }

    handleClose(event: CloseEvent) {
        super.handleClose(event);
        let e = new Aria2Event<Aria2StateUpdateDetail>("close", {
            readyState: this.socket?.readyState
        } as Aria2StateUpdateDetail);
        this.eventTarget.dispatchEvent(e);
    }

    handleError(event: Event) {
        super.handleError(event);
        // this.eventTarget.dispatchEvent(event);
    }
}