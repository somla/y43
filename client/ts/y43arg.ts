abstract class y43arg {
    public typename: string;
    public req: boolean;
    constructor(_typeName: string, _req: boolean) {
        this.typename = _typeName;
        this.req = _req;
    }
    public abstract toJSON(): any;
}

class y43argStringReqOrNot extends y43arg
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

class y43argStringReq extends y43argStringReqOrNot
{
    constructor(_value:string )
    {
        super(_value, true);
    }
}

class y43argStringOpt extends y43argStringReqOrNot
{
    constructor(_value:string )
    {
        super(_value, false);
    }
}