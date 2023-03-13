import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Folder } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate, useParams } from "react-router-dom";
import { workspaceType } from "../../../types";
import { Buffer } from "buffer";

export default function WorkspaceFile(props: { workspaces: workspaceType[] }) {
  const navigate = useNavigate();
  let { id } = useParams();
  let workspaces: workspaceType[];

  if (id === undefined) {
    workspaces = props.workspaces.filter(
      (workspace: workspaceType) => workspace.parentId === null
    );
  } else {
    if (
      props.workspaces.find(
        (workspace: workspaceType) => workspace._id === id
      ) === undefined
    ) {
      navigate("/home");
    }
    workspaces = props.workspaces.filter(
      (workspace: workspaceType) => workspace.parentId === id
    );
  }

  function workspaceSize(workspace: workspaceType): string {
    const size = Buffer.byteLength(JSON.stringify(workspace), "utf8");
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (size >= gb) {
      return `${(size / gb).toFixed(2)} Gb`;
    } else if (size >= mb) {
      return `${(size / mb).toFixed(2)} Mb`;
    } else if (size >= kb) {
      return `${(size / kb).toFixed(2)} Kb`;
    } else {
      return `${size} bytes`;
    }
  }

  return (
    <TableContainer component={Paper} sx={{ height: "calc(100% - 200px);" }}>
      <Table sx={{ minWidth: 650 }} aria-label="Files table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Last modification</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workspaces.map((workspace: workspaceType) => (
            <TableRow
              key={workspace._id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
              onClick={() => {
                if (workspace.type === "folder") {
                  navigate(`/home/folder/${workspace._id}`);
                } else {
                  navigate(`/home/page/${workspace._id}`);
                }
              }}
            >
              <TableCell sx={{ display: "flex", alignItems: "center" }}>
                {workspace.type === "folder" ? <Folder /> : <DescriptionIcon />}
                {workspace.name}
              </TableCell>
              <TableCell>{workspace.owner}</TableCell>
              <TableCell>
                {workspace.type === "folder" ? JSON.parse(workspace.subContent).length + " files | " : null }
                {workspaceSize(workspace)}
              </TableCell>
              <TableCell>
                {new Date(workspace.modified).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}