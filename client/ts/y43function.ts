class y43call
{
    public y43f:y43function;
    public sendTimeStamp:number;
    public callId:string;
    public constructor(_y43function:y43function, rpc:y43rpc )
    {
        let now:number = y43utils.nowNumber(1000, y43roundEnum.none);
        let random:string = y43utils.randomInt(0,10000).toString();
        this.callId = "call_" + now.toString() + "_" + random;
        rpc.send(this);
        this.y43f = _y43function;
    }
    public onmessage( message:y43rpcMessage )
    {
        // TODO: I don't know, I have to sleep.
        this.y43f.onReturn();
    }
}

class y43function {
    public funcName: String;
    public args:Array<y43arg>;
    public kvargs:y43utilsDict<y43arg>;
    
    public constructor(_funcName: String) 
    {
        this.funcName = _funcName;
    }
    public call(_y43rpc:y43rpc): y43call {
        let c = new y43call(this,_y43rpc);
        return c;
    }
    
    public argsToJSON():string
    {
        let jsonArgs = {
            "args": this.args,
            "kvargs": this.kvargs,
        };
        console.debug(jsonArgs);
        let strArgs = JSON.stringify(jsonArgs);
        console.debug(strArgs);
        return strArgs;
    }
    public addArg(arg: y43arg, name: string| null)
    {

    }
    public onReturn()
    {

    }
}


class y43helloWorld extends y43function
{
    constructor()
    {
        super("hello_world");
    }
}

let rpc = new y43rpc();
let f:y43helloWorld = new y43helloWorld();
f.call(rpc);