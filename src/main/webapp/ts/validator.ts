interface Validator{
    [index:number]:(arg:any)=>boolean
}

var validator:Validator = {
    //not null
    1001: (arg)=> {
        if (typeof (arg) === "undefined" || arg == null ) {
            return false;
        } else if (arg == "") {
            return false;
        }
        return true;
    },
    //email format
    1002:(arg)=>{
        return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(arg);
    }
}

