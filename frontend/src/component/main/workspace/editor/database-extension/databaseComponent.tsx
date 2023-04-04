import {NodeViewWrapper} from "@tiptap/react";
import {ActiveTable} from "active-table-react";
import React, {useEffect, useState} from "react";
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from "@mui/material/IconButton";
import {Box} from "@mui/material";
import Board from "react-trello-ts";
import {BoardData, Card, Lane} from "react-trello-ts/dist/types/Board";

export default (props: { node: { attrs: { content: (string | number)[][] | undefined; type: boolean }; }; }) => {

    const [viewTable, setViewTable] = useState<boolean>(props.node.attrs.type)

    useEffect(() => {
        props.node.attrs.type = viewTable
    }, [viewTable])

    const tableToKanban = (tableContent: (string | number)[][]) => {
        let kabanContent: BoardData = {lanes: [] as Lane[]}

        for (const [indexRow, tableRow] of tableContent[0].entries()) {
            kabanContent.lanes.push({
                id: indexRow.toString(),
                title: tableRow.toString(),
                currentPage: indexRow,
                cards: [] as Card[]
            })
        }

        for (const [indexRow, tableRow] of tableContent.entries()) {
            for (const [indexElement, tableElement] of tableRow.entries()) {
                if (indexRow !== 0) {
                    kabanContent.lanes[indexElement].cards!.push({
                        id: "Card1"+indexRow.toString()+indexElement.toString(),
                        title: tableElement.toString(),
                    })
                    kabanContent.lanes[indexElement].cards!.push({
                        id: "Card2"+indexRow.toString()+indexElement.toString(),
                        title: tableElement.toString()
                    })
                }
            }
        }

        return kabanContent
    }


    // const kanbanToTable = (kanbanContent: BoardData) => {
    //     let tableContent: (string | number)[][] = []
    //     for (const [indexColumn, kanbanColumn] of kanbanContent.lanes.entries()) {
    //         for (const [indexCard, kanbanCard] of kanbanColumn.cards!.entries()) {
    //             if (indexCard === 0) {
    //                 tableContent.push([kanbanColumn.title!])
    //             } else {
    //                 // tableContent[indexCard].push(kanbanCard.title!)
    //             }
    //         }
    //     }
    //     return tableContent
    // }


    let tableContent = props.node.attrs.content

    let kanbanContent = tableToKanban(tableContent!)

    return (
        <NodeViewWrapper className="database-extension">
            <Box display='flex'>
                <IconButton
                    aria-label={"Change view type"}
                    size={"small"}
                    color={"primary"}
                    sx={{
                        height: 32,
                        width: 32,
                    }}
                    onClick={() => {
                        // if (!viewTable) {
                        //     tableContent = kanbanToTable(kanbanContent)
                        //     console.log(JSON.stringify(tableContent))
                        // } else {
                        //     kanbanContent = tableToKanban(tableContent!)
                        // }
                        setViewTable(!viewTable)
                    }}
                >
                    <CachedIcon/>
                </IconButton>
                {viewTable ?
                    <ActiveTable contentEditable={true} content={tableContent}/>
                    :
                    <Board data={kanbanContent}
                           draggable
                           canAddLanes
                           editable
                           editLaneTitle
                           laneDraggable
                           cardDraggable

                    />
                }
            </Box>
        </NodeViewWrapper>
    )
}