class y43call
{
    public y43f:y43function;
    public sendTimeStamp:Number;
    public callId:string;
    public constructor(_y43function:y43function, rpc:y43rpc )
    {
        let now:Number = y43utils.nowNumber(1000, y43roundEnum.none);
        let random:string = y43utils.randomInt(0,10000).toString();
        this.callId = "call_" + now.toString() + "_" + random;
        rpc.send(this);
        this.y43f = _y43function;
    }
    public onmessage( message:y43rpcMessage )
    {
        // TODO: I don't know, I have to sleep.
        this.y43f.onMessage();
    }
}

class y43function {
    public funcName: String;
    public onMessage: Function;
    public constructor(_funcName: String, _onmessage: Function) {
        this.funcName = _funcName;
        this.onMessage = _onmessage;
    }
    public send(_y43rpc:y43rpc): y43call {
        let c = new y43call(this,_y43rpc);
        return c;
    }
    public addArg(arg: any) {
    }
}
