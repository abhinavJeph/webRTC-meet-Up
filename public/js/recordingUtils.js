import * as store from "./store.js";

let mediaRecorder;
let recordedChunks = [];

const vp9Codec = "video/webm; codecs=vp=9";
const videoOptions = { mimeType: vp9Codec };

export const startRecording = () => {
    // console.log("startRecording-recordingUtils")
    const remoteStream = store.getState().remoteStream;

    if (MediaRecorder.isTypeSupported(vp9Codec)) {
        mediaRecorder = new MediaRecorder(remoteStream, videoOptions);
    } else {
        mediaRecorder = new MediaRecorder(remoteStream);
    }

    mediaRecorder.ondataavailable = handleDataAvailable; //will be called when recording is finished
    mediaRecorder.start();
}

export const pauseRecording = () => {
    // console.log("pauseRecording-recordingUtils")
    mediaRecorder.pause();
}

export const resumeRecording = () => {
    // console.log("resumeRecording-recordingUtils")
    mediaRecorder.resume();
}

export const stopRecording = () => {
    // console.log("stopRecording-recordingUtils")
    mediaRecorder.stop();
}

const downloadRecordedVideo = () => {
    // console.log("downloadRecordedVideo-recordingUtils")
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = "display: none;"
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
}

export const handleDataAvailable = (event) => {
    // console.log("handleDataAvailable-recordingUtils")
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
        downloadRecordedVideo();
    }
}