'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styles from "./css/header.module.css";
import Box from '@mui/material/Box';

export const Header = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <div className={styles.Header}>
                            WAZM
                        </div>
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}