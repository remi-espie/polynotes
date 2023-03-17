import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Logo from "../assets/logo.png";

function Manifesto() {
  return (
    <Box
      className="App"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 500,
          height: 500,
          textAlign: "justify",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: 300,
            width: 300,
          }}
          component={"img"}
          src={Logo}
        />

        <h2>
          📓 Polynotes is a Notion-like tool made to helps students to take
          notes and link them to different data, with an emphasis on project
          management !
        </h2>
      </Box>

      <Link to="/login">
        <button>Start !</button>
      </Link>
    </Box>
  );
}

export default Manifesto