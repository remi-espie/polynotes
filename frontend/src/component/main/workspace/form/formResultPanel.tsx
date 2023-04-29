import {workspaceType} from "../../../../types";
import React, {useEffect} from "react";
import {ActiveTable} from "active-table-react";
import {useNavigate, useParams} from "react-router-dom";

export default function FormResultPanel(props: {
    workspace: workspaceType,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getWorkspaces: () => void,
}) {
    const navigate = useNavigate();

    const {id} = useParams();

    const [tableContent, setTableContent] = React.useState<any[]>([]);

    const [tableColumns, setTableColums] = React.useState<any[]>([{
        headerName: "test",
        width: 200,
    }]);

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
                        const formAnswer = await resp.json()
                        let table: any[][] = Array(Array(formAnswer.length).fill(""))
                        for (const [index, formAnswerElement] of formAnswer.entries()) {
                            table[0][index] = formAnswerElement._id.name
                            for (const [index2, formAnswerValues] of formAnswerElement.values.entries()) {
                                if (!table[index2 + 1]) table[index2 + 1] = []
                                table[index2 + 1][index + 1] = formAnswerValues ? formAnswerValues : ""
                            }
                        }
                        console.log(table)

                        setTableContent(table)
                        setReloadKey(reloadKey + 1)

                    } else {
                        props.setErrorMessage("Error while getting form:" + resp?.status)
                        props.setOpen(true)
                    }
                });
        }
    }, [id]);


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
                         content={tableContent} customColumnsSettings={tableColumns}/>
        </>
    )
}