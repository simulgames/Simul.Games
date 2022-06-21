import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import './Main-tab.scss'
import IconButton from "@mui/material/Button";
import {Link} from "react-router-dom";

export const Lobbies = () => {
    return <Paper className="main-tab">
        <IconButton className="tiny-button">
            <SettingsRoundedIcon/>
        </IconButton>
        <Divider/>
        <h2>Nobody is currently hosting any open games!</h2>
        <p className="main-tab-text"><Link to="/host">Try hosting one yourself</Link></p>
    </Paper>
}