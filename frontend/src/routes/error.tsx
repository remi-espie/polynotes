import { useRouteError } from "react-router-dom";
import {Box} from "@mui/material";

export default function ErrorPage() {
    const error : any = useRouteError();

    return (
        <Box id="error-page" className="App">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i> {error.status || error.statusCode} {error.statusText || error.message}</i>
            </p>
        </Box>
    );
}
