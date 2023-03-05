import {useNavigate} from "react-router-dom";
import {userType} from "../../types";
import {Button, Typography} from "@mui/material";

function profile(props: userType) {

    const navigate = useNavigate();

    const logout = () => {
        fetch("/api/auth/logout", {
            method: 'POST',
        }).then(resp => {
            if (resp.status === 200) {
                navigate("/login");
            }
        })
    }

    return (
        <>
            <Typography variant="h2">Hello {props.nickname} !</Typography>
            <Button variant="contained" onClick={() => {
                logout();
            }}>
                Logout
            </Button>
        </>
    )
}

export default profile