import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";
import EmailVerifyPage from "../../views/EmailVerify";

const routeConfig = [
    { path: "/auth", Component: AuthPage },
    { path: "/emailVerify", Component: EmailVerifyPage },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
