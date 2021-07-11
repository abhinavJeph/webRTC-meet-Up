import * as wss from "./wss.js";

export const sendPreOffer = (callType, calleePersonalCode) => {
  let data = { callType: callType, calleePersonalCode: calleePersonalCode };
  wss.sendPreOffer(data);
};

export const handlePreOffer = (data) => {
  console.log("pre-offer came from server to webRTCHandler");
}