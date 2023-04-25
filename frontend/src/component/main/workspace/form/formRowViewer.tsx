import React from "react";
import {
    Box,
    Checkbox, Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import FormRow, {formRow} from "./formRow";

export default function FormRowViewer(props: {
    row: FormRow,
    setAnswer: React.Dispatch<React.SetStateAction<any>>,
    index: number
}) {

    function updateAnswer(value: any) {
        props.setAnswer((prev: any) => {
            let newAnswer = prev
            newAnswer[props.index] = value
            return newAnswer
        })
    }

    function renderInput(input: formRow) {
        switch (input.type) {
            case "integer":
                return (
                    <TextField
                        label="Integer"
                        size="small"
                        type={"number"}
                        onChange={(event) => {
                            updateAnswer(parseInt(event.target.value))
                        }}
                    />)
            case "text":
                return (
                    <TextField
                        label="Text"
                        defaultValue=""
                        size="small"
                        onChange={(event) => {
                            updateAnswer(event.target.value)
                        }}
                    />)
            case "paragraph":
                return (
                    <TextField
                        label="Paragraph"
                        defaultValue=""
                        multiline
                        size="small"
                        onChange={(event) => {
                            updateAnswer(event.target.value)
                        }}
                    />)
            case "checkbox":
                return (
                    <>
                        <FormGroup>
                            {
                                input.content.map((item: string, index: number) => {
                                    return (
                                        <FormControlLabel key={index}
                                                          control={<Checkbox
                                                              onChange={() => {
                                                                  updateAnswer(index)
                                                              }}/>}
                                                          label={item}
                                        />)
                                })
                            }
                        </FormGroup>
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
                                                              control={<Radio
                                                                  onChange={() => {
                                                                      updateAnswer(index)
                                                                  }}/>}
                                                              label={item}
                                                              value={index}
                                            />)
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
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
            <Divider/>
            <h3>{props.row.heading.content}</h3>
            <p>{props.row.description.content}</p>
            {renderInput(props.row.input!)}
        </Box>
    );
}