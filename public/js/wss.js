import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";

let socketIO = null

// listen to server
export const registerSocketEvents = (socket) => {
    socketIO = socket;

    socket.on("connect", () => {            //When Socket connected
        console.log("succesfully connected to socket.io server");
        store.setSocketId(socket.id);       // set socketId on state of user
        ui.updatePersonalCode(socket.id);   //set personalCode on UI
    });

    socket.on("pre-offer", (data) => {
        webRTCHandler.handlePreOffer(data)
    })

    // listens to the answer (accept or reject) from callee
    socket.on("pre-offer-answer", (data) => {
        webRTCHandler.handlePreOfferAnswer(data)
    })

    socket.on("webRTC-signaling", (data) => {
        switch (data.type) {
            case constants.webRTCSignaling.OFFER:
                webRTCHandler.handleWebRTCOffer(data)
                break;
            case constants.webRTCSignaling.ANSWER:
                // TODO
            break;
            case constants.webRTCSignaling.ICE_CANDIDATE:
                // TODO
            break;
        }
    })
}

export const sendPreOffer = (data) => {
    socketIO.emit("pre-offer", data);
}

export const sendPreOfferAnswer = (data) => {
    socketIO.emit("pre-offer-answer", data);
}

export const sendDataUsingWebRTCSignaling = (data) => {
    socketIO.emit("webRTC-signaling", data);
}