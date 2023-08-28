import { send } from "../MessageManager";

const checkReadyHandler = (toId: any, toOrigin: any) => {
    send("check-ready-response", toId, { isReady: (window as any).isPayUIReady }, toOrigin);
};

export default checkReadyHandler;
