import Grid from "@mui/material/Grid2";
import {Box, ListItemText, Typography} from "@mui/material";
import React from "react";

const Message = ({data, currentUser}) => {

    let isAdmin = data.sender === 'Admin';
    let isCurrentUser = currentUser === data.sender;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isAdmin ? 'center' : (isCurrentUser ? 'flex-end' : 'flex-start'),
                width: '100%',
                padding: '8px',
            }}
        >
            <Grid container direction="column" sx={{ width: '100%' }}>
                {!isAdmin && (
                    <Grid item>
                        <ListItemText
                            align={isCurrentUser ? "right" : "left"}
                            primary={data.sender}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                    </Grid>
                )}
                <Grid item>
                    <ListItemText
                        align={isAdmin ? "center" : (isCurrentUser ? "right" : "left")}
                        primary={data.message}
                        primaryTypographyProps={{ color: isAdmin ? '#00796b' : 'inherit' }}
                    />
                </Grid>
                <Grid item>
                    <ListItemText
                        align={isAdmin ? "center" : (isCurrentUser ? "right" : "left")}
                        primary={data.time}
                        primaryTypographyProps={{ fontWeight: 'light', fontSize: 12 }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Message;