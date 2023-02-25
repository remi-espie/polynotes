import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Header from "./header";
import {Alert, Box, Collapse} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

function Home() {

    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    // login();

    return (
        <Box className="App">
            <Header/>
            <Collapse in={!validated} sx={{width:"100%", position:"absolute", top:"4em"}}>
                <Alert severity={"error"} variant="filled"
                       action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setValidated(true);
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
    )

    async function login() {
        fetch('/api/login')
            .then(resp => {
                if (resp.status !== 200) {
                    navigate("/login");
                } else {
                    resp.json().then(json => {
                        if (!json.user.validated) {
                            setValidated(false);
                        }
                    })
                }
            })
    }
}

export default Home;