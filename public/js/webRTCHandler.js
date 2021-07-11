import * as wss from "./wss.js";

export const sendPreOffer = (callType, calleePersonalCode) => {
  let data = { callType: callType, calleePersonalCode: calleePersonalCode };
  wss.sendPreOffer(data);
};
