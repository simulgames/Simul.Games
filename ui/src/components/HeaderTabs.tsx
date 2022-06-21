import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import React from "react";
import {useNavigate, useLocation} from "react-router-dom";

interface LinkTabProps {
    label?: string;
    href: string;
}

function LinkTab(props: LinkTabProps) {
    let navigate = useNavigate();
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                navigate(props.href)
            }}
            {...props}
        />
    );
}


export const HeaderTabs = (props : any) => {

    let location = useLocation();
    function getTabIndex(){
        switch(location.pathname){
            case("/"):
                return 0
            case("/host"):
                return 1
            case("/about"):
                return 2
        }
        return false
    }

    return (
        <Box sx={props.menuOpen ? {borderBottom: 1, borderColor: 'divider'} : {visibility:"hidden",height:0,width:0}}>
        <Tabs indicatorColor="primary" textColor="inherit" variant="fullWidth" value={getTabIndex()}>
            <LinkTab label="Play" href="/"/>
            <LinkTab label="Host" href="/host"/>
            <LinkTab label="About" href="/about"/>
        </Tabs>
    </Box>);
    }