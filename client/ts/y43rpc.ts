class y43rpcMessage
{
    public call_id:string|null;
    public success:boolean|null;
    public req_arrive_time:number|null;
    public req_sending_time:number|null;
    public res:string|null;
    public error_msg:string|null;
    public rawData:string|null;
    
    constructor(str:string)
    {
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

class y43rpc
{
    public static connections:Array<y43rpc>;
    public static lastConnection():y43rpc|null
    {
        return y43utils.lastItem(this.connections);
    }

    public wsUrl:string;
    public ws:WebSocket;
    public calls:y43utilsDict<y43call>;
    onmessage( ev:MessageEvent)
    {
        //TODO:Errorhandling
        let message = new y43rpcMessage(ev.data);
        this.calls[message.call_id].onmessage(message);
    }
    public send(call:y43call){
        this.calls[call.callId] = call;
        // TODO: finish
        this.ws.send("")
    }
    constructor(_wsUrl:string = ""){
        y43rpc.connections.push(this);
        if("" === _wsUrl)
        {
            _wsUrl = "ws://" + window.location.host + "/websocket";
        }
        this.wsUrl = _wsUrl;
        this.ws = new WebSocket(this.wsUrl);
        this.ws.onmessage = function(ev:MessageEvent) { this.onmessage(ev); };
    }
}