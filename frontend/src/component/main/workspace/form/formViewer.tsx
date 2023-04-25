import {
    Box,
} from "@mui/material";
import FormRow from "./formRow";
import React, {useEffect, useState} from "react";
import FormRowViewer from "./formRowViewer";
import SendIcon from '@mui/icons-material/Send';
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router-dom";
import {workspaceType} from "../../../../types";

export default function FormViewer(props: {
    id: string,
    workspace: workspaceType,
    pageContent: any[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}) {
    const [sendPage, setSendPage] = useState<boolean>(false);
    const [answer, setAnswer] = useState<any>({});
    const [loadingForm, setLoadingForm] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (sendPage) {
            setLoadingForm(true)
            fetch(`/api/form/${props.id}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(answer)
            })
                .catch((err) => {
                    console.error(err);
                })
                .then(async (resp) => {
                    setLoadingForm(false)
                    if (resp?.status === 200) {
                        navigate(`/home/form/${props.id}/success`)
                    } else {
                        props.setErrorMessage("Error while sending form:" + resp?.status)
                        props.setOpen(true)
                    }
                });
        }
    }, [sendPage]);

    return (
        <>
            <h1>{props.workspace.name}</h1>
            {props.pageContent.map((row: FormRow, indexRow: number) => {
                return (
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{width: "99%"}}
                        key={indexRow}
                    >

                        <Box
                            sx={{width: "99%", margin: "auto"}}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <FormRowViewer
                                row={row}
                                setAnswer={setAnswer}
                                index={indexRow}
                            />


                        </Box>
                    </Box>
                );
            })}
            <LoadingButton
                type={"submit"}
                loading={loadingForm}
                aria-label={"Send form"}
                size={"large"}
                color={"secondary"}
                variant="contained"
                sx={{width: "20%", margin: "auto"}}
                onClick={() => {
                    setSendPage(true)
                }}
                endIcon={<SendIcon/>}
            >
                Add
            </LoadingButton>
        </>
    );
}