import {useNavigate} from "react-router-dom";
import {userType} from "../../types";
import {Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";

function profile(props: userType) {

    const [logout, setLogout] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        function logOut() {
            useEffect(() => {
                fetch("/api/auth/logout", {
                    method: 'POST',
                }).then(resp => {
                    setLogout(false)
                    if (resp.status === 200) {
                        navigate("/login");
                    }
                })
            })
        }

        if (logout) {
            logOut();
        }
    }, [logout])

    return (
        <>
            <Typography variant="h2">Hello {props.nickname} !</Typography>
            <Button variant="contained" onClick={() => {
                setLogout(true)
            }}>
                Logout
            </Button>
        </>
    )
}

export default profile