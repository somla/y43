import {y43utils} from './y43utils';

export class y43call
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

export class y43function {
    public funcName: string;
    public args:Array<y43arg>;
    public kvargs:y43utilsDict<y43arg>;
    
    public constructor(_funcName: string) 
    {
        this.funcName = _funcName;
        this.args = new Array<y43arg>();
        this.kvargs = {};
    }

    public call(_y43rpc:y43rpc): y43call {
        let c = new y43call(this,_y43rpc);
        return c;
    }
    
    // TODO: delete
    public argsToJSON()
    {
        let jsonArgs = {
            "args": this.args,
            "kvargs": this.kvargs,
        };
        console.debug(jsonArgs);
        return jsonArgs;
    }
    public addArg(arg: y43arg, name: string| null)
    {
        // TODO: errorhandling
        if(null == name)
        {
            this.kvargs[name] = arg;
        }
        else
        {
            this.args.push(arg);
        }
    }
    public onReturn()
    {

    }
}