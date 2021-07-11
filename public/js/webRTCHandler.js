import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails;

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,  
    socketId: calleePersonalCode,
  };

  if(callType === constants.CALL_TYPE.CHAT_PERSONAL_CODE || callType === constants.CALL_TYPE.VIDEO_PERSONAL_CODE) {
    let data = { callType, calleePersonalCode };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data);
  }
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

const callingDialogRejectCallHandler = () => {
  console.log("rejecting the call");
}
