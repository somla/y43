function send_msg()
{
    if(typeof(window["ws"]) === "undefined")
    {
        console.log("ws doesn't exist")
        return false;
    }
    let req = {};
    req["function"] = document.getElementById("function_name").value;
    let tr_args = document.getElementById("args_table").getElementsByClassName("arg_tr");
    let kwargs = {};
    let args = [];
    for(let i = 0; i< tr_args.length; i++)
    {
        let inputs = tr_args[i].getElementsByTagName("input")
        let arg_name = inputs[0].value;
        let arg_value = inputs[1].value;
        if("" === arg_name)
        {
            args.push(arg_value);
        }
        else
        {
            kwargs[arg_name] = arg_value
        }
    }
    if(args.length !== 0)
    {
        req.args = args;
    }
    if(Object.keys(kwargs).length !== 0)
    {
        req.kwargs = kwargs;
    }
    req.call_id = "call_" + Math.floor(Math.random() * 1000000).toString()
    req.req_sending_time = (new Date()).getTime();
    let reqStr = JSON.stringify(req);
    console.log(reqStr);
    window["ws"].send(reqStr);
}

function onopen(event)
{
    console.log("ws onopen")
    document.getElementById("socketStatus").innerText = "opened"
    console.log(event)
}

function onclose(event)
{
    console.log(event)
    document.getElementById("socketStatus").innerText = "closed"
}

function onmessage(event)
{
    console.log("ws onmessage")
    console.log(event)
    document.getElementById("result").innerText = event.data;
}

function close_socket(){
    if(typeof(window["ws"]) !== "undefined")
    {
        console.log("ws closeing...")
        document.getElementById("socketStatus").innerText = "closeing"
        window["ws"].close();
    }
    else
    {
        console.log("ws doesn't exist")
    }
}

function open_reoopen_socket()
{

    close_socket();
    if(typeof(window["ws"]) === "undefined" || window["ws"].readyState === 3)
    {
        let url = "ws://" + window.location.host + "/websocket"
        console.log("ws opening (" + url  + ")...")
        document.getElementById("socketStatus").innerText = "opening"
        window["ws"] = new WebSocket(url);

        window["ws"].onmessage = onmessage;
        window["ws"].onopen = onopen;
        window["ws"].onclose = onclose;
    }
}

function deleteArgument(e)
{
    let parentTr = e.target.parentElement.parentElement;
    parentTr.parentElement.removeChild(parentTr);
    console.log(e);
}

function add_argument()
{
    let arg_trs = document.getElementById("args_table").getElementsByClassName("arg_tr");
    let id = (arg_trs.length == 0) ? 0 : Number(arg_trs[arg_trs.length-1].id) + 1;

    let input_argname = document.createElement("input");
    let input_argvalue = document.createElement("input");
    let button_argdelete = document.createElement("button");
    button_argdelete.innerText = "Delete";
    button_argdelete.onclick = deleteArgument;
    
    let td_argname = document.createElement("td");
    td_argname.appendChild(input_argname);
    
    let td_argvalue = document.createElement("td");
    td_argvalue.appendChild(input_argvalue);
    
    let td_argdelete = document.createElement("td");
    td_argdelete.appendChild(button_argdelete);
    
    let tr = document.createElement("tr")
    tr.id = id;
    tr.className = "arg_tr"
    tr.appendChild(td_argname);
    tr.appendChild(td_argvalue);
    tr.appendChild(td_argdelete);

    document.getElementById("args_table").appendChild(tr);

}