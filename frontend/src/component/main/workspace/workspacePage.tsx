import {workspaceType} from "../../../types";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Button, Grid} from "@mui/material";
import PageContent from "./pageContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';


export default function WorkspacePage(props: { workspaces: workspaceType[] }) {

    const navigate = useNavigate();
    let {id} = useParams();
    let workspace: workspaceType | undefined;

    const [pageContent, setPageContent] = useState<any[]>([])
    const [reloadKey, setReloadKey] = useState<number>(0)

    let subContent: any[] = [];
    let changeContent = false;


    if (id === undefined) {
        navigate("/home");
    } else {
        workspace = props.workspaces.find(
            (workspace: workspaceType) => workspace._id === id
        )

        if (workspace === undefined) navigate("/home");
        else {
            subContent = JSON.parse(workspace.subContent)
            changeContent = true
        }

    }

    useEffect(() => {
        function changeContentState() {
            setPageContent(subContent)
        }

        if (changeContent) {
            changeContentState()
            changeContent = false
        }
    }, [changeContent])


    const defaultColumn = [
        {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Write your story !',
                        },
                    ],
                },
            ],
        },
    ];

    function addColumn(index: number) {
        setPageContent((prev) => {
            let newContent = prev
            newContent.splice(index + 1, 0, defaultColumn)
            return newContent
        })
        setReloadKey(reloadKey + 1)
    }

    function addRow(indexColumn: number) {
        setPageContent((prev) => {
            let newContent = prev
            newContent[indexColumn].push(defaultColumn[0])
            return newContent
        })
        setReloadKey(reloadKey + 1)
        console.log(pageContent[indexColumn])
    }

    function deleteRow(indexCol:number, indexRow:number) {
        setPageContent((prev) => {
            let newContent = prev
            newContent[indexCol].splice(indexRow, 1)
            if (newContent[indexCol].length === 0) newContent.splice(indexCol, 1)
            return newContent
        })
        setReloadKey(reloadKey + 1)
    }


    return (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, 1fr)" gridAutoColumns="minmax(40%, 1fr)"
             gridAutoFlow="column" gap={8} sx={{overflowX: "scroll", height: "100%"}} key={reloadKey}>
            {
                pageContent.map((column: any[], indexCol: number) => {
                    return (
                        <Grid item xs={12} md={6} lg={6} key={indexCol}>
                            <Box display="flex" flexDirection="row" sx={{width: "99%", overflowY: "scroll"}}>
                                <Box sx={{width: "100%"}}>
                                    {column.map((row: any, indexRow: number) => {
                                        return (
                                            <Box display="flex" flexDirection="row" sx={{width: "99%", margin: "auto"}}>
                                                <PageContent row={row}/>

                                                <IconButton aria-label={"Delete row"} size={"small"}
                                                            color={"error"} sx={{height: 32, width: 32, marginTop: 2}}
                                                            onClick={() => {
                                                                deleteRow(indexCol, indexRow)
                                                            }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )
                                    })}
                                </Box>
                                <IconButton aria-label={"add column here"} size={"small"}
                                            color={"secondary"} sx={{height: 32, width: 32, marginTop: 2}}
                                            onClick={() => {
                                                addColumn(indexCol)
                                            }}>
                                    <AddIcon/>
                                </IconButton>
                            </Box>
                            <Button aria-label={"add row here"} size={"large"} color={"secondary"} variant="contained"
                                    sx={{width: "80%"}} onClick={() => {
                                addRow(indexCol)
                            }
                            }>
                                <AddIcon/>
                            </Button>
                        </Grid>
                    )
                })
            }
        </Box>
    )
}

