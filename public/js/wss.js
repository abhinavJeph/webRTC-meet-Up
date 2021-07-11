import * as store from "./store.js";
import * as ui from "./ui.js";

export const registerSocketEvents = (socket) => {
    socket.on("connect", () => {            //When Socket connected
        console.log("succesfully connected to socket.io server");
        store.setSocketId(socket.id);       // set socketId on state of user
        ui.updatePersonalCode(socket.id);   //set personalCode on UI
    });
}
