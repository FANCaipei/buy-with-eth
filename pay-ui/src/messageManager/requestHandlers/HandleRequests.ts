import { NavigateFunction } from "react-router-dom";
import paymentHandler from "./PaymentHandler";
import checkReadyHandler from "./CheckReadyHandler";

const HandleRequests = async (event: any, navigate: NavigateFunction) => {
    if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "buy-with-crypto-request") {
        switch (event?.data?.data?.method) {
            case "request_payment":
                paymentHandler(event.data.data.params, event.data.requestId, event.origin, navigate);
                return;
            default:
                return;
        }
    }
    if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "check-ready-request") {
        checkReadyHandler(event.data.requestId, event.origin);
        return;
    }
};

export default HandleRequests;
