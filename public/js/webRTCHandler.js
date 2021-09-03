import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

const defaultConstraints = {
  audio: true,
  video: true
}

let peerConnection;
let dataChannel;

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902"
    },
  ]
}

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  dataChannel = peerConnection.createDataChannel("chat"); //label to our dataChanel = chat

  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log("Peer connection is ready to recieve data channel messages");
    }

    dataChannel.onmessage = (event) => {
      console.log("messages received");
      const message = JSON.parse(event.data);
      ui.appendMessage(message, false);
      console.log(message);
    }
  }

  // getting ice candidate from stun server
  peerConnection.onicecandidate = (event) => {
    console.log("getting ice candidate from stun server");
    if (event.candidate) {
      // send our ice candidate to other user
      console.log("sending ice candidate", event.candidate);
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: store.getConnectedUserDetails().socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      })
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

export const sendMessageUsingDataChannel = (messaage) => {
  const stringifiedMessage = JSON.stringify(messaage);
  dataChannel.send(stringifiedMessage);
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

export const handleWebRTCOffer = async (data) => {
  console.log("webRTC offer came");
  await peerConnection.setRemoteDescription(data.offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: store.getConnectedUserDetails().socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  })
}

export const handleWebRTCAnswer = async (data) => {
  console.log("handling webRTC answer");
  await peerConnection.setRemoteDescription(data.answer);
}

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.log("error occured when trying to add recieved ice candidate", err);
  }
}

export const switchBetweenCameraAndScreenSharing = async (screenSharingActive) => {
  try {
    let newStream;
    if (screenSharingActive) {
      const { localStream } = store.getState();
      store.getState().screenSharingStream.getTracks().forEach(track => track.stop()); //stop stream from sharing
      newStream = localStream;
    } else {
      console.log("switching fro screen sharing");
      const screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      store.setScreenSharingStream(screenSharingStream);
      newStream = screenSharingStream;
    }

    //replace track which sender is sending
    const senders = peerConnection.getSenders();
    const sender = senders.find(sender => {
      return sender.track.kind === newStream.getVideoTracks()[0].kind;
    })

    if (sender) {
      sender.replaceTrack(newStream.getVideoTracks()[0]);
    }
    ui.updateLocalVideo(newStream); //update local video with new stream
    store.setScreenSharingActive(!screenSharingActive);
  } catch (err) {
    console.log("error occured when trying to switch screen sharing stream", err)
  }
}

//hang up

export const handleHangUp = () => {
  console.log("finshing the call");
  const data = { connectedUserSocketId: store.getConnectedUserDetails().socketId };

  wss.sendUserHangedUp(data);
}

export const handleConnectedUserHangedUp = () => {
  console.log("connected peer hanged up");
}