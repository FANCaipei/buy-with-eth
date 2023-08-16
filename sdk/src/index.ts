import BuyWithCrypto from "./BuyWithCrypto";
import FirebaseManager from "./firebase/firebaseManager";

FirebaseManager.init();
(window as any).buyWithCrypto = BuyWithCrypto;
BuyWithCrypto.getTokenConfigs();

export { BuyWithCrypto };
