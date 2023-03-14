"use client"
import styles from "./css/terminal.module.css"
import { useEffect, useState } from "react"
import { Box, Grid, Button } from "@mui/material"
import axios from "axios"


export const Codebox = () => {
    const [operation, setOperation] = useState<string>('');
    const [rip, setRip] = useState<string>('');
    const [registers, setRegisters] = useState<number[]>([]);
    const [memorys, setMemorys] = useState<number[]>([]);
    const [memoryCol, setMemoryCol] = useState<string>();
    const [currentPos, setCurrentPos] = useState<number>(0);
    const Operations = ["mov", "hoge"]
    const registerName = [
        "rax   "
        , "rbx   "
        , "rcx   "
        , "rdx   "
        , "rsp   "
        , "rbp   "
        , "rsi   "
        , "rdi   "
        , "r8    "
        , "r9    "
        , "r10   "
        , "r11   "
        , "r12   "
        , "r13   "
        , "r14   "
        , "r15   "
        , "rflags"
        , "rip   "
    ]
    type resultprops = {
        memory: number[],
        register: number[],
        success: boolean
    }
    const [result, setResult] = useState<resultprops>();
    const baseurl = "https://wazm.azurewebsites.net/asm";

    function Clear() {
        setOperation("");
        setRip("");
    }

    async function Post(postnemonic: string, postregister: number[], postmemory: number[]) {
        console.log(postnemonic)
        console.log(postregister)
        console.log(postmemory)
        try {
            await axios.post(baseurl, {
                mnemonic: postnemonic,
                register: postregister,
                memory: postmemory
            }).then((response) => {
                var res = response.data;
                console.log(res);
                setResult(response.data);
                if (response.data.isSuccess) {
                    setMemorys(response.data.memory)
                    setRegisters(response.data.register)
                } else {
                    alert("実行時にエラーが生じました。");
                }
            });
        } catch (error) {
            console.log("eroor");
        };
    }
    async function PostALL(postnemonic: string, postregister: number[], postmemory: number[]) {
        const URL = baseurl + "/all"
        let postnimonics:string[] = postnemonic.split("\n");
        if(postnimonics == null){
            postnimonics = [postnemonic];
        }

        console.log(postnimonics)
        console.log(postregister)
        console.log(postmemory)
        try {
            await axios.post(URL, {
                mnemonics: postnimonics,
                register: postregister,
                memory: postmemory
            }).then((response) => {
                var res = response.data;
                console.log(res);
                setResult(response.data);
                if (response.data.isSuccess) {
                    setMemorys(response.data.memory)
                    setRegisters(response.data.register)
                } else {
                    alert("実行時にエラーが生じました。");
                }
            });
        } catch (error) {
            console.log("eroor");
        };
    }

    function LineExecution(num: number) {
        var lines: string[] = operation.split(/\n/);
        Post(lines[num], registers, memorys)
    }


    function InputByte(operation: string) {
        var newOpereteList = operation.split(/\n/);
        var byteList: string[] = [];
        var bytes = "";
        for (let i: number = 0; i < newOpereteList.length; i++) {
            if (newOpereteList[i] == "") {
                bytes = bytes + "\n";
            } else {
                var textArray = newOpereteList[i].split(/,|\s/)
                if (Operations.indexOf(textArray[0]) > -1) {
                    bytes = bytes + "exit\n";
                } else {
                    bytes = bytes + "undifined\n";
                }
            }
        }
        setRip(bytes);
        return byteList;
    }

    function GetCoursol() {
        //const element: HTMLInputElement =<HTMLInputElement>document.getElementById();
        let area = document.getElementById("operate");
        let target = (area as HTMLInputElement);
        if (target != null) {
            if (target.selectionStart == target.selectionEnd) {
                let position = target.selectionStart as number;
                let beforetext = operation.substring(0, position);
                let colList = beforetext.split("\n");
                console.log(colList.length)
                return (colList.length - 1)
            }
        }

        return 0;
    }


    const changeInput = () => {
        InputByte(operation)
    };

    const setScroll = () => {
        document.getElementById("bytes")?.scrollTo({ top: document.getElementById("operate")?.scrollTop });
    }
    function Sumple() {
        console.log("loaded");
        const newRegister: number[] = [];
        for (let l = 0; l < 18; l++) {
            newRegister.push(0);
        }
        const newMemorys: string[] = [];
        let newCols = "";
        let firstMemory: number[] = [];
        for (let k = 0; k < 16; k++) {
            for (let m = 0; m < 16; m++) {
                newCols = newCols + "00" + " ";
                firstMemory.push(0);
            }
            newMemorys.push(newCols);
            newCols = "";
        }
        console.log(newMemorys);
        setMemorys(firstMemory);
        setRegisters(newRegister);
    }

    useEffect(() => {
        document.getElementById("operate")?.addEventListener('scroll', setScroll)
        return () => document.getElementById("operate")?.removeEventListener('scroll', setScroll)
    })
    useEffect(() => {
        changeInput();
        setCurrentPos(GetCoursol())
    })
    useEffect(() => {
        Sumple();
    }, [])



    const defaultProps = {
        bgcolor: '#f5f5f5',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '30rem' },
    };
    const RegisterProps = {
        bgcolor: '#f5f5dc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '8rem' },
    };
    const MemoryProps = {
        bgcolor: '#f5f5dc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '25rem' },
    };

    return (
        <main>
            <div className={styles.main}>
                <Grid container justifyContent='center'>
                    <Grid item xs={5}>
                        <Box display="flex" justifyContent="center" sx={{ pt: 2, pb: 0 }}>
                            <Box borderRadius={2} {...RegisterProps} >
                                <div style={{ paddingLeft: 5 }}>
                                    レジスタ状況
                                </div>
                                <Grid container justifyContent='center' direction="column" alignItems="center" style={{overflow: "auto"}}>

                                    <div style={{ overflow: "auto" }}>
                                        <div style={{ fontSize: 12, paddingTop: 20, whiteSpace: "nowrap" }}>
                                            {registerName.map((value, index) => (
                                                <span style={{ padding: 3 }} key={index} >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 12, paddingBottom: 20, whiteSpace: "nowrap" }}>
                                            {registers.map((value, index) => (
                                                <span style={{ padding: 10.1 }} key={index} >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </Grid>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="center" sx={{ pt: 0.5, pb: 1 }} >
                            <Box borderRadius={2} {...MemoryProps} >
                                メモリ状況
                                <Grid container justifyContent='center' alignItems="center">
                                    <Grid item xs={15} sm={10}>
                                        <div style={{ fontSize: 12, padding: "3%", whiteSpace: "nowrap", overflow: "auto" }}>
                                            {memorys.map((value, index) => (
                                                <span key={index} style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    <span className={index % 16 === 0 ? styles.br : ''}>
                                                        {value}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box display="flex" justifyContent="center" sx={{ pt: 2, pb: 0 }}>
                            <Box borderRadius={2} {...defaultProps} >
                                <div className={styles.editortop}>
                                    アセンブリエディタ
                                </div>
                                <div className={styles.area}>
                                    <textarea id="bytes" spellCheck={false} value={rip} className={styles.byte} onChange={(e) => console.log("chaged")} onBlur={() => setCurrentPos(GetCoursol())}></textarea>
                                    <textarea id="operate" spellCheck={false} value={operation} onChange={(e) => setOperation(e.target.value)} className={styles.operation}></textarea>
                                </div>
                            </Box>
                        </Box>
                        <Grid container justifyContent='center' >
                            <Box sx={{ p: "1%" }}>
                                <Button variant="outlined" onClick={() => PostALL(operation, registers, memorys)}>
                                    全て実行
                                </Button>
                            </Box>
                            <Box sx={{ p: "1%" }}>
                                <Button variant="outlined" onClick={() => LineExecution(currentPos)}>
                                    現在の行を実行
                                </Button>
                            </Box>
                            <Box sx={{ p: "1%" }}>
                                <Button variant="outlined" onClick={() => Clear()}>
                                    クリア
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </main>
    )
}
