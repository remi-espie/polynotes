import {NodeViewWrapper} from "@tiptap/react";
import {ActiveTable} from "active-table-react";
import React, {useEffect, useState} from "react";
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from "@mui/material/IconButton";
import {Box} from "@mui/material";
import Board from "react-trello-ts";
import {BoardData, Card, Lane} from "react-trello-ts/dist/types/Board";
import {CustomColumnsSettings} from "active-table/dist/types/columnsSettings";

export default (props: { node: { attrs: { content: (string | number)[][] | undefined; header: CustomColumnsSettings; type: boolean }; }; }) => {

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
                cards: [] as Card[],
                label: tableColumns[indexRow].defaultColumnTypeName,
            })
        }

        for (const [indexRow, tableRow] of tableContent.entries()) {
            for (const [indexElement, tableElement] of tableRow.entries()) {
                if (indexRow !== 0) {
                    kabanContent.lanes[indexElement].cards!.push({
                        id: "Card" + indexRow.toString() + indexElement.toString(),
                        title: tableElement.toString(),
                    })
                }
            }
        }

        return kabanContent
    }


    const kanbanToTable = (kanbanContent: BoardData) => {
        let tableContent: (string | number)[][] = [[]]
        props.node.attrs.header = []

        for (const [, kanbanColumn] of kanbanContent.lanes.entries()) {
            tableContent[0].push(kanbanColumn.title!)
            props.node.attrs.header.push({headerName: kanbanColumn.title!, defaultColumnTypeName: kanbanColumn.label!})
        }

        for (const [, kanbanColumn] of kanbanContent.lanes.entries()) {
            for (const [indexCard, kanbanCard] of kanbanColumn.cards!.entries()) {
                if (tableContent[indexCard +1] === undefined) tableContent[indexCard +1] = []
                tableContent[indexCard +1].push(kanbanCard.title!)
            }
        }


        return tableContent
    }


    let tableContent = props.node.attrs.content
    let tableColumns = props.node.attrs.header
    let kanbanContent = tableToKanban(tableContent!);


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
                        if (!viewTable) {
                            props.node.attrs.content = kanbanToTable(kanbanContent)
                        }
                        setViewTable(!viewTable)
                    }}
                >
                    <CachedIcon/>
                </IconButton>
                {viewTable ?
                    <ActiveTable contentEditable={true} content={tableContent} customColumnsSettings={tableColumns}
                                 onColumnsUpdate={(e) => {
                                     props.node.attrs.header = []
                                     for (const columnUpdateDetail of e) {
                                         props.node.attrs.header.push({
                                             headerName: "",
                                             defaultColumnTypeName: columnUpdateDetail.typeName
                                         })
                                     }

                                 }}
                    />
                    :
                    <Board data={kanbanContent}
                           draggable
                           canAddLanes
                           editable
                           editLaneTitle
                           cardDraggable
                           laneDraggable
                           onCardUpdate={(cardId, card,) => {
                               console.log("coucou")
                               const lane = kanbanContent.lanes.find((value) => value.id === card.laneId)
                               const cardIndex = lane!.cards!.findIndex((value) => value.id === cardId)
                               lane!.cards!.splice(cardIndex, 1, card,)
                           }}
                           onCardAdd={(card, laneId) => {
                               kanbanContent.lanes.find((value) => value.id === laneId)!.cards!.push(card)
                           }}
                           onCardDelete={(cardId, laneId) => {
                               const lane = kanbanContent.lanes.find((value) => value.id === laneId)
                               const cardIndex = lane!.cards!.findIndex((value) => value.id === cardId)
                               lane!.cards!.splice(cardIndex, 1)
                           }}
                           onLaneAdd={(lane) => {
                               kanbanContent.lanes.push({id: lane.laneId, title: lane.title, cards: []})
                           }}
                    />
                }
            </Box>
        </NodeViewWrapper>
    )
}