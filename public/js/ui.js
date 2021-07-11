import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
    const personalCodeParagraph = document.getElementById("personal_code_paragraph");
    personalCodeParagraph.innerHTML = personalCode;
}

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    const callerTypeInfo = callType === constants.CALL_TYPE.CHAT_PERSONAL_CODE ? "chat" : "video";
    const incomingCallDialog = elements.getIncomingCallType(callerTypeInfo, acceptCallHandler, rejectCallHandler);

    const dialogHTML = document.getElementById("dialog");
    dialogHTML.querySelectorAll("*").forEach(dialog => dialog.remove());
    dialogHTML.appendChild(incomingCallDialog); 
}