import {
    Box,
    Tab,
    Tabs,
} from "@mui/material";
import React from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {workspaceType} from "../../../../types";
import FormEditorPanel from "./formEditorPanel";
import FormResultPanel from "./formResultPanel";
import {useNavigate, useParams} from "react-router-dom";

export default function FormOwnerView(props: {
    workspace: workspaceType,
    editable: boolean,
    pageContent: any[],
    setPageContent: React.Dispatch<React.SetStateAction<any[]>>,
    id: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getWorkspaces: () => void,
}) {

    const navigate = useNavigate();

    const {tab} = useParams();
    const {id} = useParams();

    const [tabValue, setTabValue] = React.useState(tab || "editor");

    return (
        <TabContext value={tabValue.toString()}>
            <Box>
                <Tabs value={tabValue}
                      onChange={(event: React.SyntheticEvent, newValue: string) => {
                          navigate("/home/form/" + id + "/" + newValue)
                          setTabValue(newValue)
                      }}
                      variant="fullWidth"
                >
                    <Tab label="Editor" value={"editor"}/>
                    <Tab label="Results" value={"result"}/>
                </Tabs>
                <TabPanel value={"editor"}>
                    <FormEditorPanel workspace={props.workspace} pageContent={props.pageContent}
                                     setPageContent={props.setPageContent} editable={props.editable}
                                     setErrorMessage={props.setErrorMessage} setOpen={props.setOpen}
                                     getWorkspaces={props.getWorkspaces}/>
                </TabPanel>
                <TabPanel value={"result"}>
                    <FormResultPanel workspace={props.workspace}
                                     setErrorMessage={props.setErrorMessage} setOpen={props.setOpen}
                                     getWorkspaces={props.getWorkspaces}/>
                </TabPanel>
            </Box>
        </TabContext>
    );
}