import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails;

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  };

  if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
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

  if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
}

const acceptCallHandler = () => {
  console.log("call accepted");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
}

const rejectCallHandler = () => {
  console.log("call rejected");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = () => {
  console.log("rejecting the call");
}

const sendPreOfferAnswer = (preOfferAnswer) => {
  let data = {
    callerPersonalCode: connectedUserDetails.socketId,
    preOfferAnswer: preOfferAnswer,
  }
  wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
  let { preOfferAnswer, calleePersonalCode } = data;
  console.log(preOfferAnswer + ' from ' + calleePersonalCode);
}