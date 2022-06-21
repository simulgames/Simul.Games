import Paper from "@mui/material/Paper";
import {CircularProgress} from "@mui/material";
import SignalWifiOffRoundedIcon from '@mui/icons-material/SignalWifiOffRounded';
import * as React from "react";
import {useEffect} from "react";
import {ConnectionState} from "../../props/WebSockets";


type Props = {state:ConnectionState
};

export const Loading = (props:Props) => {

    const [showLoadingMessage,setShowLoadingMessage] = React.useState(false)

    function DisconnectedError() {
        return <React.Fragment>
            <span className="main-tab-text error-msg">Could not connect to server!</span>
            <SignalWifiOffRoundedIcon sx={{margin:"auto",fontSize:"3rem"}}/>
        </React.Fragment>
    }

    function LoadingMessage(){
        return <React.Fragment>
            <span className="main-tab-text"> Loading...</span>
            <CircularProgress sx={{margin:"auto"}}/>
        </React.Fragment>
    }

    useEffect(() => {
        const timeout = setTimeout(() => { //Start the timer
            setShowLoadingMessage(true)
        }, 1000)
        return () => clearTimeout(timeout)
    })

    return showLoadingMessage ? <Paper className = "main-tab">
        {props.state === ConnectionState.CLOSED ? DisconnectedError() : LoadingMessage()}
       </Paper> : <React.Fragment/>
}