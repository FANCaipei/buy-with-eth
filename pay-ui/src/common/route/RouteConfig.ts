import BufferPage from "../../views/BufferPage";
import ConnectWallet from "../../views/ConnectWallet";
import NotFoundPage from "../../views/NotFound";
import PaymentPage from "../../views/Payment";

const routeConfig = [
    // {
    //     path: "/",
    //     element: <Login />,
    //     noToken: true,
    // },
    { path: "/connect-wallet", Component: ConnectWallet },
    { path: "/payment", Component: PaymentPage },
    { path: "/buffer", Component: BufferPage },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
