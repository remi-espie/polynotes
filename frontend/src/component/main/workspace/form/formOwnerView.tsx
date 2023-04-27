import {
    Box,
    Tab,
    Tabs,
} from "@mui/material";
import React from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {workspaceType} from "../../../../types";
import FormEditorPanel from "./formEditorPanel";

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

    const [tabValue, setTabValue] = React.useState("Form");

    return (
        <TabContext value={tabValue.toString()}>
            <Box>
                <Tabs value={tabValue}
                      onChange={(event: React.SyntheticEvent, newValue: string) => {
                          setTabValue(newValue);
                      }}
                      variant="fullWidth"
                >
                    <Tab label="Form" value={"Form"}/>
                    <Tab label="Results" value={"Result"}/>
                </Tabs>
                <TabPanel value={"Form"}>

                    <FormEditorPanel workspace={props.workspace} pageContent={props.pageContent} setPageContent={props.setPageContent} editable={props.editable}
                                     id={props.id} setErrorMessage={props.setErrorMessage} setOpen={props.setOpen} getWorkspaces={props.getWorkspaces}/>

                </TabPanel>
                <TabPanel value={"Result"}>
                    <Box>
                        Test
                    </Box>
                </TabPanel>
            </Box>
        </TabContext>
    );
}