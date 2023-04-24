import {
    Box,
} from "@mui/material";
import FormRow from "./formRow";
import React, {useEffect, useState} from "react";
import FormContentViewer from "./formContentViewer";
import SendIcon from '@mui/icons-material/Send';
import {LoadingButton} from "@mui/lab";

export default function FormViewer(props: {
    id: string,
    pageContent: any[],
}) {
    const [sendPage, setSendPage] = useState<boolean>(false);
    const [answer, setAnswer] = useState<any>({});
    const [loadingForm, setLoadingForm] = useState<boolean>(false);

    useEffect(() => {
        if (sendPage){
            setLoadingForm(true)
            console.log(answer)
            fetch(`/api/page/${props.id}`, {
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
                    console.log(resp)
                });
        }
    }, [sendPage]);

    return (
        <>
            <h1>{props.pageContent[0]}</h1>
            {props.pageContent.slice(1).map((row: FormRow, indexRow: number) => {
                return (
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{width: "99%"}}
                        key={indexRow+1}
                    >

                        <Box
                            sx={{width: "99%", margin: "auto"}}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <FormContentViewer
                                row={row}
                                setAnswer={setAnswer}
                                index={indexRow+1}
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