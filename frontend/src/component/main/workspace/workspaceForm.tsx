import {userType, workspaceType} from "../../../types";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Snackbar,
} from "@mui/material";
import FormEditor from "./form/formEditor";
import FormViewer from "./form/formViewer";


export default function WorkspaceForm(props: {
    workspaces: workspaceType[];
    user: userType;
    getWorkspaces: () => void;
}) {
    const navigate = useNavigate();
    let {id} = useParams();
    let {success} = useParams();
    const [workspace, setWorkspace] = useState<workspaceType | undefined>();

    const [pageContent, setPageContent] = useState<any[]>([]);
    const [editable, setEditable] = useState<boolean>(false);
    const [reloadKey, setReloadKey] = useState<number>(0);


    let fetchWorkspace = false;

    useEffect(() => {
        if (id === undefined) {
            navigate("/home");
        } else {
            const workspaceLocal = props.workspaces.find(
                (workspace: workspaceType) => workspace.id === id
            );
            setWorkspace(workspaceLocal);

            if (workspaceLocal === undefined) fetchWorkspace = true;
            else {
                setPageContent(workspaceLocal.subContent);
                setEditable(
                    (workspaceLocal.owner === props.user.id ||
                        workspaceLocal.writer.includes("anon")) as boolean
                );
                setReloadKey(reloadKey + 1);
            }
        }
    }, [id]);

    useEffect(() => {
        if (workspace === undefined) return;
        setEditable(
            (workspace!.owner === props.user.id ||
                workspace!.writer.includes("anon")) as boolean
        );
        setReloadKey(reloadKey + 1);
    }, [props.user])

    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        function getWorkspace() {
            fetch(`/api/page/${id}`, {
                method: "GET",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
            })
                .catch((err) => {
                    console.error(err);
                })
                .then(async (resp) => {
                    if (resp?.status === 200) {
                        const workspace = await resp.json()
                        setWorkspace(workspace);
                        // subContent = workspace!.subContent;
                        setEditable(
                            (workspace.owner === props.user.id ||
                                workspace.writer.includes("anon")) as boolean
                        );
                        setPageContent(workspace!.subContent);
                    } else {
                        navigate("/login");
                    }
                });
        }

        if (fetchWorkspace) {
            getWorkspace();
            fetchWorkspace = false;
        }
    }, [fetchWorkspace]);


    return (
        <>
            {
                success === "success" ? (
                        <Alert variant="filled" severity="success">
                            <AlertTitle>Page saved !</AlertTitle>
                            Your page has been saved successfully
                        </Alert>
                    ) :

                    props.user.id === workspace?.owner ? (
                        <FormEditor workspace={workspace!} editable={editable} pageContent={pageContent}
                                    setPageContent={setPageContent} reloadKey={reloadKey} setReloadKey={setReloadKey}
                                    id={id!}
                                    setErrorMessage={setErrorMessage} setOpen={setOpen}
                                    getWorkspaces={props.getWorkspaces}/>
                    ) : (
                        <FormViewer workspace={workspace!} pageContent={pageContent} id={id!} setOpen={setOpen}
                                    setErrorMessage={setErrorMessage}/>
                    )}

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert variant="filled" severity="error" onClose={handleClose}>
                    <AlertTitle>Page cannot be saved !</AlertTitle>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    )
}