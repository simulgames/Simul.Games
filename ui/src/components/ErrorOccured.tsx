import Paper from "@mui/material/Paper";
import {FallbackProps} from 'react-error-boundary'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';


export function ErrorOccurred (props:FallbackProps){
    return <Paper className="main-tab">
        <h1>An Error occurred!</h1>
        <ErrorRoundedIcon sx={{fontSize:"20rem",marginInline:"auto"}}/>
        <p className="main-tab-text">{props.error.message}</p>
    </Paper>
}