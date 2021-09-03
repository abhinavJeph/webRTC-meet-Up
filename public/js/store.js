//initial state
let state = {
    socketId: null,
    localStream: null,
    remoteStream: null,
    screenSharingStream: null,
    allowConnectionsFromStrangers: false,
    screenSharingActive: false,
}

const setStateField = (field, value) => {
    if (!state.hasOwnProperty(field)) {
        throw new Error("state does not have property " + field);
    }
    state[field] = value;
    console.log("Updated State: ", state);
}

export const setSocketId = (socketId) => {
    setStateField("socketId", socketId);
}

export const setLocalStream = (localStream) => {
    setStateField("localStream", localStream);
}

export const setRemoteStream = (remoteStream) => {
    setStateField("remoteStream", remoteStream);
}

export const setScreenSharingStream = (screenSharingStream) => {
    setStateField("screenSharingStream", screenSharingStream);
}

export const setAllowConnectionsFromStrangers = (allowConnectionsFromStrangers) => {
    setStateField("allowConnectionsFromStrangers", allowConnectionsFromStrangers)
}

export const setScreenSharingActive = (screenSharingActive) => {
    setStateField("screenSharingActive", screenSharingActive);
}

export const getState = () => {
    return state;
}

let connectedUserDetails = {
    callType: null,
    socketId: null,
}

export const setConnectedUserDetails = (data) => {
    if(data == null) {
        connectedUserDetails = {
            callType: null,
            socketId: null,
        }
    }else {
        connectedUserDetails.callType = data.callType ? data.callType : connectedUserDetails.callType;
        connectedUserDetails.socketId = data.socketId ? data.socketId : connectedUserDetails.socketId;
    }
}

export const getConnectedUserDetails = () => {
    return connectedUserDetails;
}
