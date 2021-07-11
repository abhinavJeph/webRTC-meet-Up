export const getIncomingCallType = (callerTypeInfo, acceptCallHandler, rejectCallHandler) => {
    console.log("call dialog box :" + callerTypeInfo );

    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = `Incoming ${callerTypeInfo} call`;
    dialogContent.appendChild(title);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avatarImagePath = "../utils/images/dialogAvatar.png"
    image.src = avatarImagePath;
    imageContainer.appendChild(image);
    dialogContent.appendChild(imageContainer); 

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    dialogContent.appendChild(buttonContainer);

    const acceptCallButton = document.createElement("button");
    acceptCallButton.classList.add("dialog_accept_call_button");
    const acceptCallImage = document.createElement("img");
    const acceptCallImagePath = "../utils/images/acceptCall.png";
    acceptCallImage.src = acceptCallImagePath;
    acceptCallButton.appendChild(acceptCallImage);
    buttonContainer.appendChild(acceptCallButton);
    
    const rejectCallButton = document.createElement("button");
    rejectCallButton.classList.add("dialog_reject_call_button");
    const rejectCallImage = document.createElement("img");
    const rejectCallImagePath = "../utils/images/rejectCall.png";
    rejectCallImage.src = rejectCallImagePath;
    rejectCallButton.appendChild(rejectCallImage);
    buttonContainer.appendChild(rejectCallButton);
    
    return dialog;
}

export const getCallingDialog = (callingDialogRejectCallHandler) => {
    console.log("calling dialog box");

    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = "Calling. . .";
    dialogContent.appendChild(title);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avatarImagePath = "../utils/images/dialogAvatar.png"
    image.src = avatarImagePath;
    imageContainer.appendChild(image);
    dialogContent.appendChild(imageContainer); 

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    dialogContent.appendChild(buttonContainer);
    
    const hangUpCallButton = document.createElement("button");
    hangUpCallButton.classList.add("dialog_reject_call_button");
    const hangUpCallImage = document.createElement("img");
    const rejectCallImagePath = "../utils/images/rejectCall.png";
    hangUpCallImage.src = rejectCallImagePath;
    hangUpCallButton.appendChild(hangUpCallImage);
    buttonContainer.appendChild(hangUpCallButton);
    
    return dialog;
}