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
            newAnswer[props.index] = {name: props.row.heading.content, content: value}
            console.log(newAnswer)
            return newAnswer
        })
    }

    function updateAnswerCheckbox(value: number | string) {
        props.setAnswer((prev: any) => {
            let newAnswer = prev
            if (newAnswer[props.index] === undefined) newAnswer[props.index] = {
                name: props.row.heading.content,
                content: []
            }
            if (typeof value === "string") {
                for (const newAnswerElement of newAnswer[props.index].content) {
                    if (typeof newAnswerElement === "string") {
                        newAnswer[props.index].content.splice(newAnswer[props.index].content.indexOf(newAnswerElement), 1)
                    }
                }
                newAnswer[props.index].content.push(value)
            } else {
                if (prev[props.index].content.includes(value)) {
                    newAnswer[props.index].content.splice(newAnswer[props.index].content.indexOf(value), 1)
                } else newAnswer[props.index].content.push(value)
            }
            console.log(newAnswer)
            return newAnswer
        })
    }

    const customCheckboxInputRef = React.useRef<HTMLInputElement>(null);
    const [customCheckboxChecked, setCustomCheckboxChecked] = React.useState(false);

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
                        inputProps={{maxLength: 256}}
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
                                                                  updateAnswerCheckbox(index)
                                                              }}/>}
                                                          label={item}
                                        />)
                                })
                            }
                            <FormControlLabel key={input.content.length}
                                              control={<Checkbox
                                                  onChange={(value) => {
                                                      if (value.target.checked) {
                                                          setCustomCheckboxChecked(true)
                                                          updateAnswerCheckbox(customCheckboxInputRef.current!.value)
                                                      } else {
                                                          setCustomCheckboxChecked(false)
                                                          updateAnswerCheckbox("")
                                                      }
                                                  }}/>}
                                              label={<TextField
                                                  inputRef={customCheckboxInputRef}
                                                  label={"Custom value"}
                                                  defaultValue={""}
                                                  inputProps={{maxLength: 256}}
                                                  onChange={(event) => {
                                                      updateAnswerCheckbox(event.target.value)
                                                  }}
                                                  disabled={!customCheckboxChecked}
                                                  size="small"/>}
                            />
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