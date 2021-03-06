import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
    const personalCodeParagraph = document.getElementById("personal_code_paragraph");
    personalCodeParagraph.innerHTML = personalCode;
}

export const updateLocalVideo = (stream) => {
    const localVideo = document.getElementById("local_video");
    localVideo.srcObject = stream;

    localVideo.addEventListener("loadedmetadata", () => {
        localVideo.play();
    })
}

//buttons with which we can make video calls
export const showVideoCallButtons = () => {
    const personalCodeVideoButton = document.getElementById("personal_code_video_button");
    const strangerVideoButton = document.getElementById("stranger_video_button");

    showElement(personalCodeVideoButton);
    showElement(strangerVideoButton);
}

export const updateRemoteStream = (stream) => {
    const remoteVideo = document.getElementById("remote_video");
    remoteVideo.srcObject = stream;

    remoteVideo.addEventListener("loadedmetadata", () => {
        remoteVideo.play();
    })
}

//Incoming call pop up
export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    const callerTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? "chat" : "video";
    const incomingCallDialog = elements.getIncomingCallType(callerTypeInfo, acceptCallHandler, rejectCallHandler);

    // remove all dialog inside html dialog element
    const dialogHTML = document.getElementById("dialog");
    dialogHTML.querySelectorAll("*").forEach(dialog => dialog.remove());

    dialogHTML.appendChild(incomingCallDialog);
}

export const showCallingDialog = (callingDialogRejectCallHandler) => {
    const callingDialog = elements.getCallingDialog(callingDialogRejectCallHandler);

    // remove all dialog inside html dialog element
    removeAllDialogs();

    const dialogHTML = document.getElementById("dialog");
    dialogHTML.appendChild(callingDialog);
}

export const removeAllDialogs = () => {
    // remove all dialog inside html dialog element
    const dialogHTML = document.getElementById("dialog");
    dialogHTML.querySelectorAll("*").forEach(dialog => dialog.remove());
}

export const showNoStrangerAvailableDialogue = () => {
    const infoDialog = elements.getInfoDialog("No Stranger Available", "Please try again later");
    if (infoDialog) {
        const dialog = document.getElementById("dialog");
        dialog.appendChild(infoDialog);

        setTimeout(removeAllDialogs, 4000);
    }
}

export const showInfoDialog = (preOfferAnswer) => {
    let infoDialog;

    switch (preOfferAnswer) {
        case constants.preOfferAnswer.CALL_ACCEPTED:
            // show the dialog that call is accepted by the callee
            infoDialog = elements.getInfoDialog("Call accepted", "Callee accepted your call");
            break;
        case constants.preOfferAnswer.CALL_REJECTED:
            // show the dialog that call is accepted by the callee
            infoDialog = elements.getInfoDialog("Call rejected", "Callee rejected your call");
            break;
        case constants.preOfferAnswer.CALL_UNAVAILABLE:
            // show the dialog that callee is not able to connect
            infoDialog = elements.getInfoDialog("Call is not possible", "Probably callee is busy. Please try again later");
            break;
        case constants.preOfferAnswer.CALLEE_NOT_FOUND:
            // show the dialog that callee has not been found
            infoDialog = elements.getInfoDialog("Callee not found", "Please check personal code");
            break;
    }

    if (infoDialog) {
        const dialog = document.getElementById("dialog");
        dialog.appendChild(infoDialog);

        setTimeout(removeAllDialogs, 4000);
    }
}

export const showCallElements = (callType) => {
    switch (callType) {
        case constants.callType.CHAT_PERSONAL_CODE:
            showChatCallElements();
            break;
        case constants.callType.CHAT_STRANGER:
            showChatCallElements();
            break;
        case constants.callType.VIDEO_PERSONAL_CODE:
            showVideoCallElements();
            break;
        case constants.callType.VIDEO_STRANGER:
            showVideoCallElements();
            break;
    }
}

const showChatCallElements = () => {
    const finishConnectionChatButtonContainer = document.getElementById("finish_chat_button_container");
    showElement(finishConnectionChatButtonContainer);

    const newMessageContainer = document.getElementById("new_message");
    showElement(newMessageContainer);

    disableDashboard();
}

const showVideoCallElements = () => {
    const callButtons = document.getElementById("call_buttons");
    showElement(callButtons);

    const placeHolder = document.getElementById("video_placeholder");
    hideElement(placeHolder);

    const remoteVideo = document.getElementById("remote_video");
    showElement(remoteVideo);

    const newMessageContainer = document.getElementById("new_message");
    showElement(newMessageContainer);

    disableDashboard();
}

// ui call buttons

const micOnImgSrc = "../utils/images/mic.png"
const micOffImgSrc = "../utils/images/micOff.png"
export const updateMicButton = (micActive) => {
    const micButtonImage = document.getElementById("mic_button_image");
    micButtonImage.src = micActive ? micOnImgSrc : micOffImgSrc;
}

const cameraOnImgSrc = "../utils/images/camera.png";
const cameraOffImgSrc = "../utils/images/cameraOff.png";
export const updateCameraButton = (cameraActive) => {
    const cameraButtonImage = document.getElementById("camera_button_image");
    cameraButtonImage.src = cameraActive ? cameraOnImgSrc : cameraOffImgSrc;
}

//ui after hang up
export const updateUIAfterHangUp = (callType) => {
    enableDashboard();

    //hide the call buttons
    if (callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER) {
        const callButtons = document.getElementById("call_buttons");
        hideElement(callButtons);
    } else { //chat buttons
        const chatCallButtons = document.getElementById("finish_chat_button_container");
        hideElement(chatCallButtons);
    }

    const newMessageInput = document.getElementById("new_message");
    hideElement(newMessageInput);
    clearMessage();

    updateMicButton(false);
    updateCameraButton(false);

    //hide remoteVideo and show placeHolder
    const remoteVideo = document.getElementById("remote_video");
    hideElement(remoteVideo);

    const placeHolder = document.getElementById("video_placeholder");
    showElement(placeHolder);

    removeAllDialogs(); // call dialogue
}

export const updateStrangerCheckBox = (allowConnections) => {
    const checkboxImg = document.getElementById("allow_strangers_checkbox_image");
    allowConnections ? showElement(checkboxImg) : hideElement(checkboxImg);
}

// ui helper functions
const disableDashboard = () => {
    const dashboardBlocker = document.getElementById("dashboard_blur");
    if (dashboardBlocker.classList.contains("display_none")) {
        dashboardBlocker.classList.remove("display_none")
    }
}

// block panel 
const enableDashboard = () => {
    const dashboardBlocker = document.getElementById("dashboard_blur");
    if (!dashboardBlocker.classList.contains("display_none")) {
        dashboardBlocker.classList.add("display_none")
    }
}

const hideElement = (element) => {
    if (!element.classList.contains("display_none")) {
        element.classList.add("display_none")
    }
}

const showElement = (element) => {
    if (element.classList.contains("display_none")) {
        element.classList.remove("display_none")
    }
}

//ui messages
export const appendMessage = (message, isRight = false) => {
    const messagesContainer = document.getElementById("messages_container");
    const messageElement = elements.getMessage(message, isRight);
    messagesContainer.appendChild(messageElement);
}

export const clearMessage = () => {
    const messageContainer = document.getElementById("messages_container");
    messageContainer.querySelectorAll("*").forEach(n => n.remove());
}

// recording
export const showRecordingPanel = () => {
    const recordingButtons = document.getElementById("video_recording_buttons");
    showElement(recordingButtons);

    // hide start recording button if active
    const startRecordingButton = document.getElementById("start_recording_button");
    hideElement(startRecordingButton);
}

export const hideRecordingPanel = () => {
    const recordingButtons = document.getElementById("video_recording_buttons");
    hideElement(recordingButtons);

    // show start recording button
    const startRecordingButton = document.getElementById("start_recording_button");
    showElement(startRecordingButton);
}

export const switchBetweenRecordingButtons = (showResumeButton = false) => {
    // console.log("switchBetweenRecordingButtons-ui")
    const pauseRecordingButton = document.getElementById("pause_recording_button");
    const resumeRecordingButton = document.getElementById("resume_recording_button");

    if (showResumeButton) {
        showElement(resumeRecordingButton);
        hideElement(pauseRecordingButton);
    } else {
        showElement(pauseRecordingButton);
        hideElement(resumeRecordingButton);
    }
}