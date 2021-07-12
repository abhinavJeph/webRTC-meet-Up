import * as store from "./store.js";
import * as wss from "./wss.js";      //connection file
import * as constants from "./constants.js";
import * as webRtcHandler from "./webRtcHandler.js";

// initialization of socket.io connection
const socket = io("/");
wss.registerSocketEvents(socket);
webRtcHandler.getLocalPreview() //set local video to local video container

// register event listner for personalCode copy button
const personalCodeCopyButton = document.getElementById("personal_code_copy_button");
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
})

// register event listeners for connection call_buttons
const personalCodeChatButton = document.getElementById("personal_code_chat_button");
const personalCodeVideoButton = document.getElementById("personal_code_video_button");

personalCodeChatButton.addEventListener("click", () => {
  const calleePersonalCode = document.getElementById("personal_code_input").value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;

  webRtcHandler.sendPreOffer(callType, calleePersonalCode);
})

personalCodeVideoButton.addEventListener("click", () => {
  const calleePersonalCode = document.getElementById("personal_code_input").value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;

  webRtcHandler.sendPreOffer(callType, calleePersonalCode);
})