import Grid from "@mui/material/Grid2";
import {Box, ListItemText, Typography} from "@mui/material";
import React from "react";

const Message = ({message}) => {

    return (
        <Grid container direction = "column">
            <Grid item >
                <ListItemText
                    align={message.isCurrentUser ? "right" : "left"}
                    primary="unab"
                    primaryTypographyProps={{fontWeight: 'bold'}}
                />
            </Grid>

            <Grid container columns ={2} columnSpacing={1}>

                <Grid item >
                    <ListItemText
                        align={message.isCurrentUser ? "right" : "left"}
                        primary={message.text}
                    />
                </Grid>

                <Grid item >
                    <ListItemText

                        align={message.isCurrentUser ? "right" : "left"}
                        primary={message.time}
                        primaryTypographyProps={{fontWeight: 'light', fontSize: 16}}
                    />
                </Grid>

            </Grid>

        </Grid>
    )
}

export default Message;