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
                <Grid item xs={12} display="flex" justifyContent={isAdmin ? "center" : (isCurrentUser ? "flex-end" : "flex-start")}>
                    {!isAdmin ? (
                        <Box
                            sx={{
                                maxWidth: '60%',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: isCurrentUser ? '#b2dfdb' : '#f1f0f0',
                                color: 'inherit',
                                textAlign: isCurrentUser ? "right" : "left",
                                boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                                wordBreak: 'break-word',
                            }}
                        >
                            <ListItemText
                                primary={data.message}
                                primaryTypographyProps={{ color: 'inherit' }}
                            />
                        </Box>
                    ) : (
                        <ListItemText
                            align="center"
                            primary={data.message}
                            primaryTypographyProps={{ color: '#00796b' }}
                        />
                    )}
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