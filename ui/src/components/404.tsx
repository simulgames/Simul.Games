import Paper from '@mui/material/Paper';
import './Main-tab.scss'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';

export const Error404 = () => {
    return <Paper className="main-tab">
        <h1>Under Construction!</h1>
        <ConstructionRoundedIcon sx={{fontSize:"20rem",marginInline:"auto"}}/>
        <p className="main-tab-text">This has either not yet been implemented (likely), or you got here through a bad link (unlikely)</p>
    </Paper>
}