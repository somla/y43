class y43rpcMessage
{
    public function:string|null;
    public call_id:string|null;
    public success:boolean|null;
    public req_arrive_time:number|null;
    public req_sending_time:number|null;
    public res:string|null;
    public error_msg:string|null;
    public rawData:string|null;
    public args:Array<y43arg>|null;
    public kvargs:y43utilsDict<y43arg>| null;
}

class y43rpcRecieveMessage extends y43rpcMessage
{
    constructor(str:string)
    {
        super();
        //TODO: Error handling
        let jsonObj:Object     = JSON.parse(str);
        this.call_id           = jsonObj["call_id"];
        this.success           = jsonObj["success"];
        this.req_arrive_time   = jsonObj["req_arrive_time"];
        this.req_sending_time  = jsonObj["req_sending_time"];
        this.res               = jsonObj["res"];
        this.error_msg         = jsonObj["error_msg"];
    }
}

class y43rpcSendMessage extends y43rpcMessage
{
    constructor(call:y43call)
    {
        super();
        
        this.function          = call.y43f.funcName;
        this.args              = call.y43f.args;
        this.kvargs            = call.y43f.kvargs;
        this.call_id           = call.callId;
        this.success           = null;
        this.req_arrive_time   = null; // TODO: thinking
        this.req_sending_time  = null; // TODO: thinking
        this.res               = null;
        this.error_msg         = null;
    }
    
    public toJSON():Object
    {
        return {
            "function"         : this.function,
            "args"             : this.args,
            "kvargs"           : this.kvargs,
            "call_id"          : this.call_id,
            "success"          : this.success,
            "req_arrive_time"  : this.req_arrive_time,
            "req_sending_time" : this.req_sending_time,
            "res"              : this.res,
            "error_msg"        : this.error_msg,
        }
    }
}

class y43rpc
{
    public static connections:Array<y43rpc> = new Array<y43rpc>();
    public static lastConnection():y43rpc|null
    {
        return y43utils.lastItem(this.connections);
    }

    public wsUrl:string;
    public ws:WebSocket;
    public calls:y43utilsDict<y43call>;
    public notSentCalls:Array<y43call>;

    constructor(_wsUrl:string = "")
    {
        if("" === _wsUrl)
        {
            _wsUrl = "ws://" + window.location.host + "/websocket";
        }
        this.calls = {};
        this.notSentCalls = Array<y43call>();
        y43rpc.connections.push(this);
        this.wsUrl = _wsUrl;
        this.ws = new WebSocket(this.wsUrl);
        let _this = this;
        this.ws.onmessage = function(ev:MessageEvent) { _this.onmessage(ev); };
        this.ws.onopen = function(ev:MessageEvent) { _this.onopen(ev); };
    }

    onopen(ev:MessageEvent)
    {
        for(let i = 0; i < this.notSentCalls.length; ++i)
        {
            this._send( this.notSentCalls[i] );
        }
        this.notSentCalls = new Array<y43call>();
    }

    onmessage(ev:MessageEvent)
    {
        //TODO:Errorhandling
        console.log("hello");
        console.log(ev);
        let message = new y43rpcRecieveMessage(ev.data);
        if(message.call_id == null || "undefined" === typeof(this.calls[message.call_id]) )
        {
            console.warn("Message arrived with unknown call_id:" + message.call_id )
        }
            this.calls[message.call_id].onmessage(message);
    }

    private _send(call:y43call)
    {
        this.calls[call.callId] = call;
        let sendMessage = new y43rpcSendMessage(call);
        this.ws.send( JSON.stringify(sendMessage) );
    }

    public send(call:y43call){
        switch( this.ws.readyState )
        {
            case WebSocket.OPEN:
                return this._send(call);
            case WebSocket.CONNECTING:
                this.notSentCalls.push(call);
                // TODO: own enum
                return WebSocket.CONNECTING;
            default:
                return this.ws.readyState;
        }
    }
}