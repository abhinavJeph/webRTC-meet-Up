import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

const defaultConstraints = {
  audio: true,
  video: true
}

let peerConnection;

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902"
    },
  ]
}

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  // getting ice candidate from stun server
  peerConnection.onicecandidate = (event) => {
    console.log("getting ice candidate from stun server");
    if (event.candidate) {
      // send our ice candidate to other user
    }
  }

  // this will occur when ice candidates are exchanged succesfully
  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState == "connected") {
      console.log("Successfully connected with other peer");
    }
  }

  //recieving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteStream(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  }

  // add our stream to peer connection
  if (store.getConnectedUserDetails().callType === constants.callType.VIDEO_PERSONAL_CODE) {
    const localStream = store.getState().localStream;

    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
}

export const getLocalPreview = () => {
  navigator.mediaDevices.getUserMedia(defaultConstraints).then((stream) => {
    ui.updateLocalVideo(stream);
    store.setLocalStream(stream);
  }).catch((error) => {
    console.log("Error occured when trying to get access to camera");
    console.log(error);
  })
}

export const sendPreOffer = (callType, calleePersonalCode) => {
  store.setConnectedUserDetails({
    callType,
    socketId: calleePersonalCode,
  })

  if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    let data = { callType, calleePersonalCode };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  let { callType, callerPersonalCode } = data;
  store.setConnectedUserDetails({
    callType,
    socketId: callerPersonalCode,
  })

  if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
}

const acceptCallHandler = () => {
  console.log("call accepted");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(store.getConnectedUserDetails().callType); //show call elment buttons based on call type
  createPeerConnection()
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
    callerPersonalCode: store.getConnectedUserDetails().socketId,
    preOfferAnswer: preOfferAnswer,
  }

  ui.removeAllDialogs(); // remove all dialog inside html dialog element
  wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
  let { preOfferAnswer, calleePersonalCode } = data;
  console.log(preOfferAnswer + " from " + calleePersonalCode);
  ui.removeAllDialogs(); // remove all dialog inside html dialog element

  switch (preOfferAnswer) {
    case constants.preOfferAnswer.CALL_ACCEPTED:
      ui.showCallElements(store.getConnectedUserDetails().callType); //show call elment buttons based on call type
      createPeerConnection();
      sendWebRTCOffer();
      // show the dialog that call is accepted by the callee
      break;
    case constants.preOfferAnswer.CALL_REJECTED:
      ui.showInfoDialog(preOfferAnswer);
      // show the dialog that call is accepted by the callee
      break;
    case constants.preOfferAnswer.CALL_UNAVAILABLE:
      ui.showInfoDialog(preOfferAnswer);
      // show the dialog that callee is not able to connect
      break;
    case constants.preOfferAnswer.CALLEE_NOT_FOUND:
      ui.showInfoDialog(preOfferAnswer);
      // show the dialog that callee has not been found
      break;
  }
}

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer(); //our sdp information
  await peerConnection.setLocalDescription(offer); //save sdp information in local 

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: store.getConnectedUserDetails().socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,   // offer = {sdp, type}
  });  
}

export const handleWebRTCOffer = (data) => {
  console.log("webRTC offer came");
  console.log(data);
}