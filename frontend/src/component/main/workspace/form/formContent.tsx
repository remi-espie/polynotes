import React, {useEffect} from "react";
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
import {useDebounce} from "use-debounce";

export default function FormContent(props: {
    row: FormRow,
    editable: boolean,
    sendPage: boolean,
    setSendPage: (state: boolean) => void,
    setPageContent: React.Dispatch<React.SetStateAction<any[]>>,
    index: number
}) {

    const [rowContent, setRowContent] = React.useState<any>(renderInput(props.row.input!))

    const [debouncedEditor] = useDebounce(rowContent, 1000);

    useEffect(() => {
        if (debouncedEditor) {
            props.setPageContent((prev) => {
                let newContent = prev
                newContent[props.index] = props.row
                return newContent
            })
            props.setSendPage(true)
        }
    }, [debouncedEditor]);

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
                                                              onChange={(event) => {
                                                                  input.content[index] = event.target.value
                                                                  setRowContent(renderInput(props.row.input!))
                                                              }}
                                                          />}
                                        />)
                                })
                            }
                        </FormGroup>
                        <Button variant="outlined" size="small" onClick={() => {
                            props.row.input!.content.push("")
                            setRowContent(renderInput(props.row.input!))
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
                                                              control={<Radio disabled={props.editable}/>}
                                                              label={<TextField
                                                                  label={"Choice"}
                                                                  defaultValue={item}
                                                                  size="small"
                                                                  onChange={(event) => {
                                                                      input.content[index] = event.target.value
                                                                      setRowContent(renderInput(props.row.input!))
                                                                  }}
                                                              />}
                                                              value={index}
                                            />)
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                        <Button variant="outlined" size="small" onClick={() => {
                            props.row.input!.content.push("")
                            setRowContent(renderInput(props.row.input!))
                        }}>Add</Button>
                    </>
                )
        }
    }


    return (
        <Box sx={{
            width: "30%", display: "flex", flexDirection: "column", margin: "auto", marginBottom: 1, '> * > *': {
                m: 1,
            }
        }}>
            <TextField
                label="Title"
                defaultValue={props.row.heading.content}
                size="medium"
                onChange={(event) => {
                    props.row.heading.content = event.target.value
                    setRowContent(renderInput(props.row.input!))
                }}
            />
            <TextField
                label="Description"
                defaultValue={props.row.description.content}
                size="small"
                onChange={(event) => {
                    props.row.description.content = event.target.value
                    setRowContent(renderInput(props.row.input!))
                }}
            />
            {rowContent}
        </Box>
    );
}