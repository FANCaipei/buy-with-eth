import OcelotPay from "./OcelotPay";
import FirebaseManager from "./firebase/firebaseManager";

FirebaseManager.init();
(window as any).OcelotPay = OcelotPay;
OcelotPay.getTokenConfigs();

export { OcelotPay };
