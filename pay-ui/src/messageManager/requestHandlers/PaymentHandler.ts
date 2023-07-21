import { NavigateFunction } from "react-router-dom";

const paymentHandler = (params: any, toId: any, toOrigin: any, navigate: NavigateFunction) => {
    // TODO: handler logic here

    if (window.location.pathname.startsWith("/payment")) {
        navigate("/buffer", {
            replace: true,
            state: {
                nextPath: "/payment",
                nextParams: {
                    responseToOrigin: toOrigin,
                    responseToId: toId,
                    params: params,
                },
            },
        });
    } else {
        navigate("/payment", {
            replace: true,
            state: {
                responseToOrigin: toOrigin,
                responseToId: toId,
                params: params,
            },
        });
    }
};

export default paymentHandler;
