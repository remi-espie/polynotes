import '../css/App.css'
import {Link} from "react-router-dom";
import {Box} from "@mui/material";

function Manifesto() {

    return (
        <Box className="App" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>

            <Box sx={{
                width: 500,
                height: 200,
                textAlign: "justify"
            }}>
                <h2>
                    📓 Polynotes is a Notion-like tool made to help students taking notes and linking them to different
                    data, with an emphasis on project management !
                </h2>
            </Box>

            <Link to='/login'>
                <button>
                    Start !
                </button>
            </Link>

        </Box>
    )
}

export default Manifesto
