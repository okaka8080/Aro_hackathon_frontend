"use client"
import styles from "./css/terminal.module.css"
import { Terminalfunc } from "./Terminalfunc"
import { useEffect, useState } from "react"
import { Box, Grid, Button } from "@mui/material"

export const Codebox = () => {
    const [operation, setOperation] = useState<string>('');
    const [rip, setRip] = useState<string>('');
    const [ripList, setRipList] = useState<string[]>([]);

    function Clear(){
        setOperation("");
        setRip("");
    }

    function InputByte(operation: string) {
        var newOpereteList = operation.split(/\n/);
        var byteList: string[] = [];
        var bytes = "";
        for (let i: number = 0; i < newOpereteList.length; i++) {
            if(newOpereteList[i] == ""){
                bytes = bytes + "\n";
            } else {
            bytes = bytes + "undifined\n";
            }
        }
        setRip(bytes);
        return byteList;
    }

    const changeInput = () => {
        InputByte(operation)
    };

    const setScroll = () =>{
        document.getElementById("bytes")?.scrollTo({top:document.getElementById("operate")?.scrollTop});
    }

    useEffect(() => {
        document.getElementById("operate")?.addEventListener('scroll', setScroll)
        return () => document.getElementById("operate")?.removeEventListener('scroll', setScroll)
    })
    useEffect(() => {
        changeInput();
    })


    const defaultProps = {
        bgcolor: '#72777B',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '60%', height: '18rem' },
    };
    const RegisterProps = {
        bgcolor: '#f5f5dc',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        style: { width: '60%', height: '12rem' },
    };

    return (
        <main>
            <div className={styles.main}>
                <Box display="flex" justifyContent="center" sx={{ p: 3 }}>
                    <Box borderRadius={2} {...RegisterProps} >
                        レジスタ状況
                    </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                    <Box borderRadius={2} {...defaultProps} >
                        <div className={styles.editortop}>
                            アセンブリエディタ
                        </div>
                        <div className={styles.area}>
                            <textarea id="bytes" spellCheck={false} value={rip} className={styles.byte} onChange={(e) => console.log("chaged")}></textarea>
                            <textarea id="operate"  spellCheck={false} value={operation} onChange={(e) => setOperation(e.target.value)} className={styles.operation}></textarea>
                        </div>
                    </Box>
                </Box>
                <Grid container justifyContent='center' >
                    <Box sx={{ p: 2 }}>
                        <Button variant="outlined" onClick={() => Terminalfunc(operation)}>
                            同時出力
                        </Button>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Button variant="outlined" onClick={() => Terminalfunc(operation)}>
                            一行ずつ出力
                        </Button>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Button variant="outlined" onClick={() => Clear()}>
                            クリア
                        </Button>
                    </Box>
                </Grid>
            </div>
        </main>
    )
}
