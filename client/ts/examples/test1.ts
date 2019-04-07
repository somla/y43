
class y43helloWorld extends y43function
{
    constructor()
    {
        super("hello_world");
    }
}

let rpc = new y43rpc();
let f:y43helloWorld = new y43helloWorld();
let call:y43call = f.call(rpc);