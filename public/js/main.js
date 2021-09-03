import * as store from "./store.js";
import * as wss from "./wss.js";    //connection file
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as recordingUtils from "./recordingUtils.js";

// initialization of socket.io connection
const socket = io("/");
wss.registerSocketEvents(socket);
webRTCHandler.getLocalPreview() //set local video to local video container

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

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
})

personalCodeVideoButton.addEventListener("click", () => {
  const calleePersonalCode = document.getElementById("personal_code_input").value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
})

// event listener for video call buttons
const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  const { localStream } = store.getState();
  const auditTrack = localStream.getAudioTracks()[0];
  auditTrack.enabled = !auditTrack.enabled;   //toggle audio track 
  ui.updateMicButton(auditTrack.enabled);
})

const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  const { localStream } = store.getState();
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
  ui.updateCameraButton(videoTrack.enabled);
})

const switchForScreenSharingButton = document.getElementById("screen_sharing_button");
switchForScreenSharingButton.addEventListener("click", () => {
  const { screenSharingActive } = store.getState();
  webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
})

//messenger
const newMessageInput = document.getElementById("new_message_input");

const sendMessage = () => {
  console.log("Chat Occured");
  let message = newMessageInput.value;
  if(!!newMessageInput.value.trim()){
    webRTCHandler.sendMessageUsingDataChannel(message);
    ui.appendMessage(message, true);
  }
  newMessageInput.value = "";
}

newMessageInput.addEventListener("keydown", (event) => {
  const key = event.key;
  if(key === "Enter") {
    sendMessage();
  }
})

const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", sendMessage);

//recording
const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
})

const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", () => {
  recordingUtils.stopRecording();
  ui.hideRecordingPanel();
})

const pauseRecordingButton = document.getElementById("pause_recording_button");
pauseRecordingButton.addEventListener("click", () => {
  recordingUtils.pauseRecording();
  ui.switchBetweenRecordingButtons(true);
});

const resumeRecordingButton = document.getElementById("resume_recording_button");
resumeRecordingButton.addEventListener("click", () => {
  recordingUtils.resumeRecording();
  ui.switchBetweenRecordingButtons(false);
});

//hang up

const hangUpButton = document.getElementById("hang_up_button");
hangUpButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});

const hangUpChatButton = document.getElementById("finish_chat_call_button");
hangUpChatButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});
