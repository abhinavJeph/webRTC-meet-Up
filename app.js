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
io.on("connection", (socket) => {
    // socket is basically a connection between user and webSocket server
    console.log("User connected on socket.io server");
    console.log(socket.id);
    connectedPeers.push(socket.id);

    // listening to pre-offer emit event
    socket.on("pre-offer", (data) => {
        const { callType, calleePersonalCode } = data;
        const callerPersonalCode = socket.id;

        //secondary user exist ?
        const connectedPeer = connectedPeers.find(peerSocketId => {
            return peerSocketId === calleePersonalCode;
        })

        // emit pre-offer to secondary user if he exists
        if (connectedPeer) {
            let data = { callType, callerPersonalCode };
            io.to(calleePersonalCode).emit("pre-offer", data);
        } else {
            //else send caller info that callee not found
            let data = {
                preOfferAnswer: "CALLEE_NOT_FOUND", calleePersonalCode
            };
            io.to(callerPersonalCode).emit("pre-offer-answer", data);
        }
    })

    socket.on("pre-offer-answer", (data) => {
        const { preOfferAnswer, callerPersonalCode } = data;
        const calleePersonalCode = socket.id;

        //caller/primary user exist ?
        const connectedPeer = connectedPeers.find(peerSocketId => {
            return peerSocketId === callerPersonalCode;
        })

        // emit pre-offer to primary user if he exists
        if (connectedPeer) {
            let data = { preOfferAnswer, calleePersonalCode }
            io.to(callerPersonalCode).emit("pre-offer-answer", data);
        }

    })

    socket.on("webRTC-signaling", (data) => {
        const { connectedUserSocketId } = data;

        const connectedPeer = connectedPeers.find(peerSocketId => {
            return peerSocketId === connectedUserSocketId;
        })

        // emit pre-offer to primary user if he exists
        if (connectedPeer) {
            io.to(connectedUserSocketId).emit("webRTC-signaling", data);
        }
    })

    socket.on("user-hanged-up", (data) => {
        const { connectedUserSocketId } = data;

        const connectedPeer = connectedPeers.find(peerSocketId => {
            return peerSocketId === connectedUserSocketId;
        })

        // emit hang up offer to other user if he exists
        if (connectedPeer) {
            io.to(connectedUserSocketId).emit("user-hanged-up");
        }
    })

    // user disconnected
    socket.on("disconnect", () => {
        console.log("User disconnected");
        connectedPeers = connectedPeers.filter(peerSocketId => peerSocketId !== socket.id);
        console.log("total users online : " + connectedPeers.length);
    });
})

server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});
