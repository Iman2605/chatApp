import React, {useEffect, useState} from "react";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {Box, List, ListItem, ListItemIcon, ListItemText, Grid2, Typography} from "@mui/material";
import Message from "./Message";

const ActiveUsers = ({socket}) => {
    const [activeUsers, setActiveUsers] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('active_users', (data) => {
            setActiveUsers(data)
        })
        return () => {
            socket.off('active_users');
        };
    }, [socket]);

    return(
        <Grid2 container sx = {{width: '100%', alignItems: 'flex-start'}}>
            <Box sx={{ padding: '10px', color: 'black', width: '100%'}}>
                <Typography variant="h5" align="center">Active Users</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px'}}>
                <List>
                    {activeUsers && activeUsers.map((user, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <PersonOutlineIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={user}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Grid2>
    )
}

export default ActiveUsers;