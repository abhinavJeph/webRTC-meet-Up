export const getIncomingCallType = (callerTypeInfo, acceptCallHandler, rejectCallHandler) => {
    console.log("call dialog box :" + callerTypeInfo);

    const dialogContent = getDialogBox(`Incoming ${callerTypeInfo} call`);
    const dialog = dialogContent.parentElement;

    const imageContainer = getDialogImageContainer();
    dialogContent.appendChild(imageContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    dialogContent.appendChild(buttonContainer);

    const acceptCallButton = getAcceptCallButton();
    buttonContainer.appendChild(acceptCallButton);

    const rejectCallButton = getRejectCallButton();
    buttonContainer.appendChild(rejectCallButton);

    acceptCallButton.addEventListener("click", () => {
        acceptCallHandler();
    })

    rejectCallButton.addEventListener("click", () => {
        rejectCallHandler();
    })

    return dialog;
}

export const getCallingDialog = (callingDialogRejectCallHandler) => {
    console.log("calling dialog box");

    const dialogContent = getDialogBox("Calling. . .");
    const dialog = dialogContent.parentElement;

    const imageContainer = getDialogImageContainer()
    dialogContent.appendChild(imageContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    dialogContent.appendChild(buttonContainer);

    const hangUpCallButton = getRejectCallButton();
    buttonContainer.appendChild(hangUpCallButton);

    return dialog;
}

export const getInfoDialog = (dialogTitle, dialogDescription) => {
    console.log("Info call dialog box");

    const dialogContent = getDialogBox(dialogTitle);
    const dialog = dialogContent.parentElement;

    const imageContainer = getDialogImageContainer()
    dialogContent.appendChild(imageContainer);

    const description = document.createElement('div');
    description.classList.add("dialog_description");
    description.innerHTML = dialogDescription;
    dialogContent.appendChild(description);

    return dialog;
}

const getDialogImageContainer = () => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avatarImagePath = "../utils/images/dialogAvatar.png"
    image.src = avatarImagePath;
    imageContainer.appendChild(image);
    return imageContainer;
}

const getRejectCallButton = () => {
    const rejectCallButton = document.createElement("button");
    rejectCallButton.classList.add("dialog_reject_call_button");
    const rejectCallImage = document.createElement("img");
    const rejectCallImagePath = "../utils/images/rejectCall.png";
    rejectCallImage.src = rejectCallImagePath;
    rejectCallButton.appendChild(rejectCallImage);
    return rejectCallButton;
}

const getAcceptCallButton = () => {
    const acceptCallButton = document.createElement("button");
    acceptCallButton.classList.add("dialog_accept_call_button");
    const acceptCallImage = document.createElement("img");
    const acceptCallImagePath = "../utils/images/acceptCall.png";
    acceptCallImage.src = acceptCallImagePath;
    acceptCallButton.appendChild(acceptCallImage);
    return acceptCallButton;
}

const getDialogBox = (dialogTitle) => {
    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = dialogTitle;
    dialogContent.appendChild(title);
    return dialogContent;
}