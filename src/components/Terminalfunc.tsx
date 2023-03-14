import React from "react";
import axios from "axios";
import "./setting";

export function Terminalfunc(postnemonic:string, postregister:number[], postmemory:number[]){
    const baseurl = "https://wazm.azurewebsites.net/asm";
    const [result, setResult] = React.useState();

    console.log(postnemonic);
    console.log(postregister);
    console.log(postmemory);


    // axios.post(baseurl,{
    //     mnemonic: postnemonic,
    //     register: postregister,
    //     memory: postmemory
    // }).then((response) => {
    //     setResult(response.data);
    // });
    console.log(result);
    return result;

}