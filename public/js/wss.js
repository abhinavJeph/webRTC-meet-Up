import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";

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
}

export const sendPreOffer = (data) => {
    socketIO.emit("pre-offer", data);
}