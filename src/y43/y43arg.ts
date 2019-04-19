import './y43';

export abstract class y43arg {
    public typename: string;
    public req: boolean;
    constructor(_typeName: string, _req: boolean) {
        this.typename = _typeName;
        this.req = _req;
    }
    public abstract toJSON(): any;
}

export class y43argStringReqOrNot extends y43arg
{
    value:string;
    constructor(_value:string,_req:boolean = true )
    {
        super("y43argString", _req)
        this.value = _value;
    }
    public toJSON():string
    {
        return this.value;
    }
}

export class y43argStringReq extends y43argStringReqOrNot
{
    constructor(_value:string )
    {
        super(_value, true);
    }
}

export class y43argStringOpt extends y43argStringReqOrNot
{
    constructor(_value:string )
    {
        super(_value, false);
    }
}