'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import styles from "./css/header.module.css";
import Box from '@mui/material/Box';
import { Menu, MenuItem, Tooltip } from '@mui/material';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export const Header = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState<boolean>();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const logout = () => {
        Cookies.remove("signedIn");
        router.replace("/login");
    }
    useEffect(() => {
        if (Cookies.get("signedIn") == "true") {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    });

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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