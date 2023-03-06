import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Folder} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import {useNavigate, useParams} from "react-router-dom";
import {workspaceType} from "../../../types";

export default function WorkspaceFile(props: { workspaces: [] }) {

    const navigate = useNavigate()
    let {id} = useParams();
    let workspaces: workspaceType[]

    if (id === undefined) {
        workspaces = props.workspaces.filter((workspace: workspaceType) => workspace.parentId === null)
    } else {
        if (props.workspaces.find((workspace: workspaceType) => workspace._id === id) === undefined) {
            navigate("/home")
        }
        workspaces = props.workspaces.filter((workspace: workspaceType) => workspace.parentId === id)
    }


    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Last modification</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {workspaces.map((workspace: workspaceType) => (
                        <TableRow
                            key={workspace._id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}, cursor: "pointer"}}
                            onClick={() => {
                                if (workspace.type === "folder") {
                                    navigate(`/home/folder/${workspace._id}`)
                                } else {
                                    navigate(`/home/page/${workspace._id}`)
                                }
                            }}
                        >
                            <TableCell sx={{display: "flex", alignItems: "center"}}>
                                {workspace.type === "folder" ? <Folder/> : <DescriptionIcon/>}
                                {workspace.name}
                            </TableCell>
                            <TableCell>{workspace.owner}</TableCell>
                            <TableCell>{new Date(workspace.modified).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}