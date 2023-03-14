'use client';
import { Inter } from 'next/font/google'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Grid, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  //ログイン処理（CookieにsignedIn=trueとする）
  const APIlogin = () => {
    Cookies.set("signedIn", "true");
    router.replace("/main");
  }


  return (
    <main>
      <Grid container alignItems='center' justifyContent='center' direction="column" >
        <div style={{ paddingTop: 100, fontSize: 30 }}>
          ログイン
        </div>
        <div style={{ padding: 20 }}>
          <TextField
            id="input-with-icon-textfield"
            label="name"
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </div>
        <div>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </div>
        <div style={{ padding: 30 }}>
          <Button variant="contained" onClick={APIlogin}>Start</Button>
        </div>
        <div style={{ padding: 0 }}>
          <Link href="/signin" style={{ color: 'white' }}>
            <Button variant="contained">SignIn</Button>
          </Link>
        </div>
      </Grid>
    </main>
  )
}
