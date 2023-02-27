import logo from '../assets/logo.png';
import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {Link} from "react-router-dom";
import {useState} from "react";
import {Alert, Collapse} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {user} from "../types";

function Header(props:user) {

    const [open, setOpen] = useState(props.validated);

    const Search = styled('div')(({theme}) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({theme}) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({theme}) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));


    return (
        <Box sx={{top:0, width:"100%", position:"absolute"}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton>
                        <Link to={"/home"}>
                        <img src={logo} alt="logo" width={40} height={40}/>
                        </Link>
                    </IconButton>

                    <Box sx={{flexGrow: 1}}/>
                    <Search sx={{flexGrow: 20}}>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <Box sx={{flexGrow: 1}}/>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <Link to={"/profile"}>
                            <AccountCircle sx={{color:"white"}}/>
                            </Link>
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>
            <Collapse in={!open} sx={{width:"100%", position:"absolute", top:"4em"}}>
                <Alert severity={"error"} variant="filled"
                       action={
                           <IconButton
                               aria-label="close"
                               color="inherit"
                               size="small"
                               onClick={() => {
                                   setOpen(true);
                               }}
                           >
                               <CloseIcon fontSize="inherit"/>
                           </IconButton>
                       }
                >
                    Your account is not validated yet, please check your email !
                </Alert>
            </Collapse>
        </Box>
    );
}


export default Header;