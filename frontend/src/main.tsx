import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import './css/App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Manifesto from "./routes/manifesto";
import ErrorPage from "./routes/error";
import Login from "./routes/login";
import Main from "./component/main/main";

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
    {
        path: "/home",
        element: <Main/>,
    },
    {
        path: "/home/:type/:id",
        element: <Main/>,
    },
    {
        path: "/profile",
        element: <Main/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>,
)