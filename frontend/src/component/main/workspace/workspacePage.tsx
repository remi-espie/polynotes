import {workspaceType} from "../../../types";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Grid} from "@mui/material";
import PageContent from "./pageContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

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
        console.log(pageContent)
        setPageContent((prev) => {
            let newContent = prev
            newContent.splice(index +1, 0, defaultColumn)
            return newContent
        })
        setReloadKey(reloadKey + 1)
        console.log(pageContent)
    }


    return (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, 1fr)" gridAutoColumns="minmax(40%, 1fr)" gridAutoFlow="column" gap={8} sx={{overflowX: "scroll", height: "100%"}} key={reloadKey}>
            {
                pageContent.map((column: any[], index: number) => {
                    return (
                        <Grid item xs={12} md={6} lg={6} key={index} sx={{height: "100%"}}>
                            <Box sx={{width: "99%", height: "100%", overflowY: "scroll"}}>
                                {column.map((row: any, indexRow: number) => {
                                    return (
                                        <Box key={indexRow}
                                             sx={{width: "99%", margin: "auto", display: "flex", flexDirection: "row"}}>
                                            <PageContent row={row}/>
                                            <IconButton aria-label={"add column here"} size={"small"}
                                                        color={"secondary"} sx={{height: 32, width: 32, marginTop: 2}}
                                                        onClick={() => {
                                                            addColumn(index)
                                                        }}>
                                                <AddIcon/>
                                            </IconButton>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </Grid>
                    )
                })
            }
        </Box>
    )
}

