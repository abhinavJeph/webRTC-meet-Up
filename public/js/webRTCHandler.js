import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails;

export const sendPreOffer = (callType, calleePersonalCode) => {
  let data = { callType: callType, calleePersonalCode: calleePersonalCode };
  wss.sendPreOffer(data);
};

export const handlePreOffer = (data) => {
  let { callType, callerPersonalCode } = data;
  connectedUserDetails = {
    callType,  
    socketId: callerPersonalCode,
  };

  if(callType === constants.CALL_TYPE.CHAT_PERSONAL_CODE || callType === constants.CALL_TYPE.VIDEO_PERSONAL_CODE) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
}

const acceptCallHandler = () => {
  console.log("call accepted");
}

const rejectCallHandler = () => {
  console.log("call rejected");
}
