import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
    const personalCodeParagraph = document.getElementById("personal_code_paragraph");
    personalCodeParagraph.innerHTML = personalCode;
}

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