import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error : any = useRouteError();

    return (
        <div id="error-page" className="App">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i> {error.status || error.statusCode} {error.statusText || error.message}</i>
            </p>
        </div>
    );
}
