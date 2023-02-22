import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Manifesto from "./routes/manifesto";
import ErrorPage from "./routes/error";
import Login from "./routes/login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Manifesto/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/login",
        element: <Login/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>,
)
