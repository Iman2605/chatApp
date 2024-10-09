import React from 'react';
import ChatBox from "./components/ChatBox";
import Grid from "@mui/material/Grid2";
import ActiveUsers from "./components/ActiveUsers";
import useSocket from "./services/socket";

const App = () => {
    const socket = useSocket();

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item size = {2} sx={{ height: '100%' }}>
                <ActiveUsers socket={socket} />
            </Grid>
            <Grid item size = {10} sx={{ height: '100%' }}>
                <ChatBox socket={socket} />
            </Grid>
        </Grid>
    );
};
export default App;