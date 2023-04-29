import React, {useEffect} from "react";
import {ActiveTable} from "active-table-react";
import {useNavigate, useParams} from "react-router-dom";
import HorizontalBar from "./resultDiagrams/horizontalBar";
import PieChart from "./resultDiagrams/pieChart";
import {Box} from "@mui/material";

export default function FormResultPanel(props: {
    pageContent: any[],
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getWorkspaces: () => void,
}) {
    const navigate = useNavigate();

    const {id} = useParams();

    const [formAnswer, setFormAnswer] = React.useState<any[]>([]);

    const [tableContent, setTableContent] = React.useState<any[]>([]);

    const [reloadKey, setReloadKey] = React.useState(0);

    useEffect(() => {
        if (id === undefined) {
            navigate("/home");
        } else {
            fetch(`/api/form/${id}`, {
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
                        const localFormAnswer = await resp.json()
                        // console.log(formAnswer)
                        let table: any[][] = [[]]
                        for (const [index, formAnswerElement] of localFormAnswer.entries()) {
                            if (!table[0][index]) table[0][index] = []
                            table[0][index] = formAnswerElement._id.name

                            // if (!table[index+1]) table[index+1] = []
                            // table[index+1][0] = formAnswerElement.users

                            for (const [index2, formAnswerValues] of formAnswerElement.values.entries()) {
                                if (!table[index2 + 1]) table[index2 + 1] = []
                                table[index2 + 1][index] = translateAnswer(formAnswerElement._id.name, formAnswerValues)

                            }
                        }
                        // console.log(table)

                        setTableContent(table)
                        setFormAnswer(localFormAnswer)
                        setReloadKey(reloadKey + 1)

                    } else {
                        props.setErrorMessage("Error while getting form:" + resp?.status)
                        props.setOpen(true)
                    }
                });
        }
    }, [id]);

    function translateAnswer(answerId: string, answerNumber: any) {
        for (const formRow of props.pageContent) {
            if (formRow.heading.content === answerId) {
                if (formRow.input.type === "text" || formRow.input.type === "integer" || formRow.input.type === "paragraph") return answerNumber
                if (formRow.input.type === "radio") return formRow.input.content[answerNumber]
                if (formRow.input.type === "checkbox") return answerNumber.map((value: string | number) => {
                    if (typeof value === "string") return value
                    return formRow.input.content[value]
                })
            }
        }
        return ""
    }

    const displayFormRow = (formRow: any) => {
        switch (formRow.input.type) {
            case "text":
            case "paragraph":
            case "integer":
            default:
                return
            case "radio":
                const valuesRadio = formRow.input.content.map((value: string, index: number) => {
                    return formAnswer.find((answer) => answer._id.name === formRow.heading.content)?.values.filter((answerValue: any) => answerValue === index).length
                })
                return <Box sx={{width:'40%'}}> <HorizontalBar key={formRow.heading.content} title={formRow.heading.content}
                                         label={formRow.input.content} values={valuesRadio}/>
                </Box>
            case "checkbox":
                const valuesCheckbox = formRow.input.content.map((value: string, index: number) => {
                    return formAnswer.find((answer) => answer._id.name === formRow.heading.content)?.values.filter((answerValue: any) => answerValue.includes(index)).length
                })
                return <Box sx={{width:'40%'}}> <PieChart key={formRow.heading.content} title={formRow.heading.content}
                                    label={formRow.input.content} values={valuesCheckbox}/>
                </Box>
        }
    }


    return (
        <>
            <ActiveTable key={reloadKey} displayAddNewColumn={false} displayAddNewRow={false} isCellTextEditable={false}
                         rowDropdown={{
                             displaySettings: {isAvailable: false},
                         }}
                         columnDropdown={{
                             displaySettings: {
                                 isAvailable: true,
                                 openMethod: {
                                     overlayClick: false,
                                     cellClick: true
                                 }
                             },
                             isSortAvailable: true,
                             isDeleteAvailable: false,
                             isInsertLeftAvailable: false,
                             isInsertRightAvailable: false,
                             isMoveAvailable: true,
                         }}
                         content={tableContent}/>


            <Box sx={{
                width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', m:2
            }}>
                {props.pageContent.map((formRow) => {
                    return displayFormRow(formRow)
                })}
            </Box>
        </>
    )
}