import * as store from "./store.js";
import * as wss from "./wss.js";

// initialization of socket.io connection
const socket = io("/");
wss.registerSocketEvents(socket);

// register event for personalCode copy button
const personalCodeCopyButton = document.getElementById("personal_code_copy_button");
personalCodeCopyButton.addEventListener("click", () =>{
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
})

