import TargetManager from "./TargetManager";

const send = (subType: string, responseId: string | number | null, params: any, responseOrigin?: string) => {
    // if (!responseOrigin && !TargetManager.getCurrentTargetOrigin()) {
    //     console.error("no specific target");
    //     return;
    // }
    window.parent.postMessage(
        {
            type: "buy-with-crypto",
            subType: subType,
            respTo: responseId,
            data: params,
        },
        // if no specific target origin, make broadcast
        responseOrigin ?? TargetManager.getCurrentTargetOrigin() ?? "*"
    );
};

// const sendEvent = (eventType, eventData) => {
//     send("buy-with-crypto-event", null, { eventType: eventType, eventData: eventData });
// };

// const isReady = () => {
//     send("buy-with-crypto-ready", null, null);
// };

export { send };
