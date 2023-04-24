import React from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import FormRow, {formRow} from "./formRow";

export default function FormContent(props: { row: FormRow, editable: boolean, setSendPage: (state: boolean) => void, setPageContent: React.Dispatch<React.SetStateAction<any[]>>, index: number }) {

    // const [debouncedEditor] = useDebounce(editor?.getHTML(), 1000);
    //
    // useEffect(() => {
    //     if (debouncedEditor) {
    //         props.setPageContent((prev) => {
    //             let newContent = prev
    //             newContent[props.index] = editor!.getJSON()
    //             return newContent
    //         })
    //         props.setSendPage(true)
    //     }
    // }, [debouncedEditor]);

    const [pageContent, setPageContent] = React.useState<any>(renderInput(props.row.input!))

    function renderInput(input: formRow) {
        switch (input.type) {
            case "integer":
                return (
                    <TextField
                        label="Integer"
                        defaultValue="0"
                        size="small"
                        disabled={props.editable}
                        type={"number"}
                    />)
            case "text":
                return (
                    <TextField
                        label="Text"
                        defaultValue=""
                        disabled={props.editable}
                        size="small"
                    />)
            case "paragraph":
                return (
                    <TextField
                        label="Paragraph"
                        defaultValue=""
                        multiline
                        disabled={props.editable}
                        size="small"
                    />)
            case "checkbox":
                return (
                    <>
                        <FormGroup>
                            {
                                input.content.map((item: string, index: number) => {
                                    return (
                                        <FormControlLabel key={index}
                                                          control={<Checkbox disabled={props.editable}/>}
                                                          label={<TextField
                                                              label={"Choice"}
                                                              defaultValue={item}
                                                              size="small"
                                                          />}
                                        />)
                                })
                            }
                        </FormGroup>
                        <Button variant="outlined" size="small" onClick={() => {
                            input.content.push("")
                            setPageContent(renderInput(props.row.input!))
                        }}>Add</Button>
                    </>
                )
            case "radio":
                return (
                    <>
                        <FormControl>
                            <RadioGroup>
                                {
                                    input.content.map((item: string, index: number) => {
                                        return (
                                            <FormControlLabel key={index}
                                                              control={<Radio />}
                                                              label={<TextField
                                                                  label={"Choice"}
                                                                  defaultValue={item}
                                                                  size="small"
                                                              />}
                                                              value={index}
                                            />)
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                        <Button variant="outlined" size="small" onClick={() => {
                            input.content.push("")
                            setPageContent(renderInput(props.row.input!))
                        }}>Add</Button>
                    </>
                )
        }
    }


    return (
        <Box sx={{
            width: "30%", display: "flex", flexDirection: "column", margin: "auto", '> * > *': {
                m: 1,
            }
        }}>
            {props.editable ? (
                <>
                    <TextField
                        label="Title"
                        defaultValue=""
                        size="medium"
                    />
                    <TextField
                        label="Description"
                        defaultValue=""
                        size="small"
                    />
                </>) : (
                <>
                    <h6>{props.row.heading.content}</h6>
                    <p>{props.row.description.content}</p>
                </>
            )
            }
            {pageContent}
        </Box>
    );
}