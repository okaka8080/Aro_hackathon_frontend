"use client"
import styles from "./css/terminal.module.css"
import { useEffect, useState } from "react"
import { Box, Grid, Button } from "@mui/material"
import axios from "axios"
import { RichTextarea } from "rich-textarea";
import { useKeyPressEvent } from 'react-use'

export const Codebox = () => {
    const [operation, setOperation] = useState<string>('');
    const [rip, setRip] = useState<string>('');
    const [registers, setRegisters] = useState<number[]>([]);
    const [memorys, setMemorys] = useState<number[]>([]);
    const [currentPos, setCurrentPos] = useState<number>(0);
    const [currentRow, setCurrentRow] = useState<number>(-10);
    const [processing, setProcessing] = useState(false);
    const [displays, setDisplays] = useState<string>("");
    const [currentRsp, setCurrentRsp] = useState<number>(0);
    const registerName = ["rax", "rbx", "rcx", "rdx", "rsp", "rbp", "rsi", "rdi", "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15", "rflags", "rip"]
    type resultprops = {
        memory: number[],
        register: number[],
        IsSuccess: boolean,
        display: string
    }
    const [result, setResult] = useState<resultprops>();
    const baseurl = "https://wazm.azurewebsites.net/asm";

    function Clear() {
        setCurrentRow(-10);
        setOperation("");
        setRip("");
    }

    function SerchRow(next: number) {//未使用関数
        let rows = rip.split("\n");
        let allopereation = operation.split("\n");
        let fixrows = rows.filter(Boolean);
        let fixoperation = allopereation.filter(Boolean);
        for (let i = 0; i < rows.length; i++) {
            if (Number(rows[i]) == next) {
                setCurrentRow(i);
            }
        }
        for (let i = 0; i < fixrows.length; i++) {
            if (Number(fixrows[i]) == next) {
                Post(fixoperation[i], registers, memorys, displays);
                return fixoperation[i];
            }
        }
        return "not found";
        setProcessing(false);
    }



    async function Post(postnemonic: string, postregister: number[], postmemory: number[], postdisplay: string) {
        try {
            await axios.post(baseurl, {
                mnemonic: postnemonic,
                register: postregister,
                memory: postmemory,
                display: postdisplay
            }).then((response) => {
                var res = response.data;
                setResult(response.data);
                if (response.data.isSuccess) {
                    let prevRip = registers[17];
                    setMemorys(response.data.memory);
                    setRegisters(response.data.register);
                    setDisplays(response.data.display)
                    setCurrentRsp(response.data.register[4]);
                    setCurrentRow(-10);
                    setProcessing(false);
                } else {
                    alert(response.data.error_message);
                    setProcessing(false);
                    setCurrentRow(-10);
                }
            });
        } catch (error) {
            alert("通信エラーです。");
        };
    }
    async function PostALL(postnemonic: string, postregister: number[], postmemory: number[]) {
        const URL = baseurl + "/all"
        let postnimonics: string[] = postnemonic.split("\n");
        if (postnimonics == null) {
            postnimonics = [postnemonic];
        }
        postnimonics = postnimonics.filter(Boolean);
        try {
            await axios.post(URL, {
                mnemonics: postnimonics,
                register: postregister,
                memory: postmemory,
                display: ""
            }).then((response) => {
                var res = response.data;
                setResult(response.data);
                if (response.data.isSuccess) {
                    setMemorys(response.data.memory)
                    setRegisters(response.data.register)
                    setDisplays(response.data.display)
                    setCurrentRsp(response.data.register[4]);
                } else {
                    alert(response.data.error_message);
                }
            });
        } catch (error) {
            alert("通信エラーです。");
        };
    }

    function LineExecution(num: number) {
        if (processing) {
            return;
        }
        setProcessing(true);
        var lines: string[] = operation.split(/\n/);
        setCurrentRow(num);
        Post(lines[num], registers, memorys, displays)
    }


    function InputByte(operation: string) {
        var newOpereteList = operation.split(/\n/);
        var byteList: string[] = [];
        var bytes = "";
        var newrows = 0;
        for (let i: number = 0; i < newOpereteList.length; i++) {
            if (newOpereteList[i] == "" || newOpereteList[i] == "") {
                bytes = bytes + "\n";
            } else {
                newrows++;
                bytes = bytes + newrows.toString() + "\n";
            }
        }
        setRip(bytes);
        return byteList;
    }

    function GetCoursol() {
        let area = document.getElementById("operate");
        let target = (area as HTMLInputElement);
        if (target != null) {
            if (target.selectionStart == target.selectionEnd) {
                let position = target.selectionStart as number;
                let beforetext = operation.substring(0, position);
                let colList = beforetext.split("\n");
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
        const newRegister: number[] = [];
        for (let l = 0; l < 17; l++) {
            newRegister.push(0);
        }
        newRegister.push(1)
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
        setMemorys(firstMemory);
        setRegisters(newRegister);
    }

    useKeyPressEvent(
        () => true,
        () => {
            GetCoursol();
        },
        () => {
        }
    )

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
        bgcolor: '#dcdcdc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '33rem' },
    };
    const RegisterProps = {
        bgcolor: '#dcdcdc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '6rem' },
    };
    const MemoryProps = {
        bgcolor: '#dcdcdc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '22rem' },
    };
    const DisplayProps = {
        bgcolor: '#000000',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '100%', height: '6rem' },
    };
    const HeadProps = {
        bgcolor: '#808080',
        borderColor: 'text.primary',
        m: 0,
        style: { width: '100%', height: '3rem' },
    };

    return (
        <main>
            <div className={styles.main}>
                <Grid container justifyContent='center'>
                    <Grid item xs={5} >
                        <Box display="flex" justifyContent="center" sx={{ pt: 2, pb: 0 }} >
                            <Box borderRadius={2} {...DisplayProps}>
                                <div style={{ color: "white" }} className={styles.Rock}>
                                    ディスプレイ
                                </div>
                                <Grid container direction="column" style={{ overflow: "auto" }}>
                                    <div style={{ color: "white", padding: "2%", whiteSpace: "pre-wrap", overflow: "auto", height: "2.5rem" }}>
                                        {displays}
                                    </div>
                                </Grid>

                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="center" sx={{ pt: 0.5, pb: 0 }}>
                            <Box borderRadius={2} {...RegisterProps} >
                                <div style={{ paddingLeft: 5 }} className={styles.Rock}>
                                    レジスタ状況
                                </div>
                                <Grid container justifyContent='center' direction="column" alignItems="center" style={{ overflow: "auto" }}>
                                    <table style={{ overflow: "auto" }}>
                                        <thead>
                                            <tr style={{ fontSize: 12, paddingTop: 20, whiteSpace: "nowrap" }}>
                                                {registerName.map((value, index) => (
                                                    <th style={{ padding: 5 }} key={index} >
                                                        {value}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ fontSize: 12, paddingBottom: 20, whiteSpace: "nowrap" }}>
                                                {registers.map((value, index) => (
                                                    <td style={{ padding: 10.5 }} key={index} >
                                                        {value}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </Grid>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="center" sx={{ pt: 0.5, pb: 1 }} >
                            <Box borderRadius={2} {...MemoryProps} >
                                <div className={styles.Rock}>
                                    メモリ状況
                                </div>
                                <Grid container justifyContent='center' alignItems="center">
                                    <Grid item xs={7} sm={8} style={{ overflow: "auto" }}>
                                        <table style={{ fontSize: 10 }} className={styles.newtable}>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto", paddingBlock: "1%" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (index < 16) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (index < 16) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (15 < index) && (index < 32) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (15 < index) && (index < 32) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (31 < index) && (index < 48) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (31 < index) && (index < 48) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (47 < index) && (index < 64) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (47 < index) && (index < 64) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (63 < index) && (index < 80) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (63 < index) && (index < 80) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (79 < index) && (index < 96) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (79 < index) && (index < 96) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (95 < index) && (index < 112) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (95 < index) && (index < 112) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (111 < index) && (index < 128) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (111 < index) && (index < 128) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (127 < index) && (index < 144) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (127 < index) && (index < 144) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (143 < index) && (index < 160) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (143 < index) && (index < 160) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (159 < index) && (index < 176) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (159 < index) && (index < 176) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (175 < index) && (index < 192) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (175 < index) && (index < 192) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (191 < index) && (index < 208) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (191 < index) && (index < 208) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (207 < index) && (index < 224) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (207 < index) && (index < 224) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (223 < index) && (index < 240) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (223 < index) && (index < 240) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}
                                                        </>
                                                    ))}
                                                </tr>
                                                <tr style={{ padding: "2%", textAlign: "center", margin: "auto" }}>
                                                    {memorys.map((value, index) => (
                                                        <>
                                                            {(index != (currentRsp - 1)) && (239 < index) && (index < 256) ? <td>{value}</td> : ""}
                                                            {(index == (currentRsp - 1)) && (239 < index) && (index < 256) ? <td style={{ backgroundColor: "yellow" }}>{value}</td> : ""}                                                        </>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box display="flex" justifyContent="center" sx={{ pt: 2, pb: 0 }}>
                            <Box borderRadius={2} {...defaultProps} >
                                <Box borderRadius={2} {...HeadProps} >
                                    <div className={styles.editortop}>
                                        <div className={styles.Rock}>
                                            アセンブリエディタ
                                        </div>
                                    </div>
                                </Box>
                                <Grid container justifyContent={"center"} paddingTop="3%">
                                    <Grid item xs={2}>
                                        <RichTextarea id="bytes" spellCheck={false} value={rip} className={styles.byte} style={{ width: "90%" }}></RichTextarea>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <RichTextarea id="operate" spellCheck={false} value={operation} onChange={(e) => setOperation(e.target.value)} className={styles.operation} style={{ width: "100%" }} onBlur={() => setCurrentPos(GetCoursol())}>
                                            {(v) => {
                                                return v.split("\n").map((t, i) => (
                                                    <span key={i} style={{ backgroundColor: i === currentRow ? "yellow" : undefined }}>
                                                        {t + "\n"}
                                                    </span>
                                                ));
                                            }}
                                        </RichTextarea>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Grid container justifyContent='center' >
                            <Box sx={{ p: "1%" }} color="secondary">
                                <Button variant="contained" onClick={() => PostALL(operation, registers, memorys)}>
                                    全て実行
                                </Button>
                            </Box>
                            <Box sx={{ p: "1%" }} color="secondary">
                                <Button variant="contained" onClick={() => LineExecution(currentPos)}>
                                    現在の行を実行
                                </Button>
                            </Box>
                            <Box sx={{ p: "1%" }} color="secondary">
                                <Button variant="contained" onClick={() => Clear()}>
                                    テキストクリア
                                </Button>
                            </Box>
                            <Box sx={{ p: "1%" }} color="secondary">
                                <Button variant="contained" onClick={() => Sumple()}>
                                    レジスタクリア
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </main >
    )
}
