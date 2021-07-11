const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);    //io is my websocket server

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "public/index.html");
})

//to store the socket.id of user
let connectedPeers = [];

// when an connection is established
io.on("connection", (socket) =>{
    // socket is basically a connection between user and webSocket server
    console.log("User connected on socket.io server");
    console.log(socket.id);
    connectedPeers.push(socket.id);

    // listening to pre-offer emit event
    socket.on("pre-offer", (data) => {
        console.log("pre-offer came");
        console.log(data);
    })

    // user disconnected
    socket.on("disconnect", () => {
        console.log("User disconnected");
        connectedPeers = connectedPeers.filter(peerSocketId => peerSocketId != socket.id);
        console.log("total users online : " + connectedPeers.length);
    });
})

server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});
