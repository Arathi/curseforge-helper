export type MessageId = number | string | null;

export interface Request<P> {
    jsonrpc: string;
    method: string;
    params?: P;
    id: MessageId;
}

export type RequestBasic = Request<any|any[]>

enum MessageIdType {
    Integer,
    String,
}

interface Response<R, ED> {
    jsonrpc: string;
    result?: R;
    error?: Error<ED>;
    id: MessageId;
}

interface Error<D> {
    code: number;
    message: string;
    data?: D;
}

export type ResponseBasic = Response<any, any>;

export default class JsonRpcWebSocketClient {
    static readonly VERSION = "2.0";
    static readonly DEFAULT_WS_URL = "ws://127.0.0.1:8080/websocket";
    static readonly DEFAULT_TIMEOUT = 5000;

    url: string;
    socket?: WebSocket;
    msgIdType: MessageIdType;
    seq: number;

    constructor(url: string, msgIdType: MessageIdType = MessageIdType.Integer) {
        this.url = url;
        this.msgIdType = msgIdType;
        this.seq = 0;
    }

    createSocket() : WebSocket {
        let socket = new WebSocket(this.url);
        socket.onopen = (event) => this.handleOpen(event);
        socket.onmessage = (event) => this.handleMessage(event);
        socket.onclose = (event) => this.handleClose(event);
        socket.onerror = (event) => this.handleError(event);
        return socket;
    }

    handleOpen(event: Event) {
        console.debug("处理open事件：", event);
    }

    handleMessage(event: MessageEvent) {
        console.debug("处理message事件：", event);
    }
    
    handleClose(event: CloseEvent) {
        console.debug("处理close事件：", event);
    }
    
    handleError(event: Event) {
        console.debug("处理error事件：", event);
    }

    generateMessageId() : MessageId {
        if (this.msgIdType == MessageIdType.Integer) {
            return ++this.seq;
        }
        return crypto.randomUUID();
    }

    sendRequest(request: RequestBasic) {
        if (this.socket == null) {
            console.warn("未创建WebSocket客户端");
            return;
        }
        if (this.socket.readyState != WebSocket.OPEN) {
            console.warn("未连接到WebSocket服务器");
            return;
        }

        let json = JSON.stringify(request);
        console.info("请求报文结构如下：", request);
        console.info("转换为JSON：", json);
        this.socket.send(json);
    }
}