import AppIdNotSetPage from "../../views/AppIdNotSet";
import BufferPage from "../../views/BufferPage";
import ConnectWallet from "../../views/ConnectWallet";
import NotFoundPage from "../../views/NotFound";
import PaymentPage from "../../views/Payment";
import ResultPage from "../../views/Result";
import AccessBannedPage from "../../views/AccessBanned";

const routeConfig = [
    // {
    //     path: "/",
    //     element: <Login />,
    //     noToken: true,
    // },
    { path: "/connect-wallet", Component: ConnectWallet },
    { path: "/payment", Component: PaymentPage },
    { path: "/buffer", Component: BufferPage },
    { path: "/result", Component: ResultPage },
    { path: "/app-id-missing", Component: AppIdNotSetPage },
    { path: "/access-deny", Component: AccessBannedPage },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
