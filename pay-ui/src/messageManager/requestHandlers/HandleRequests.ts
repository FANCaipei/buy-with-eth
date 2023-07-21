import { NavigateFunction } from "react-router-dom";
import paymentHandler from "./PaymentHandler";

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
};

export default HandleRequests;
